import logoImg from './../../assets/logo.png'
import { Input } from '../../components/input'
import { Link } from 'react-router-dom'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { auth } from '../../services/firebaseConnection'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'

import { useNavigate } from 'react-router-dom'

const schema = z.object({
    name: z.string().nonempty("Campo nome obrigatório"),
    email: z.email("E-mail inválido").nonempty("Campo e-mail obrigatório"),
    password: z.string().min(6, "A senha deve conter no mínimo 6 caracteres").nonempty("Campo senha obrigatório")
})

type FormData = z.infer<typeof schema>

export function Register() {
    const{ register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    })
    const navigate = useNavigate()

    function formSubmit(data: FormData) {
        createUserWithEmailAndPassword(auth, data.email, data.password)
        .then(async(user) => {
            console.log(user)
            await updateProfile(user.user, {
                displayName: data.name
            })
            alert("Cadastrado com Sucesso!")
            navigate("/", { replace: true })
        })
    }

    return (
        <main className="min-h-screen flex flex-col justify-center items-center px-5">
            
            {/* Logo com espaçamento e leve destaque */}
            <div className="mb-5 flex flex-col items-center">
                <img src={logoImg} alt="fjusoccer" className="w-64 max-w-xs drop-shadow-md mt-[-20px]" />
            </div>

            {/* Card do formulário com efeito Glassmorphism */}
            <form className="bg-white/95 backdrop-blur-md p-8 flex flex-col gap-4 w-full max-w-md rounded-2xl shadow-2xl border border-white/10" onSubmit={handleSubmit(formSubmit)}>
                <div className="flex flex-col gap-1 mb-2">
                    <h1 className="text-2xl font-bold text-zinc-900">Junte-se ao time</h1>
                    <p className="text-sm text-zinc-500">Crie sua conta e comece a acompanhar tudo</p>
                </div>

                <Input
                    type="string"
                    placeholder="Digite seu nome completo..."
                    name="name"
                    register={register}
                    error={errors.name?.message}
                />

                <Input
                    type="email"
                    placeholder="Digite seu e-mail..."
                    name="email"
                    register={register}
                    error={errors.email?.message}
                />
                
                <Input
                    type="password"
                    placeholder="Digite sua senha..."
                    name="password"
                    register={register}
                    error={errors.password?.message}
                />

                <button 
                    type="submit" 
                    className="mt-2 bg-zinc-900 hover:bg-zinc-800 text-white font-medium h-11 rounded-xl cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.99]"
                > 
                    Cadastrar 
                </button>
            </form>

            {/* Rodapé do card */}
            <p className="mt-6 text-zinc-400 text-sm select-none">
                Já possui uma conta? {' '}
                <Link to="/login" className="font-medium text-white hover:underline transition-colors">
                    Faça login
                </Link>
            </p>
        </main>
    )
}