import { useContext } from 'react'
import { UserContextData } from '../../contexts'
import { Link } from 'react-router-dom'
import { Container } from '../../components/container'

import { useState, useEffect } from 'react'
import { db } from '../../services/firebaseConnection'
import { getDoc, doc } from 'firebase/firestore'

interface imageProps {
    name: string;
    uid: string;
    imageProfile: {
        url: string;
        name: string;
    }
}

export function Header() {
    const { user } = useContext(UserContextData)
    const[image, setImage] = useState<imageProps>()

    useEffect(() => {
        async function loadUser() {
            if (!user?.uid) {
                return;
            }

            const docRef = doc(db, "users", user.uid)

            getDoc(docRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    setImage(snapshot.data() as imageProps)
                }
            })
            .catch((error) => {
                console.log("Erro de conexão ao buscar usuário: ", error)
            })
        }
        
        loadUser()
    }, [user])

    return (
        <header className="bg-gradient-to-b from-white to-zinc-50 border-b border-zinc-200/80 pt-10 pb-5">
            <Container>
                <div className="flex flex-col items-center justify-center gap-2 text-center">
                    {/* Foto de perfil com borda de destaque e efeito hover */}
                    <Link 
                        to="/dashboard" 
                        className="p-1 rounded-full bg-amber-100/80 border-2 border-amber-300 shadow-md hover:scale-105 transition-transform duration-200"
                    >
                        <img 
                            src={image?.imageProfile.url} 
                            className="w-20 h-20 object-cover rounded-full" 
                            alt={user?.name || "Foto de perfil"} 
                        />
                    </Link>

                    {/* Textos de saudação */}
                    <div className="mt-2 flex flex-col gap-0.5">
                        <span className="text-sm uppercase tracking-wider text-zinc-500 font-medium select-none">
                            Seja Bem-Vindo(a)
                        </span>
                        <h1 className="text-2xl sm:text-3xl text-zinc-900 font-bold select-none">
                            {user?.name || "Usuário"}
                        </h1>
                    </div>
                </div>

                {/* Botões de navegação para o Dashboard e Logout */}
                    <div className="flex items-center justify-center mt-5 gap-3">
                        <Link 
                            to="/dashboard" 
                            className="bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
                        >
                            ⚙️ Acessar Dashboard &gt;
                        </Link>
                        
                        <Link 
                            to="/" 
                            className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
                        >
                            🚪 Sair
                        </Link>
                    </div>
            </Container>
        </header>
    )
}