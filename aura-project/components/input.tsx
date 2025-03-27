import { InputHTMLAttributes } from "react";

interface InputProps {
    errors?: string[];
    name: string;
    defaultValue?: string;
}

export default function Input({ name, errors = [], ...rest }: InputProps & InputHTMLAttributes<HTMLInputElement>) {
    return (
        <div className="flex flex-col gap-1.5">
            <input
                name={name}
                className={`bg-gray-800/50 text-white rounded-lg w-full h-12 px-4 
                           border border-gray-600 placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-blue-500 
                           transition-all duration-300 shadow-lg
                           disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed`}
                {...rest}
            />
            {errors.length > 0 && (
                <div className="text-red-400 text-sm font-medium">
                    {errors.map((error, index) => (
                        <p key={index}>{error}</p>
                    ))}
                </div>
            )}
        </div>
    );
}