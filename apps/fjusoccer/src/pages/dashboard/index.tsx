import { Container } from '../../components/container'
import { Panel } from '../../components/panel'

import { db, storage } from '../../services/firebaseConnection'
import { getDocs, collection, query, orderBy, deleteDoc, doc } from 'firebase/firestore'
import { ref, deleteObject } from 'firebase/storage'

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import { FiTrash } from 'react-icons/fi'

interface teamProps {
    uid: string;
    name: string;
    manager: string;
    imageLogo: {
        url: string;
        name: string;
        imagePath?: string; // <--- ADICIONE ESTA LINHA
    }
}

export function Dashboard() {
    const [teams, setTeams] = useState<teamProps[]>([])

    useEffect(() => {
        loadTeams()
    }, [])

    async function loadTeams() {
        const docTeams = collection(db, "teams")
        const queryTeams = query(docTeams, orderBy("createdAt", "asc"))

        const snapshot = await getDocs(queryTeams)
        let listTeams = [] as teamProps[]

        snapshot.forEach(doc => {
            listTeams.push({
                uid: doc.id,
                name: doc.data().name,
                manager: doc.data().manager,
                imageLogo: doc.data().imageLogo
            })
        })
        setTeams(listTeams)
    }

    // Função para deletar o time e a imagem
    async function handleDeleteTeam(team: teamProps) {
        const confirmDelete = window.confirm(`Tem certeza que deseja excluir o time ${team.name}?`)
        
        if (!confirmDelete) return

        try {
            // 1. Deleta a imagem do Storage usando o imagePath salvo
            if (team.imageLogo?.imagePath) {
                const imageRef = ref(storage, team.imageLogo.imagePath)
                try {
                    await deleteObject(imageRef)
                    console.log("Imagem deletada do Storage com sucesso!")
                } catch (err) {
                    console.log("Erro ao deletar imagem do storage:", err)
                }
            }

            // 2. Deleta o documento do Firestore
            await deleteDoc(doc(db, "teams", team.uid))

            // 3. Atualiza a lista na tela
            setTeams(teams.filter(item => item.uid !== team.uid))
            
            alert("Time deletado com sucesso!")
        } catch (error) {
            console.log("Erro ao deletar time:", error)
            alert("Erro ao tentar deletar o time.")
        }
    }

    return (
        <div className="min-h-screen bg-zinc-100 pb-12 pt-5">
            <Container>
                
                <Panel/>

                <section className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4 lg:gap-5 my-10">

                    {teams.map((team) => (
                        <Link to={`/detail/${team.name}`} key={team.uid}>
                            <div className="shadow-md w-11/12 mx-auto sm:w-full flex flex-col items-center justify-center overflow-hidden rounded-xl transition-transform duration-200 hover:scale-102 relative bg-white">
                                <img src={team.imageLogo.url} alt={`${team.name}`} className="w-full h-40 object-cover" />
                                <h2 className="text-white bg-zinc-800 w-full text-center font-medium uppercase py-2">{team.name}</h2>
                                
                                <button 
                                    type="button" 
                                    onClick={(e) => {
                                        e.preventDefault(); // Impede que o <Link> seja acionado ao clicar na lixeira
                                        e.stopPropagation(); // Para a propagação do evento
                                        handleDeleteTeam(team);
                                    }}
                                    className="absolute top-3 left-3 bg-black/70 p-2 rounded-md cursor-pointer transition duration-150 hover:bg-red-900 active:bg-red-700"
                                > 
                                    <FiTrash color="white" size={18}/> 
                                </button>
                            </div>
                        </Link>
                    ))}

                </section>

            </Container>
        </div>
    )
}