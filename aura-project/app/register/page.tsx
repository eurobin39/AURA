"use client";

import Input from "../../components/input";
import { useActionState } from "react";
import { createAccount } from "./actions";
import Button from "@/components/button";
import Link from "next/link";

export default function CreateAccount() {
  const [state, action] = useActionState(createAccount, null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-b from-gray-800 to-gray-700">
      <div className="bg-white/10 backdrop-blur-xl shadow-2xl rounded-2xl p-8 max-w-md w-full border border-gray-600">
        <div className="flex flex-col gap-3 items-center">
          <Link href="/" className="font-extrabold text-4xl text-white tracking-wide">
            AURA
          </Link>
          <h2 className="text-lg text-gray-300">Join the Community!</h2>
        </div>
        <form action={action} className="flex flex-col gap-4 mt-6">
          <Input
            name="username"
            required
            type="text"
            placeholder="Username"
            className="rounded-lg border-gray-500 bg-gray-800/50 text-gray-300 shadow-lg focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
            errors={state?.fieldErrors.username}
          />
          <Input
            name="email"
            required
            type="email"
            placeholder="Email"
            className="rounded-lg border-gray-500 bg-gray-800/50 text-gray-300 shadow-lg focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
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
          <Input
            name="confirmPassword"
            required
            type="password"
            placeholder="Confirm Password"
            className="rounded-lg border-gray-500 bg-gray-800/50 text-gray-300 shadow-lg focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
            errors={state?.fieldErrors.confirmPassword}
          />

          <Button text="Create Account" />
        </form>
        <p className="mt-4 text-center text-gray-400 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-400 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
