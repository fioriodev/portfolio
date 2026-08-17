import type { ReactNode } from "react"

export function Container({children}: {children: ReactNode}) {
    return (
        <div className="max-w-7xl w-full mx-auto px-5 xl:px-0 relative">
            {children}
        </div>
    )
}