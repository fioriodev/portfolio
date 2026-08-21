import { Container } from "../../components/container"
import { Panel } from "../../components/panel"

import { FiTrash2 } from "react-icons/fi"

import { db, storage } from "../../services/firebaseConnection"
import { getDocs, collection, query, where, deleteDoc, doc } from "firebase/firestore"
import { ref, deleteObject } from "firebase/storage"

import { useState, useEffect, useContext } from "react"
import { UserContext } from "../../contexts"

interface carProps {
    id: string;
    uid: string;
    nome: string;
    modelo: string;
    ano: string;
    km: string;
    valor: number;
    cidade: string;
    imagem: imageProps[];
}

type imageProps = {
    name: string;
    url: string;
}

export function Dashboard() {
    const[cars, setCars] = useState<carProps[]>([])
    const{ user } = useContext(UserContext)

    useEffect(() => {
        loadCars()
    }, [user])

    async function loadCars() {
        if(!user) {
            return
        }
        
        const docsRef = collection(db, "cars")
        const queryRef = query(docsRef, where("uid", "==", user.uid))

        getDocs(queryRef)
        .then((snapshot) => {
            let listCars = [] as carProps[]

            snapshot.forEach(doc => {
                listCars.push({
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
            })
            setCars(listCars)
        })
        .catch((error) => {
            alert("NÃO FOI POSSÍVEL CARREGAR OS DADOS")
            console.log(error)
        })
    }

    async function handleDeleteCar(car: carProps) {
        if(!user?.uid) {
            return
        }
 
        const docRef = doc(db, "cars", car.id)
        await deleteDoc(docRef)
        
        car.imagem.map(async(image) => {
            const imagePath = `/temps/${user.uid}/${image.name}`

            const imageRef = ref(storage, imagePath)

            await deleteObject(imageRef)
            .then(() => {
                console.log("IMAGEM DELETADA COM SUCESSO!")
            })
            .catch((err) => {
                console.log("ERRO AO DELETAR IMAGEM:", err)
            })
        })

        setCars(cars.filter(currentCar => currentCar.id !== car.id))    
    }

    return (
        <Container>
            <Panel/>

            <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-10">
                
                {cars?.map((car) => (
                    <section className="w-full bg-white rounded-lg relative overflow-hidden" key={car.uid}>
                        <button className="absolute bg-white p-3 rounded-full top-3 right-3 cursor-pointer transition duration-150 hover:scale-110 active:scale-100" onClick={() => handleDeleteCar(car)}><FiTrash2 size={25}/></button>
                        <img src={car.imagem[0].url} alt="foto-veiculo" className="w-full mb-2 max-h-70"/>
                        <h2 className="uppercase text-2xl font-bold ml-3 select-none">{car.nome}</h2>
                        <h3 className="ml-3 text-sm text-zinc-500 mt-[-2px] select-none">{car.modelo}</h3>
                        <div className="ml-3 my-3 flex gap-2 font-medium select-none">
                            <p>{car.ano}</p>
                            •
                            <p>{car.km}Km</p>
                        </div>
                        <strong className="ml-3 text-xl select-none">{car.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong>
                        <div className="mt-3 h-px bg-zinc-300"></div>
                        <p className="p-3 select-none">{car.cidade}</p>
                    </section>
                ))}

            </main>
        </Container>
    )
}