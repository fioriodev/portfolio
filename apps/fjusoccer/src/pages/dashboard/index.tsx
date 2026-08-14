import { Container } from '../../components/container'
import { Panel } from '../../components/panel'

import { db, storage } from '../../services/firebaseConnection'
import { getDocs, collection, query, orderBy, deleteDoc, doc, where } from 'firebase/firestore'
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
        imagePath?: string;
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

    // Função de exclusão completa (Time + Players + Scorers + Goalkeepers)
    async function handleDeleteTeam(team: teamProps) {
        const cleanName = team.name.trim(); // Garante consistência na busca
        const confirmDelete = window.confirm(`Tem certeza que deseja excluir o time ${team.name}? Isso apagará todos os jogadores, goleiros e dados relacionados!`)
        
        if (!confirmDelete) return

        try {
            // 1. Deleta a imagem do Storage
            if (team.imageLogo?.imagePath) {
                const imageRef = ref(storage, team.imageLogo.imagePath)
                try {
                    await deleteObject(imageRef)
                } catch (err) {
                    console.log("Erro ao deletar imagem do storage:", err)
                }
            }

            // 2. Deleta o documento do time
            await deleteDoc(doc(db, "teams", team.uid))

            // 3. Deleta jogadores (collection "players")
            const playersRef = collection(db, "players")
            const qPlayers = query(playersRef, where("team", "==", cleanName))
            const playersSnapshot = await getDocs(qPlayers)
            await Promise.all(playersSnapshot.docs.map((item) => deleteDoc(doc(db, "players", item.id))))

            // 4. Deleta artilheiros (collection "scorers")
            const scorersRef = collection(db, "scorers")
            const qScorers = query(scorersRef, where("team", "==", cleanName))
            const scorersSnapshot = await getDocs(qScorers)
            await Promise.all(scorersSnapshot.docs.map((item) => deleteDoc(doc(db, "scorers", item.id))))

            // 5. Deleta goleiros (collection "goalkeepers")
            const gkRef = collection(db, "goalkeepers")
            const qGk = query(gkRef, where("team", "==", cleanName))
            const gkSnapshot = await getDocs(qGk)
            await Promise.all(gkSnapshot.docs.map((item) => deleteDoc(doc(db, "goalkeepers", item.id))))

            // 6. Atualiza a lista na tela
            setTeams(teams.filter(item => item.uid !== team.uid))
            
            alert("Time e todos os seus dados vinculados foram removidos!")
        } catch (error) {
            console.log("Erro ao deletar:", error)
            alert("Erro ao tentar deletar o time e suas dependências.")
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
                                        e.preventDefault();
                                        e.stopPropagation();
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