import { Input } from "../../components/input"

import { useState } from "react"
import type { FormEvent } from "react"
import { useNavigate } from "react-router-dom"

import { auth } from "../../services/firebaseConnection"
import { signInWithEmailAndPassword } from "firebase/auth"

export function Login() {
    const[inputEmail, setInputEmail] = useState("")
    const[validEmail, setValidEmail] = useState<boolean>()
    const[inputPassword, setInputPassword] = useState("")
    const[validPassword, setValidPassword] = useState<boolean>()
    const navigate = useNavigate()

    function handleSubmit(event: FormEvent) {
        event.preventDefault()

        if(inputEmail === '') {
            setValidEmail(false)
        } else {
            setValidEmail(true)
        }

        if(inputPassword === '') {
            setValidPassword(false)
        } else {
            setValidPassword(true)
        } 

        signInWithEmailAndPassword(auth, inputEmail, inputPassword)
        .then(() => {
            navigate("/admin")
        })
        .catch(() => {
            alert("Usuário não cadastrado")
        })
    }

    return (
        <main className="h-screen flex flex-col justify-center items-center">
            <h1 className="text-white text-6xl md:text-7xl font-bold select-none mb-5">
                Dev<span className="bg-gradient-to-t from-yellow-400 to-orange-500 bg-clip-text text-transparent ml-[-10px]">Link</span>
            </h1>

            <form className="flex flex-col max-w-[400px] md:max-w-lg w-full" onSubmit={handleSubmit}>

                <Input
                type="email"
                placeholder="Digite seu email (teste:usuario.exemplo@outlook.com)"
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
                />

                {validEmail === false && (
                    <p className="text-red-600 italic mt-[-10px] mb-2">* Preencha o campo Usuário para continuar</p>
                )}

                <Input
                type="password"
                placeholder="********** (teste:1234567@*!)"
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                />

                {validPassword === false && (
                    <p className="text-red-600 italic mt-[-10px] mb-2">* Digite a senha para continuar</p>
                )}  

                <button className="bg-blue-600 text-white py-2 rounded font-medium text-base md:text-[18px] cursor-pointer transition duration-150 hover:bg-blue-700 active:bg-white active:text-blue-600">
                    Acessar
                </button>

            </form>
        </main>
    )
}