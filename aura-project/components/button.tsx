"use client"

import { useFormStatus } from "react-dom";

interface ButtonProps {
    text: string;
    disabled?: boolean; // Adding optional disabled prop
}

export default function Button({ text, disabled = false }: ButtonProps) {
    const { pending } = useFormStatus();
    return (
        <button
            disabled={disabled || pending} // Use disabled prop or pending state to disable the button
            className={`primary-btn h-10 ${disabled || pending ? 'disabled:bg-neutral-400 disabled:text-neutral-300 disabled:cursor-not-allowed' : ''}`}>
            {pending ? "Loading..." : text}
        </button>
    );
}
