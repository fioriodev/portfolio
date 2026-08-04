import logoImg from './../../assets/logo.png'
import { Input } from '../../components/input'
import { Link } from 'react-router-dom'

export function Login() {
    return (
        <main className="min-h-screen flex flex-col justify-center items-center px-4 py-8">
            
            {/* Logo com espaçamento e leve destaque */}
            <div className="mb-8 flex flex-col items-center">
                <img src={logoImg} alt="fjusoccer" className="w-64 max-w-xs drop-shadow-md" />
            </div>

            {/* Card do formulário com efeito Glassmorphism */}
            <form className="bg-white/95 backdrop-blur-md p-8 flex flex-col gap-4 w-full max-w-md rounded-2xl shadow-2xl border border-white/10">
                <div className="flex flex-col gap-1 mb-2">
                    <h1 className="text-2xl font-bold text-zinc-900">Bem-vindo de volta</h1>
                    <p className="text-sm text-zinc-500">Faça login para acessar sua conta</p>
                </div>

                <Input
                    type="email"
                    placeholder="Digite seu e-mail..."
                    name="email"
                />
                
                <Input
                    type="password"
                    placeholder="Digite sua senha..."
                    name="password"
                />

                <button 
                    type="submit" 
                    className="mt-2 bg-zinc-900 hover:bg-zinc-800 text-white font-medium h-11 rounded-xl cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.99]"
                > 
                    Acessar 
                </button>
            </form>

            {/* Rodapé do card */}
            <p className="mt-6 text-zinc-400 text-sm select-none">
                Ainda não possui uma conta? {' '}
                <Link to="/register" className="font-medium text-white hover:underline transition-colors">
                    Cadastre-se
                </Link>
            </p>
        </main>
    )
}