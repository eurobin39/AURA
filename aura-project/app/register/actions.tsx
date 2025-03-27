"use server";

import { z } from "zod";
import db from "@/lib/db"
import { PASSWORD_REGEX } from "@/lib/constants";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import getSession from "@/lib/session"

const checkPassWord = ({ password, confirmPassword }: { password: string, confirmPassword: string }) =>
    password === confirmPassword;

const formSchema = z.object({
    username: z.string().min(3).max(10).trim().toLowerCase(),
    email: z.string().email().toLowerCase(),
    password: z.string().min(10).regex(PASSWORD_REGEX, "password must have lowercase, UPPERCASE, number and special Character!"),
    confirmPassword: z.string().min(10),
}).superRefine(async ({ username }, ctx) => {
    const user = await db.user.findUnique({
        where: {
            username,
        },
        select: {
            id: true
        }
    });
    if (user) {
        ctx.addIssue({
            code: 'custom',
            message: "this username is already taken",
            path: [username],
            fatal: true,
        });
        return z.NEVER;
    }
}
).superRefine(async ({ email }, ctx) => {
    const user = await db.user.findUnique({
        where: {
            email,
        },
        select: {
            id: true
        }
    });
    if (user) {
        ctx.addIssue({
            code: 'custom',
            message: "this email is already taken",
            path: [email],
            fatal: true,
        });
        return z.NEVER;
    }
}
).refine(checkPassWord, {
    message: "confirm password is different!",
    path: ["confirmPassword"],
});

export async function createAccount(
    prevState: { 
      fieldErrors?: { 
        username?: string[], 
        email?: string[], 
        password?: string[], 
        confirmPassword?: string[] 
      } 
    } | null, 
    formData: FormData
  ) {
    const data = {
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword"),
    };

    const result = await formSchema.safeParseAsync(data);
    if (!result.success) {
        return result.error.flatten();
    } else {
        const hashedPassword = await bcrypt.hash(result.data.password, 12);

        const user = await db.user.create({
            data: {
                username: result.data.username,
                email: result.data.email,
                password: hashedPassword,
                
            },
            select: {
                id: true,
            },
        });
        const session = await getSession();

        session.id = user.id
        await session.save();
        redirect("/home"); // Redirect to a pending approval page
    }
}