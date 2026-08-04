import { Link } from "react-router-dom"
import { Container } from "../../components/container"
import { FiUser, FiLogIn } from "react-icons/fi"
import logoImg from './../../assets/logo.png'
import { Panel } from "../../components/panel"

export function Home() {
    return (
        <main>

            <Container>

                <img src={logoImg} alt="logo-campeonato_tribos" className="w-84 max-w-full mx-auto"/>

                <div className="flex gap-3 items-center justify-center mb-5 h-10">
                    <h1 className="text-white text-2xl font-light">Seja Bem-vindo(a) User!</h1>
                    <div className="border-2 border-white flex items-center justify-center rounded-full h-11 w-11">
                        <FiUser color="white" size={25}/>
                    </div>
                </div>

                <Panel/>

            </Container>

        </main>
    )
}