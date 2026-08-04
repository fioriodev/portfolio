import { Link } from "react-router-dom"

export function Home() {
    return (
        <>
            <h1>Página Home</h1>
            <Link to="/login" className="text-white">
                Ir para a página de Login
            </Link>
        </>
    )
}