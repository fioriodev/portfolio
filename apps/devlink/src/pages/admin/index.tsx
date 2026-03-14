import { Header } from "../../components/header"

import { Input } from "../../components/input"
import { BiLink, BiTrash } from "react-icons/bi"

import { useState, useEffect } from "react"
import type { FormEvent } from "react"

import { db } from "../../services/firebaseConnection"
import { addDoc, onSnapshot, doc, query, orderBy, collection, deleteDoc } from "firebase/firestore"

interface listaProps {
    id: string;
    name: string;
    url: string;
    bg: string;
    color: string;
}

export function Admin() {
    const[nameLink, setNameLink] = useState("")
    const[urlLink, setUrlLink] = useState("")
    const[bgLink, setBgLink] = useState("#FFFFFF")
    const[colorLink, setColorLink] = useState("#000000")
    const[links, setLinks] = useState<listaProps[]>([])

    useEffect(() => {
        const linksRef = collection(db, "links")
        const queryRef = query(linksRef, orderBy("created", "asc"))

        const unsub = onSnapshot(queryRef, (snapshot) => {
            let lista = [] as listaProps[]

            snapshot.forEach((doc) => {
                lista.push({
                    id: doc.id,
                    name: doc.data().name,
                    url: doc.data().url,
                    bg: doc.data().bg,
                    color: doc.data().color
                })
            })
            setLinks(lista)
        })
        return () => {
            unsub()
        }
    }, [])

    function handleCreated(event: FormEvent) {
        event.preventDefault()

        if(!nameLink && !urlLink) return alert("Preencha os campos para continuar")
        if(!nameLink) return alert("Insira o nome do link para continuar")
        if(!urlLink) return alert("Insira a URL do link para continuar")

        addDoc(collection(db, "links"), {
            name: nameLink,
            url: urlLink,
            bg: bgLink,
            color: colorLink,
            created: new Date()
        })
        .then(() => {
            setNameLink("")
            setUrlLink("")
        })
        .catch(() => {
            alert("Não foi possível cadastrar link, tente novamente.")
        })
    }

    async function handleDelete(id: string) {
        const linkRef = doc(db, "links", id)
        await deleteDoc(linkRef)
    }

    return (

        <main>

            <Header/>

            <form className="flex flex-col justify-center gap-2 max-w-[400px] md:max-w-lg w-full m-auto mt-7" onSubmit={handleCreated}>

                <div className="flex flex-col gap-2">
                    <label className="text-white font-medium">Nome do link</label>
                    <Input
                    type="text"
                    placeholder="Nome do seu link"
                    value={nameLink}
                    onChange={(e) => setNameLink(e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-white font-medium">URL do link</label>
                    <Input
                    type="url"
                    placeholder="Digite a url..."
                    value={urlLink}
                    onChange={(e) => setUrlLink(e.target.value)}
                    />
                </div>

                <div className="flex gap-10">
                    <div>
                        <label className="text-white font-medium mr-1">Fundo do link</label>
                        <input type="color" className="w-12 h-10" value={bgLink} onChange={(e) => setBgLink(e.target.value)}/>
                    </div>
                    <div>
                        <label className="text-white font-medium mr-1">Cor do link</label>
                        <input type="color" className="w-12 h-10" value={colorLink} onChange={(e) => setColorLink(e.target.value)}/>
                    </div>
                </div>

                {nameLink && (
                    <section className="border border-neutral-100/30 border-dashed mt-3 text-center py-3">
                        <h1 className="text-white">Veja como está ficando</h1>
                        <div className="max-w-lg w-11/12 m-auto mt-2 py-2.5 select-none rounded font-medium" style={{ backgroundColor: bgLink, color: colorLink }}>
                            {nameLink}
                        </div>
                    </section>
                )}

                <button className="bg-blue-600 text-white font-medium rounded py-2 mt-7 cursor-pointer flex justify-center items-center gap-1 transition duration-150 hover:bg-blue-700 active:bg-white active:text-blue-600">
                    Cadastrar
                    <BiLink/>
                </button>

            </form>

            <section className="mt-13 max-w-[400px] md:max-w-lg m-auto">

                <h2 className="text-white text-center font-medium text-2xl md:text-3xl mb-4">Meus Links</h2>

                {links.map((item) => (
                    <article key={item.id} className="h-13 flex justify-between items-center px-5 rounded mb-3" style={{ backgroundColor: item.bg, color: item.color }}>
                        <p className="font-medium select-none">{item.name}</p>
                        <button className="bg-black border border-white border-dashed rounded p-1.5 cursor-pointer" onClick={() => handleDelete(item.id)}>
                            <BiTrash size={15} color="white"/>
                        </button>
                    </article>
                ))}

            </section>

        </main>
    )
}