import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import { Container } from "../../components/container"
import { Footer } from "../../components/footer"

import { db } from "../../services/firebaseConnection"
import { getDoc, doc } from "firebase/firestore"

interface carDetail {
    name: string;
    price: number;
    model: string;
    city: string;
    year: string;
    description: string;
    telephone: string;
    images: imageProps[];
    km: string;
    owner: string;
}

type imageProps = {
    name: string;
    url: string;
}

export function CarDetail() {
    const{ id } = useParams()
    const[car, setCar] = useState<carDetail>()

    useEffect(() => {
        getCar()
    }, [car])

    async function getCar() {
        if(!id) return

        const docRef = doc(db, "cars", id)
        
        await getDoc(docRef)
        .then((snapshot) => {
            setCar({
                name: snapshot.data()?.nome,
                price: Number(snapshot.data()?.valor),
                model: snapshot.data()?.modelo,
                city: snapshot.data()?.cidade,
                year: snapshot.data()?.ano,
                description: snapshot.data()?.descricao,
                telephone: snapshot.data()?.whatsapp,
                images: snapshot.data()?.imagem,
                km: snapshot.data()?.km,
                owner: snapshot.data()?.owner
            })
        })
        .catch((error) => {
            console.log(error)
        })
    }

    return (
        <main>

            <Container>
                {car && (
                    <section className="bg-white max-w-11/12 mx-auto mt-20 p-5 rounded-lg select-none">
                        <div className="flex flex-col gap-5 md:flex-row  justify-between">
                            <div>
                                <h1 className="text-3xl font-bold select-none">{car.name}</h1>
                                <h2 className="text-sm text-zinc-500">{car.model}</h2>
                            </div>
                            <div className="h-px bg-zinc-300"></div>
                            <strong className="text-3xl">{car.price.toLocaleString("pt-BR", { style: "currency", currency:"BRL" })}</strong>
                        </div>
                        <div className="flex gap-7 items-center mt-10 select-none">
                            <div>
                                <p>Cidade</p>
                                <p className="font-medium">{car.city}</p>
                            </div>
                            <div>
                                <p>Ano</p>
                                <p className="font-medium">{car.year}</p>
                            </div>
                            <div>
                                <p>Km</p>
                                <p className="font-medium">{car.km}</p>
                            </div>
                        </div>
                        <div className="mt-5">
                            <p className="font-medium">Descrição</p>
                            <p className="text-justify indent-3">{car.description}</p>
                        </div>
                        <div className="flex gap-5">
                            <div>
                                <p className="font-medium mt-5">Proprietário</p>
                                <p>{car.owner}</p>
                            </div>
                            <div>
                                <p className="font-medium mt-5">Telefone</p>
                                <p>{car.telephone}</p>
                            </div>
                        </div>
                        <a href={`https://wa.me/${car.telephone}`} rel="noopener noreferrer" className="bg-green-600 text-white h-12 flex items-center justify-center font-medium w-full block text-center cursor-pointer rounded-md mt-5 transition duration-150 hover:bg-green-700 active:bg-green-600">Enviar mensagem whatsapp</a>
                    </section>
                )}
            </Container>

            <Footer/>

        </main>
    )
}