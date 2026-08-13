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
            className="w-full  border border-zinc-300 text-zinc-800 h-11 px-3 rounded-xl outline-none focus:outline-none focus:border-zinc-950 transition-colors text-sm"
            type={type}
            placeholder={placeholder}
            {...register(name, rules)}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    )
}