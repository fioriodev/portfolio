import { Link } from "react-router-dom"

export function Panel() {
    return (
        <section className="bg-zinc-800 shadow-sm border border-zinc-700 flex flex-col sm:flex-row items-center justify-between">
            <Link to="/feed" className="hover:bg-mist-700 text-white px-3 py-3.5 text-sm font-medium transition-colors w-full text-center uppercase">
                Ir para Página Principal
            </Link>

            <Link to="/dashboard" className="hover:bg-mist-700 text-white px-3 py-3.5 text-sm font-medium transition-colors w-full text-center uppercase">
                Equipes
            </Link>

            <Link to="/dashboard/new" 
                    className="hover:bg-mist-700 text-white px-3 py-3.5 text-sm font-medium transition-colors w-full text-center uppercase"
            >
                Inscrever Equipe
            </Link>

            <Link to="/artilheiros"
                className="hover:bg-mist-700 text-white px-3 py-3.5 text-sm font-medium transition-colors w-full text-center uppercase"
            >
                Artilharia
            </Link>

            <Link to="/rankgoleiros"
                className="hover:bg-mist-700 text-white px-3 py-3.5 text-sm font-medium transition-colors w-full text-center uppercase"
            >
                + Gol Sofrido (Goleiro)
            </Link>
        </section>
    )
}