import logoImg from './../../assets/logo.png'
import { Input } from '../../components/input'
import { Link } from 'react-router-dom'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { auth } from '../../services/firebaseConnection'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'

import { useNavigate } from 'react-router-dom'
import { useContext, useState, type ChangeEvent } from 'react'
import { UserContextData } from '../../contexts'

import { FiUpload, FiTrash } from 'react-icons/fi'

import { db } from '../../services/firebaseConnection'
import { setDoc, doc } from 'firebase/firestore'

import { storage } from '../../services/firebaseConnection'
import { uploadBytes, ref, getDownloadURL, deleteObject } from 'firebase/storage'

interface ImageItemProps {
    uid: string;
    name: string | null;
    previewUrl: string;
    url: string;
    imagePath?: string;
}

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
    const { setInfoUser } = useContext(UserContextData)
    const[userImage, setUserImage] = useState<ImageItemProps | null>()

    async function formSubmit(data: FormData) {
        createUserWithEmailAndPassword(auth, data.email, data.password)
        .then(async(user) => {
            await updateProfile(user.user, {
                displayName: data.name
            })
            setInfoUser({
                uid: user.user.uid,
                name: user.user.displayName,
                email: user.user.email
            })

            // Salva no Firestore usando o UID exato do Auth como ID do documento
            await setDoc(doc(db, "users" , user.user.uid), {
                name: data.name,
                email: data.email,
                imageProfile: {
                    url: userImage?.url || "",
                    name: userImage?.name || ""
                }
            })

            alert("Cadastrado com Sucesso!")
            navigate("/feed", { replace: true })
        })
        .catch(async (error) => {
            // Se der erro no cadastro, limpa a imagem órfã do Storage
            if (userImage?.imagePath) {
                try {
                    const imageRef = ref(storage, userImage.imagePath)
                    await deleteObject(imageRef)
                    console.log("Imagem órfã deletada com sucesso do Storage.")
                } catch (deleteError) {
                    console.log("Erro ao tentar deletar a imagem órfã:", deleteError)
                }
            }

            alert("Ocorreu um erro ao cadastrar, tente novamente")
            console.log(error)
        })
    }

    async function handleUpload(image: File) {
        // Criamos o caminho único do arquivo para o storage
        const imageName = `${Date.now()}_${image.name}`
        const imagePath = `/users/temp/${imageName}`
        const uploadRef = ref(storage, imagePath)

        try {
            const snapshot = await uploadBytes(uploadRef, image)
            const downloadUrl = await getDownloadURL(snapshot.ref)

            setUserImage({
                uid: "", // Será preenchido ao concluir o cadastro
                name: image.name,
                previewUrl: URL.createObjectURL(image),
                url: downloadUrl,
                imagePath: imagePath // Essencial para salvar o caminho e permitir deletar se der erro
            })
        } catch (error) {
            console.log("Erro ao enviar a imagem:", error)
            alert("Erro ao fazer o upload da imagem.")
        }
    }

    async function handleFile(e: ChangeEvent<HTMLInputElement>) {
        if(e.target.files && e.target.files[0]) {
            const image = e.target.files[0]
            
            if(image.type === 'image/png' || image.type === 'image/jpeg') {
                await handleUpload(image)
            } else {
                alert("Insira imagem JPEG ou PNG para continuar")
            }
        }
    }

    async function handleDeleteImagem(image: ImageItemProps) {
    // Usa o imagePath correto que foi salvo durante o upload (/users/temp/...)
        console.log(image)
        const pathToDelete = image.imagePath

        if (!pathToDelete) {
            alert("Caminho da imagem não encontrado.")
            return
        }

        const imageRef = ref(storage, pathToDelete)

        try {
            await deleteObject(imageRef)
            setUserImage(null)
            console.log("Imagem deletada com sucesso!")
        } catch (error) {
            console.log("Erro detalhado:", error)
            alert("ERRO AO DELETAR IMAGEM")
        }
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

                {!userImage?.previewUrl && (
                    <button className="border border-mist-300 flex flex-col justify-center items-center h-40 rounded-md w-full relative overflow-hidden">
                        <div className="absolute flex flex-col justify-center items-center">
                            <FiUpload size={30}/>
                            <span className="text-sm">Insira a foto de perfil</span>
                        </div>
                        <div className="h-100 w-full">
                            <input type="file" accept="image" className="opacity-0 w-full h-100 cursor-pointer" onChange={handleFile}/>
                        </div>
                    </button>
                )}

                {userImage?.previewUrl && (
                    <div className="relative">
                        <img src={userImage.previewUrl} alt="foto-perfil" className="w-50 mx-auto object-cover rounded-full" />
                        <button type="button" className="absolute top-0 left-0 bg-black p-1 rounded-md cursor-pointer hover:bg-red-800 active:bg-black" onClick={() => handleDeleteImagem(userImage)}>
                            <FiTrash size={20} color="white"/>
                        </button>
                    </div>
                )}

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
                <Link to="/" className="font-medium text-white hover:underline transition-colors">
                    Faça login
                </Link>
            </p>
        </main>
    )
}