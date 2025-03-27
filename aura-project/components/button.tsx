"use client"

import { useFormStatus } from "react-dom";

interface ButtonProps {
    text: string;
    disabled?: boolean;
}

export default function Button({ text, disabled = false }: ButtonProps) {
    const { pending } = useFormStatus();

    return (
        <button
            disabled={disabled || pending}
            className={`
                flex items-center justify-center w-full h-12 
                rounded-lg font-semibold transition-all duration-300
                text-white shadow-lg hover:scale-105 active:scale-100
                ${disabled || pending ? "bg-gray-500 cursor-not-allowed" 
                                     : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"}
            `}
        >
            {pending ? (
                <span className="flex items-center gap-2">
                    <span className="animate-spin h-5 w-5 border-4 border-t-transparent border-white rounded-full"></span>
                    Loading...
                </span>
            ) : text}
        </button>
    );
}