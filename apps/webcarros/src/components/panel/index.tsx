import { Link } from "react-router-dom"

export function Panel() {
    return (
        <nav className="bg-red-500 text-white font-medium h-13 flex items-center gap-5 px-5 rounded-xl mt-10">

            <Link to="/dashboard">
                Dashboard
            </Link>

            <Link to="/dashboard/new">
                Novo carro
            </Link>

            <Link to="/login" className="ml-auto">
                Sair da conta
            </Link>

        </nav>
    )
}