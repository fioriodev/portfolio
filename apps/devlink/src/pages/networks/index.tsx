import { Header } from "../../components/header"

import { Input } from "../../components/input"
import { BiLink } from "react-icons/bi"

import { useState, useEffect } from "react"
import type { FormEvent } from "react"

import { db } from "../../services/firebaseConnection"
import { setDoc, doc, getDoc } from "firebase/firestore"

export function Networks() {
    const[urlLinkedin, setUrlLinkedin] = useState("")
    const[urlWhatsApp, setUrlWhatsApp] = useState("")
    const[urlGithub, setUrlGithub] = useState("")

    useEffect(() => {
        function loadLinks() {
            const docRef = doc(db, "social", "links")

            getDoc(docRef)
            .then((snapshot) => {
                if(snapshot.data()) {
                    setUrlLinkedin(snapshot.data()?.linkedin),
                    setUrlWhatsApp(snapshot.data()?.whatsapp),
                    setUrlGithub(snapshot.data()?.github)
                }
            })
            .catch(() => {
                alert("Não foi possível carregar os dados, tente novamente mais tarde")
            })
        }
        loadLinks()
    }, [])

    function handleSubmit(event: FormEvent) {
        event.preventDefault();

        setDoc(doc(db, "social", "links"), {
            linkedin: urlLinkedin,
            whatsapp: urlWhatsApp,
            github: urlGithub
        })
        .then(() => {
            alert("URL cadastrada com sucesso")
        })
        .catch(() => {
            alert("Não foi possível cadastrar a URL, tente novamente")
        })
    }

    return (
        <main>

            <Header/>

            <h2 className="text-white md:max-w-lg m-auto mt-7 text-center text-2xl md:text-3xl font-medium mb-7">Suas redes sociais</h2>

            <form className="max-w-[400px] md:max-w-lg m-auto flex flex-col gap-2" onSubmit={handleSubmit}>

                <div className="flex flex-col gap-2">
                    <label className="text-white font-medium">Link linkedin</label>
                    <Input
                    type="url"
                    placeholder="Digite a url..."
                    value={urlLinkedin}
                    onChange={(e) => setUrlLinkedin(e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-white font-medium">Link WhatsApp</label>
                    <Input
                    type="url"
                    placeholder="Digite a url..."
                    value={urlWhatsApp}
                    onChange={(e) => setUrlWhatsApp(e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-white font-medium">Link GitHub</label>
                    <Input
                    type="url"
                    placeholder="Digite a url..."
                    value={urlGithub}
                    onChange={(e) => setUrlGithub(e.target.value)}
                    />
                </div>

                <button className="bg-blue-600 text-white font-medium rounded cursor-pointer transition duration-150 hover:bg-blue-700 active:bg-white active:text-blue-600 flex gap-1 justify-center items-center h-10">
                    Salvar links
                    <BiLink/>
                </button>

            </form>

        </main>
    )
}