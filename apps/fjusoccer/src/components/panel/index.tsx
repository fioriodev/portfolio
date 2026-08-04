import { Link } from "react-router-dom"

export function Panel() {
    return (
        <nav className="bg-amber-100 font-medium h-13 rounded-lg px-5 flex gap-5 items-center">

            <Link to="/detail/:id">
                Geral
            </Link>

            <Link to="/dashboard/new">
                Cadastrar Equipe
            </Link>

            <Link to="/login" className="ml-auto">
                Sair da conta
            </Link>

        </nav>
    )
}