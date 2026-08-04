import type { UseFormRegister, RegisterOptions } from "react-hook-form";

interface InputProps {
    type: string;
    placeholder: string;
    name: string;
    register: UseFormRegister<any>;
    error?: string;
    rules?: RegisterOptions;
}

export function Input({type, placeholder, name, register, error, rules}: InputProps) {
    return (
        <div>
            <input
            className="w-full border-1 border-mist-300 h-10 px-3 rounded-md outline-none"
            type={type}
            placeholder={placeholder}
            {...register(name, rules)}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    )
}