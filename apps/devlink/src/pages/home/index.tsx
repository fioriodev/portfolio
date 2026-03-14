import { Social } from "../../components/social"
import { FaLinkedin, FaWhatsapp, FaGithub } from "react-icons/fa"

import { useState, useEffect } from "react"

import { db } from "../../services/firebaseConnection"
import { getDocs, doc, query, orderBy, collection, getDoc } from "firebase/firestore"

interface listaProps {
    id: string;
    name: string;
    url: string;
    bg: string;
    color: string;
}

interface socialProps {
    linkedin: string;
    whatsapp: string;
    github: string;
}

export function Home() {
    const[links, setLinks] = useState<listaProps[]>([])
    const[socialLinks, setSocialLinks] = useState<socialProps>()

    useEffect(() => {
        function loadLinks() {
            const linksRef = collection(db, "links")
            const queryRef = query(linksRef, orderBy("created", "asc"))

            getDocs(queryRef)
            .then((snapshot) => {
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
        }
        loadLinks()
    }, [])

    useEffect(() => {
        function socialLinks() {
            const docRef = doc(db, "social", "links")

            getDoc(docRef)
            .then((snapshot) => {
                if(snapshot.data()) {
                    setSocialLinks({
                        linkedin: snapshot.data()?.linkedin,
                        whatsapp: snapshot.data()?.whatsapp,
                        github: snapshot.data()?.github
                    })
                }
            })
            .catch((error) => {
                console.log(error)
            })
        }
        socialLinks()
    }, [])

    return (
        <main className="flex flex-col justify-center items-center py-4">
            <h1 className="text-white mt-10 font-bold text-3xl md:text-4xl">Guilherme Henrique | FiorioDev</h1>
            <p className="text-white mt-3 mb-5 text-lg md:text-xl md:mt-5">Veja meus links 👇</p>

            <section className="flex flex-col justify-center max-w-[350px] md:max-w-lg w-full text-center mt-2 md:mt-5">

                {links.map((item) => (
                    <a href={item.url} key={item.id} target="_blank" rel="noopener noreferrer" className="font-medium rounded transition-transform hover:scale-105 py-3 md:py-2 mb-2.5 md:mb-3" style={{ backgroundColor: item.bg, color: item.color }}>{item.name}</a>
                ))}

            </section>

            {socialLinks && Object.keys(socialLinks).length > 0 && (
                <footer className="flex justify-center gap-4 md:gap-2 md:mt-2 fixed md:relative bottom-0 bg-black border border-t-white/30 md:border-transparent w-full md:bg-transparent py-4 md:py-0">

                    {socialLinks.linkedin && (
                        <Social url={socialLinks.linkedin}>
                            <FaLinkedin size={35} color="white"/>
                        </Social>
                    )}

                    {socialLinks.whatsapp && (
                        <Social url={socialLinks.whatsapp}>
                            <FaWhatsapp size={35} color="white"/>
                        </Social>
                    )}

                    {socialLinks.github && (
                        <Social url={socialLinks.github}>
                            <FaGithub size={35} color="white"/>
                        </Social>
                    )}

                </footer>
            )}

        </main>
    )
}