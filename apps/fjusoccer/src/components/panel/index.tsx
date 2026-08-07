import { Link } from "react-router-dom"

export function Panel() {
    return (
        <section className="bg-zinc-800 p-4 rounded-2xl shadow-sm border border-zinc-700 flex flex-col sm:flex-row items-center gap-4 justify-between">
            <Link to="/feed" className="bg-mist-500 hover:bg-mist-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
                Ir para Página Principal
            </Link>

            <div className="flex flex-wrap gap-2">
                <h3 className="text-white font-bold flex items-center gap-2 mr-3">
                    ⚙️ Alterar Dados |
                </h3>
                
                <Link to="/dashboard/new" 
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                >
                    + Time Inscrito
                </Link>
                <button 
                    className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                >
                    + Gol no Campeonato
                </button>
                <button 
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                >
                    + Gol Sofrido (Goleiro)
                </button>
            </div>
        </section>
    )
}