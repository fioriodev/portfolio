interface InputProps {
    type: string;
    placeholder: string;
    name: string;
}

export function Input({type, placeholder, name}: InputProps) {
    return (
        <input
        className="border-1 border-mist-300 h-10 px-3 rounded-md outline-none"
        type={type}
        placeholder={placeholder}
        name={name}
        />
    )
}