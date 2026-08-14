import { Container } from '../../components/container'
import { Panel } from '../../components/panel'
import { db } from '../../services/firebaseConnection'
import { getDocs, collection, query, orderBy, updateDoc, doc } from 'firebase/firestore'
import { useState, useEffect, useContext } from 'react'
import { UserContextData } from '../../contexts'

interface ScorerProps {
    uid: string;
    name: string;
    team: string;
    goals: number;
    photo: string;
}

export function Goals() {
    const { fetchTotalGoals } = useContext(UserContextData)
    const [scorers, setScorers] = useState<ScorerProps[]>([])

    useEffect(() => {
        loadScorers()
    }, [])

    async function loadScorers() {
        const scorersRef = collection(db, "scorers")
        const playersRef = collection(db, "players")
        
        const q = query(scorersRef, orderBy("goals", "desc"))
        const snapshot = await getDocs(q)
        
        const playersSnapshot = await getDocs(playersRef)
        const playersData = playersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))

        let list: ScorerProps[] = []

        snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            
            // Procura o jogador correspondente na coleção 'players' pelo nome
            const playerMatch: any = playersData.find((p: any) => p.name === data.name)

            list.push({
                uid: docSnap.id,
                name: data.name,
                team: data.team,
                goals: data.goals,
                // Alterado de '.photo' para '.imagePlayer', que é o nome correto no seu Firebase
                photo: playerMatch?.imagePlayer || "" 
            })
        })

        setScorers(list)
    }

    async function handleAddGoal(id: string, currentGoals: number) {
        try {
            const scorerDocRef = doc(db, "scorers", id)
            await updateDoc(scorerDocRef, {
                goals: currentGoals + 1
            })
            loadScorers()
            fetchTotalGoals()
        } catch (error) {
            console.log("Erro ao atualizar gols:", error)
        }
    }

    return (
        <div className="min-h-screen bg-zinc-100 pb-12 pt-5">
            <Container>
                <Panel />
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200/80 my-6">
                    <h2 className="text-xl font-bold text-zinc-900 mb-6">Artilharia do Campeonato</h2>
                    <div className="flex flex-col gap-4">
                        {scorers.map((scorer) => (
                            <div key={scorer.uid} className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm bg-zinc-200 flex-shrink-0">
                                        {scorer.photo ? (
                                            <img src={scorer.photo} alt={scorer.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-zinc-500">
                                                {scorer.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-zinc-900">{scorer.name}</h3>
                                        <p className="text-xs text-zinc-500 font-medium">{scorer.team}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <span className="text-lg font-extrabold text-zinc-900">{scorer.goals}</span>
                                        <p className="text-[10px] uppercase font-bold text-zinc-400">Gols</p>
                                    </div>
                                    <button 
                                        onClick={() => handleAddGoal(scorer.uid, scorer.goals)}
                                        className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all"
                                    >
                                        +1
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </div>
    )
}