import logoImg from './../../assets/logo.svg'
import { Input } from '../../components/input'
import { Link } from 'react-router-dom'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { auth } from '../../services/firebaseConnection'
import { createUserWithEmailAndPassword, updateProfile, signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

import { useEffect } from 'react'

import { useContext } from 'react'
import { UserContext } from '../../contexts'

const schema = z.object({
    name: z.string().nonempty("Campo nome obrigatório"),
    email: z.email("Email obrigatório").nonempty("Campo email obrigatrório"),
    password: z.string().min(6, "A senha deve conter pelo menos 6 caracteres").nonempty()
})

type FormData = z.infer<typeof schema>

export function Register() {
    const{ saveInfoUser } = useContext(UserContext)
    const{ register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    })
    const navigate = useNavigate()

    function formSubmit(data: FormData) {
        createUserWithEmailAndPassword(auth, data.email, data.password)
        .then(async (user) => {
            await updateProfile(user.user, {
                displayName: data.name
            })
            saveInfoUser({
                uid: user.user.uid,
                name: data.name,
                email: data.email
            })
            const userData = {
                uid: user.user.uid,
                email: data.email
            }
            localStorage.setItem("@User", JSON.stringify(userData))
            navigate("/dashboard", {replace: true})
        })
        .catch((error) => {
            alert("Não foi possível cadastrar")
            console.log(error)
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
                type="string"
                placeholder="Digite seu nome completo..."
                name="name"
                register={register}
                error={errors.name?.message}
                />

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
                    Cadastrar
                </button>

            </form>

            <p className="select-none text-zinc-700">Já possui uma conta? <Link to="/login" className="font-medium">Faça login</Link></p>

        </main>
    )
}