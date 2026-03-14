import type { ReactNode } from "react";

interface socialProps {
    url: string;
    children: ReactNode;
}

export function Social({url, children}: socialProps) {
    return (
        <a href={url} target="_blank" rel="noopener noreferrer">{children}</a>
    )
}