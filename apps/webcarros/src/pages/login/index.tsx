import logoImg from './../../assets/logo.svg'
import { Input } from '../../components/input'
import { Link, useNavigate } from 'react-router-dom'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { auth } from '../../services/firebaseConnection'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'

import { useContext } from 'react'
import { UserContext } from '../../contexts'

import { useEffect } from 'react'

const schema = z.object({
    email: z.email("Email inválido").nonempty("Campo email obrigatório"),
    password: z.string().nonempty("Campo senha obrigatório")
})

type FormData = z.infer<typeof schema>

export function Login() {
    const{ saveInfoUser } = useContext(UserContext)
    const{ register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    })
    const navigate = useNavigate()

    function formSubmit(data: FormData) {
        signInWithEmailAndPassword(auth, data.email, data.password)
        .then((user) => {
            const userData = {
                uid: user.user.uid,
                email: user.user.email
            }
            saveInfoUser({
                uid: user.user.uid,
                name: user.user.displayName,
                email: data.email
            })
            localStorage.setItem("@User", JSON.stringify(userData))
            navigate("/dashboard")
        })
        .catch(() => {
            alert("Usuário não existe")
        })
    }

    useEffect(() => {
        handleLogout()
    }, [])

    async function handleLogout() {
        await signOut(auth)
    }

    return (
        <main className="flex flex-col justify-center items-center h-screen gap-3">

            <img src={logoImg} alt="logo-webcarros" className="mb-5 h-20"/>

            <form className="bg-white p-5 flex flex-col gap-2.5 max-w-xl w-full rounded-md" onSubmit={handleSubmit(formSubmit)}>

                <Input
                type="email"
                placeholder="Digite o email..."
                name="email"
                register={register}
                error={errors.email?.message}
                />

                <Input
                type="password"
                placeholder="Digite a senha..."
                name="password"
                register={register}
                error={errors.password?.message}
                />

                <button type="submit" className="bg-black text-white h-10 rounded-lg font-medium cursor-pointer transition duration-150 hover:bg-slate-800 active:bg-slate-950">
                    Acessar
                </button>

            </form>

            <p className="select-none text-zinc-700">Ainda não possui uma conta? <Link to="/register" className="font-medium">Cadastre-se</Link></p>

        </main>
    )
}