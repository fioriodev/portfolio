import logoImg from './../../assets/logo.svg'
import { Link } from 'react-router-dom'
import { FiUser, FiLogIn } from 'react-icons/fi'
import { Container } from '../container'

import { useContext } from 'react'
import { UserContext } from '../../contexts'

export function Header() {
    const{ signed, loading, user } = useContext(UserContext)

    return (
        <header className="bg-white shadow drop-shadow">

            <Container>

                <nav className="h-20 flex justify-between items-center">

                    <Link to="/">
                        <img src={logoImg} alt="logo-webcarros" />
                    </Link>

                    {signed && !loading && (
                        <div className="flex items-center gap-3">
                            <Link to="/dashboard" className="border-2 border-black p-1.5 rounded-full">
                                <FiUser size={25}/>
                            </Link>
                            <span className="select-none">
                                <h1>Seja bem-vindo(a)</h1>
                                <p>{user?.name} !</p>
                            </span>
                        </div>
                    )}
                    

                    {!signed && !loading && (
                        <Link to="/login" className="border-2 border-black p-1.5 rounded-full">
                            <FiLogIn size={25}/>
                        </Link>
                    )}

                </nav>

            </Container>

        </header>
    )
}