import { Container } from "../../components/container"
import { Footer } from "../../components/footer"
import { Link } from "react-router-dom"

export function Home() {
    return (
        <main className="pt-20">

            <Container>

                <form className="bg-white mb-20 max-w-2xl mx-auto flex p-4 gap-5 rounded-md">

                    <input type="text" placeholder="Digite o nome do carro..." className="border-1 border-neutral-300 flex-2 md:flex-3 h-10 px-3 rounded-md outline-none"/>

                    <button type="submit" className="bg-red-500 text-white font-medium cursor-pointer flex-1 rounded-md transition duration-130 hover:bg-red-600 active:bg-red-500">
                        Buscar
                    </button>

                </form>

                <h1 className="text-center text-xl select-none font-bold">Carros novos e usados em todo o Brasil</h1>

                <section className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-10">

                    <Link to="/detail/porsche">
                        <div className="bg-white rounded-xl overflow-hidden transition duration-150 hover:scale-101 active:scale-99">
                            <img src="https://image.webmotors.com.br/_fotos/anunciousados/gigante/2026/202608/20260813/porsche-macan-turbo-eletrico-wmimagem13555497438.webp?s=fill&w=1920&h=1440&q=75" alt="foto-veiculo" />
                            <h2 className="ml-3 mt-3 uppercase font-bold select-none text-2xl">porsche macan</h2>
                            <h3 className="ml-3 mt-[-2px] uppercase text-sm text-zinc-500 select-none">turbo elétrico</h3>
                            <div className="ml-3 flex gap-2 select-none mt-2 mb-5 font-medium">
                                <p>2025/2025</p>
                                •
                                <p>6.500 Km</p>
                            </div>
                            <strong className="ml-3 text-xl select-none">R$799.000</strong>
                            <div className="h-px bg-zinc-200 my-2"></div>
                            <p className="ml-3 pb-3 select-none">São Paulo - SP</p>
                        </div>
                    </Link>

                    <Link to="/detail/porsche">
                        <div className="bg-white rounded-xl overflow-hidden transition duration-150 hover:scale-101 active:scale-99">
                            <img src="https://image.webmotors.com.br/_fotos/anunciousados/gigante/2026/202608/20260813/porsche-macan-turbo-eletrico-wmimagem13555497438.webp?s=fill&w=1920&h=1440&q=75" alt="foto-veiculo" />
                            <h2 className="ml-3 mt-3 uppercase font-bold select-none text-2xl">porsche macan</h2>
                            <h3 className="ml-3 mt-[-2px] uppercase text-sm text-zinc-500 select-none">turbo elétrico</h3>
                            <div className="ml-3 flex gap-2 select-none mt-2 mb-5 font-medium">
                                <p>2025/2025</p>
                                •
                                <p>6.500 Km</p>
                            </div>
                            <strong className="ml-3 text-xl select-none">R$799.000</strong>
                            <div className="h-px bg-zinc-200 my-2"></div>
                            <p className="ml-3 pb-3 select-none">São Paulo - SP</p>
                        </div>
                    </Link>

                    <Link to="/detail/porsche">
                        <div className="bg-white rounded-xl overflow-hidden transition duration-150 hover:scale-101 active:scale-99">
                            <img src="https://image.webmotors.com.br/_fotos/anunciousados/gigante/2026/202608/20260813/porsche-macan-turbo-eletrico-wmimagem13555497438.webp?s=fill&w=1920&h=1440&q=75" alt="foto-veiculo" />
                            <h2 className="ml-3 mt-3 uppercase font-bold select-none text-2xl">porsche macan</h2>
                            <h3 className="ml-3 mt-[-2px] uppercase text-sm text-zinc-500 select-none">turbo elétrico</h3>
                            <div className="ml-3 flex gap-2 select-none mt-2 mb-5 font-medium">
                                <p>2025/2025</p>
                                •
                                <p>6.500 Km</p>
                            </div>
                            <strong className="ml-3 text-xl select-none">R$799.000</strong>
                            <div className="h-px bg-zinc-200 my-2"></div>
                            <p className="ml-3 pb-3 select-none">São Paulo - SP</p>
                        </div>
                    </Link>

                </section>

            </Container>

            <Footer/>

        </main>
    )
}