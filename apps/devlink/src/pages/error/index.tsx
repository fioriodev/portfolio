import { Link } from "react-router-dom"

export function ErrorPage() {
    return (
        <main className="flex flex-col justify-center items-center h-screen">
            <h1 className="text-white text-7xl md:text-8xl font-bold select-none">
                Dev<span className="bg-gradient-to-t from-yellow-400 to-orange-500 bg-clip-text text-transparent ml-[-20px]">404</span>
            </h1>
            <p className="text-white text-7xl md:text-6xl md:text-7xl uppercase">DESCULPE</p>
            <p className="text-white text-lg md:text-xl max-w-[250px] text-center mt-2">não conseguimos encontrar essa página</p>

            <div className="border border-orange-500 text-white py-3 px-7 rounded-[50px] mt-5 uppercase font-medium bg-black/10">
                <Link to="/">Voltar para a página inicial</Link>
            </div>

        </main> 
    )
}