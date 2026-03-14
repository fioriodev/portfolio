import type { InputHTMLAttributes } from "react"

interface inputProps extends InputHTMLAttributes<HTMLInputElement>{}

export function Input(props: inputProps) {
    return (
        <input
        className="bg-white w-full h-9 px-3 rounded border-0 outline-none mb-3"
        {...props}
        />
    )
}