import { Container } from "../../components/container"
import { Footer } from "../../components/footer"
import { Link } from "react-router-dom"

import { useState, useEffect } from "react"

import { db } from "../../services/firebaseConnection"
import { getDocs, collection, query, orderBy } from "firebase/firestore"

interface carsProps {
    id: string;
    ano: string;
    cidade: string;
    imagem: imageCars[];
    km: string;
    modelo: string;
    nome: string;
    valor: number;
    uid: string;
}

type imageCars = {
    name: string;
    url: string
}

export function Home() {
    const[cars, setCars] = useState<carsProps[]>([])
    const[loadImages, setLoadImages] = useState<string[]>([])

    useEffect(() => {
        getCars()
    }, [])

    async function getCars() {
        const docRef = collection(db, "cars")
        const queryRef = query(docRef, orderBy("created", "asc"))

        getDocs(queryRef)
        .then((snapshot) => {
            let carlists = [] as carsProps[]

            snapshot.forEach(doc => {
                carlists.push({
                    id: doc.id,
                    nome: doc.data().nome,
                    modelo: doc.data().modelo,
                    ano: doc.data().ano,
                    km: doc.data().km,
                    valor: Number(doc.data().valor),
                    cidade: doc.data().cidade,
                    imagem: doc.data().imagem,
                    uid: doc.data().uid
                })
                console.log(carlists)
                setCars(carlists)
            })
        })
        .catch(() => {
            alert("ERRO AO BUSCAR VEÍCULOS")
        })
    }

    function handleImageLoad(name: string) {
        setLoadImages(prevNames => [...prevNames, name])
    }

    return (
        <main className="pt-20">

            <Container>

                <form className="bg-white mb-20 max-w-2xl mx-auto flex p-4 gap-5 rounded-md">

                    <input type="text" placeholder="Digite o nome do carro..." className="border-1 border-neutral-300 flex-2 md:flex-3 h-10 px-3 rounded-md outline-none"/>

                    <button type="submit" className="bg-red-500 text-white font-medium cursor-pointer flex-1 rounded-md transition duration-130 hover:bg-red-600 active:bg-red-500">
                        Buscar
                    </button>

                </form>

                <h1 className="text-center text-xl select-none font-bold">Carros novos e usados em todo o Brasil</h1>

                <section className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-10">

                    {cars.map((car) => (
                        <Link to={`/detail/${car.id}`} key={car.nome}>
                            <div className="bg-white rounded-xl overflow-hidden transition duration-150 hover:scale-101 active:scale-99">
                                <div className="w-full h-72 rounded-lg bg-slate-200" style={{ display: loadImages.includes(car.nome) ? "none" : "block" }}></div>
                                <img src={car.imagem[0].url} alt="foto-veiculo" onLoad={() => handleImageLoad(car.nome)} style={{ display: loadImages.includes(car.nome) ? "block" : "none" }}/>
                                <h2 className="ml-3 mt-3 uppercase font-bold select-none text-2xl">{car.nome}</h2>
                                <h3 className="ml-3 mt-[-2px] uppercase text-sm text-zinc-500 select-none">{car.modelo}</h3>
                                <div className="ml-3 flex gap-2 select-none mt-2 mb-5 font-medium">
                                    <p>{car.ano}</p>
                                    •
                                    <p>{car.km}Km</p>
                                </div>
                                <strong className="ml-3 text-xl select-none">{car.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL"})}</strong>
                                <div className="h-px bg-zinc-200 my-2"></div>
                                <p className="ml-3 pb-3 select-none">{car.cidade}</p>
                            </div>
                        </Link>
                    ))}

                </section>

            </Container>

            <Footer/>

        </main>
    )
}