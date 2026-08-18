import type { UseFormRegister, RegisterOptions } from "react-hook-form";

interface inputProps {
    type: string;
    placeholder?: string;
    name: string;
    id?: string;
    register: UseFormRegister<any>;
    error?: string;
    rules?: RegisterOptions;
}

export function Input({type, placeholder, name, register, error, rules, id}: inputProps) {
    return (
        <div>
            <input
            className="border h-10 w-full rounded-lg px-3 outline-none"
            style={{ borderColor: error ? "red" : "gray" }}
            type={type}
            id={id}
            placeholder={placeholder}
            {...register(name, rules)}
            />
            {error && <p className="text-red-500">{error}</p>}
        </div>
    )
}