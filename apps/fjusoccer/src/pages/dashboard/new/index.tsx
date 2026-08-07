import { useState, type ChangeEvent, useContext } from 'react'
import { Container } from '../../../components/container'
import { Input } from '../../../components/input'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FiUpload, FiTrash } from 'react-icons/fi'
import { db, storage } from '../../../services/firebaseConnection'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { addDoc, collection } from 'firebase/firestore'
import { UserContextData } from '../../../contexts'
import { useNavigate } from 'react-router-dom'

interface ImageItemProps {
    name: string | null;
    previewUrl: string;
    url: string;
    imagePath?: string;
}

const schema = z.object({
    name: z.string().nonempty("O nome do time é obrigatório"),
    manager: z.string().nonempty("O nome do responsável/técnico é obrigatório"),
})

type FormData = z.infer<typeof schema>

export function New() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    })

    const { user } = useContext(UserContextData)
    const navigate = useNavigate()
    const [teamImage, setTeamImage] = useState<ImageItemProps | null>(null)
    const [uploading, setUploading] = useState(false)

    async function handleUpload(image: File) {
        const imageName = `${Date.now()}_${image.name}`
        const imagePath = `teams/${user?.uid}/${imageName}`
        const uploadRef = ref(storage, imagePath)

        try {
            setUploading(true)
            const snapshot = await uploadBytes(uploadRef, image)
            const downloadUrl = await getDownloadURL(snapshot.ref)

            setTeamImage({
                name: image.name,
                previewUrl: URL.createObjectURL(image),
                url: downloadUrl,
                imagePath: imagePath
            })
        } catch (error) {
            console.log("Erro ao enviar imagem:", error)
            alert("Erro ao fazer o upload da imagem do escudo.")
        } finally {
            setUploading(false)
        }
    }

    async function handleFile(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files[0]) {
            const image = e.target.files[0]
            if (image.type === 'image/png' || image.type === 'image/jpeg') {
                await handleUpload(image)
            } else {
                alert("Envie uma imagem nos formatos JPEG ou PNG.")
            }
        }
    }

    async function handleDeleteImage() {
        if (!teamImage?.imagePath) return

        const imageRef = ref(storage, teamImage.imagePath)
        try {
            await deleteObject(imageRef)
            setTeamImage(null)
        } catch (error) {
            console.log("Erro ao deletar imagem:", error)
            alert("Erro ao remover a imagem.")
        }
    }

    async function handleRegisterTeam(data: FormData) {
        try {
            await addDoc(collection(db, "teams"), {
                name: data.name,
                manager: data.manager,
                imageLogo: {
                    url: teamImage?.url || "",
                    name: teamImage?.name || "",
                    imagePath: teamImage?.imagePath || "" // <--- ADICIONE ESTA LINHA
                },
                uid: user?.uid,
                createdAt: new Date(),
            })

            alert("Time cadastrado com sucesso!")
            reset()
            setTeamImage(null)
            navigate("/dashboard")
        } catch (error) {
            console.log("Erro ao cadastrar time:", error)
            alert("Erro ao cadastrar o time, tente novamente.")
        }
    }

    return (
        <div className="min-h-screen bg-zinc-100 pb-12 pt-5">
            <Container>

                <div className="bg-white rounded-2xl p-7 mt-6 shadow-sm border border-zinc-200 max-w-2xl mx-auto">
                    <h1 className="text-2xl font-bold text-zinc-800 mb-6">Cadastrar Novo Time</h1>

                    <form onSubmit={handleSubmit(handleRegisterTeam)} className="flex flex-col gap-4">
                        
                        {/* Área de Upload do Escudo do Time */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-zinc-700">Escudo do Time</label>
                            
                            {!teamImage?.previewUrl ? (
                                <button 
                                    type="button" 
                                    className="border-2 border-dashed border-zinc-300 flex flex-col justify-center items-center h-36 rounded-xl w-full relative overflow-hidden hover:border-zinc-400 transition-colors"
                                >
                                    <div className="absolute flex flex-col justify-center items-center gap-1">
                                        <FiUpload size={24} className="text-zinc-500" />
                                        <span className="text-sm text-zinc-500">
                                            {uploading ? "Enviando..." : "Clique para enviar o escudo"}
                                        </span>
                                    </div>
                                    <input 
                                        type="file" 
                                        accept="image/png, image/jpeg" 
                                        className="opacity-0 w-full h-full cursor-pointer absolute inset-0" 
                                        onChange={handleFile}
                                        disabled={uploading}
                                    />
                                </button>
                            ) : (
                                <div className="relative w-32 h-32 mx-auto">
                                    <img 
                                        src={teamImage.previewUrl} 
                                        alt="Escudo do time" 
                                        className="w-32 h-32 object-cover rounded-xl shadow-md border" 
                                    />
                                    <button 
                                        type="button" 
                                        onClick={handleDeleteImage}
                                        className="absolute -top-2 -right-2 bg-red-600 text-white p-1.5 rounded-full shadow-lg hover:bg-red-700 transition-colors cursor-pointer"
                                    >
                                        <FiTrash size={16} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Nome do Time */}
                        <Input
                            type="text"
                            placeholder="Nome do Time (ex: Real Madrid FC)"
                            name="name"
                            register={register}
                            error={errors.name?.message}
                        />

                        {/* Responsável / Técnico */}
                        <Input
                            type="text"
                            placeholder="Nome do Técnico ou Responsável"
                            name="manager"
                            register={register}
                            error={errors.manager?.message}
                        />

                        <button 
                            type="submit" 
                            className="bg-zinc-900 text-white font-medium h-11 rounded-xl hover:bg-zinc-800 transition-colors mt-2 shadow-md cursor-pointer"
                        >
                            Salvar Time
                        </button>
                    </form>
                </div>
            </Container>
        </div>
    )
}