"use client";

import Button from "@/components/button";
import Input from "../../components/input";
import Link from "next/link";
import { useActionState } from "react";
import { login } from "./actions";

export default function Login() {
    const [state, action] = useActionState(login, null);

    return (
        <div
            className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-b from-gray-800 to-gray-700"
        >
            <div className="bg-white/10 backdrop-blur-xl shadow-2xl rounded-2xl p-8 max-w-md w-full border border-gray-600">
                <div className="flex flex-col items-center gap-6">
                    {/* Logo */}
                    <Link href="/" className="font-extrabold text-4xl text-white tracking-wide">
                        AURA
                    </Link>
                    <h2 className="text-gray-300 text-lg">Welcome Back! Login to Your Account</h2>
                </div>

                {/* LOGIN FORM */}
                <form action={action} className="flex flex-col gap-4 mt-6">
                    <Input
                        name="email"
                        required
                        type="email"
                        placeholder="Email"
                        className="rounded-lg text-gray-300 border-gray-500 bg-gray-800/50 shadow-lg focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                        errors={state?.fieldErrors.email}
                    />
                    <Input
                        name="password"
                        required
                        type="password"
                        placeholder="Password"
                        className="rounded-lg border-gray-500 bg-gray-800/50 text-gray-300 shadow-lg focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                        errors={state?.fieldErrors.password}
                    />
                    <Button
                        text="Login"
                    />
                </form>

                {/* create Account */}
                <div className="mt-4 text-center">
                    <p className="text-gray-400 text-sm">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="text-blue-400 hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
