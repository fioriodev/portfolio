import { Container } from "../../../components/container"
import { Panel } from "../../../components/panel"
import { Input } from "../../../components/input"
import { FiUpload, FiTrash } from "react-icons/fi"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState, useContext, type ChangeEvent } from "react"
import { UserContext } from "../../../contexts"

import { storage, db } from "../../../services/firebaseConnection"
import { uploadBytes, ref, getDownloadURL, deleteObject } from "firebase/storage"
import { addDoc, collection } from "firebase/firestore"

interface imageProps {
    name: string;
    previewUrl: string;
    url: string;
}

const schema = z.object({
    name: z.string().nonempty("Campo Nome obrigatório"),
    model: z.string().nonempty("Campo Modelo obrigatório"),
    year: z.string().nonempty("Campo Ano obrigatório"),
    km: z.string().nonempty("Campo Km obrigatório"),
    price: z.string().nonempty("Campo Preço obrigatório"),
    city: z.string().nonempty("Campo Cidade obrigatório"),
    phone: z.string().min(1, "Campo WhatsApp obrigatório").refine((value) => /^(\d{11,12})$/.test(value), {
        message: "Número de telefone inválido"
    }),
    description: z.string().nonempty("Campo Descrição obrigatório")
})

type FormData = z.infer<typeof schema>

export function New() {
    const{ register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    })
    const[images, setImages] = useState<imageProps[]>([])
    const{ user } = useContext(UserContext)

    function formSubmit(data: FormData) {
        if(images.length === 0) {
            alert("Insira imagem para continuar")
            return
        }

        const carImage = images.map(car => {
            return {
                name: car.name,
                url: car.url
            }
        })

        addDoc(collection(db, "cars"), {
            nome: data.name,
            modelo: data.model,
            ano: data.year,
            km: data.km,
            valor: data.price,
            cidade: data.city,
            whatsapp: data.phone,
            descricao: data.description,
            imagem: carImage,
            owner: user?.name,
            uid: user?.uid,
            created: new Date()
        })
        .then(() => {
            reset()
            setImages([])
            alert("CADASTRADO COM SUCESSO")
        })
        .catch(() => {
            alert("ERRO AO CADASTRAR")
        })
    }

    async function handleUpload(image: File) {
        const nameImage = `${Date.now()}_${image.name}`
        const filePath = `/temps/${user?.uid}/${nameImage}`
        const imagePath = ref(storage, filePath)

        try {

            const snapshot = await uploadBytes(imagePath, image)
            const downloadUrl = await getDownloadURL(snapshot.ref)
            const newImage = {
                name: nameImage,
                previewUrl: URL.createObjectURL(image),
                url: downloadUrl
            }
            setImages(currentImage => [...currentImage, newImage])
        } catch {
            alert("Não foi possível enviar imagem")
        }
    }

    async function handleFile(data: ChangeEvent<HTMLInputElement>) {
        if(data.target.files && data.target.files[0]) {
            const image = data.target.files[0]
            
            if(image.type === 'image/jpeg' || image.type === 'image/png') {
                await handleUpload(image)
            } else {
                alert("Envie uma imagem JPEG ou PNG para continuar")
                return
            }
        }
    }

    async function handleDeleteImage(image: imageProps) {
        const filePath = `/temps/${user?.uid}/${image.name}`
        const deleteImage = ref(storage, filePath)

        await deleteObject(deleteImage)
        .then(() => {
            alert("Imagem deletada")
            setImages(images.filter(prevImage => prevImage.name !== image.name))
        })
        .catch((error) => {
            alert("Erro ao deletar imagem")
            console.log(error)
        })
    }

    return (
        <main className="py-10">
            <Container>
                <Panel/>

                <form className="my-10 flex flex-col gap-5" onSubmit={handleSubmit(formSubmit)}>

                    <section className="bg-white p-3 rounded-xl flex flex-col md:flex-row gap-3">
                        <button className="border border-zinc-400 w-full sm:w-60 h-40 rounded-xl flex flex-col justify-center items-center overflow-hidden relative">
                            <div className="absolute"><FiUpload size={30}/></div>
                            <input type="file" accept="image" className="h-100 cursor-pointer opacity-0" onChange={handleFile}/>
                        </button>

                        <div className="w-full flex flex-col md:flex-row gap-1">
                            {images.map((image) => (
                                <div key={image.name} className="w-full relative">
                                    <img src={image.previewUrl} alt={`${image.name}`} className="h-40 w-full object-cover rounded-xl"/>
                                    <button type="button" className="absolute top-3 left-3 bg-black p-1.5 rounded-md cursor-pointer transition duration-130 hover:bg-red-900 active:bg-red-700" onClick={() => handleDeleteImage(image)}>
                                        <FiTrash color="white"/>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="bg-white p-3 rounded-xl flex flex-col gap-3">

                        <div className="flex flex-col gap-1">
                            <label htmlFor="nameCar" className="font-bold text-lg">Nome do carro</label>
                            <Input
                            type="string"
                            name="name"
                            id="nameCar"
                            register={register}
                            error={errors.name?.message}
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label htmlFor="modelCar" className="font-bold text-lg">Modelo</label>
                            <Input
                            type="string"
                            name="model"
                            id="modelCar"
                            register={register}
                            error={errors.model?.message}
                            />
                        </div>

                        <div className="flex gap-5">
                            <div className="flex-1 flex flex-col gap-1">
                                <label htmlFor="yearCar" className="font-bold text-lg">Ano</label>
                                <Input
                                type="string"
                                name="year"
                                id="yearCar"
                                register={register}
                                error={errors.year?.message}
                                />
                            </div>
                            <div className="flex-1 flex flex-col gap-1">
                                <label htmlFor="km" className="font-bold text-lg">Km rodados</label>
                                <Input
                                type="string"
                                name="km"
                                id="km"
                                register={register}
                                error={errors.km?.message}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label htmlFor="value" className="font-bold text-lg">Valor em R$</label>
                            <Input
                            type="string"
                            name="price"
                            id="value"
                            register={register}
                            error={errors.price?.message}
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label htmlFor="city" className="font-bold text-lg">Cidade</label>
                            <Input
                            type="string"
                            name="city"
                            id="city"
                            register={register}
                            error={errors.city?.message}
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label htmlFor="whatsapp" className="font-bold text-lg">WhatsApp</label>
                            <Input
                            type="string"
                            name="phone"
                            id="whatsapp"
                            register={register}
                            error={errors.phone?.message}
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label htmlFor="description" className="font-bold text-lg">Descrição</label>
                            <textarea
                            id="description"
                            className="border h-20 w-full rounded-lg p-3 outline-none"
                            {...register("description")}
                            style={{ borderColor: errors.description ? "red" : "gray" }}
                            ></textarea>
                            {errors.description && (
                                <p className="text-red-500"> {errors.description?.message} </p>
                            )}
                        </div>

                        <button type="submit" className="bg-zinc-900 text-white font-medium h-12 rounded-xl cursor-pointer transition duration-150 hover:bg-zinc-800 active:bg-zinc-950">
                            Cadastrar
                        </button>

                    </section>

                </form>

            </Container>

        </main>
    )
}