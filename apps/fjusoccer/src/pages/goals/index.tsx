import { Container } from '../../components/container'
import { Panel } from '../../components/panel'
import { db } from '../../services/firebaseConnection'
import { getDocs, collection, query, orderBy, updateDoc, doc, increment } from 'firebase/firestore'
import { useState, useEffect, useContext } from 'react'
import { UserContextData } from '../../contexts'

interface ScorerProps {
    uid: string;
    name: string;
    team: string;
    goals: number;
}

export function Goals() {
    const { fetchTotalGoals } = useContext(UserContextData)
    const [scorers, setScorers] = useState<ScorerProps[]>([])

    useEffect(() => {
        loadScorers()
    }, [])

    async function loadScorers() {
        const scorersRef = collection(db, "scorers")
        const q = query(scorersRef, orderBy("goals", "desc")) // Ordena do artilheiro com mais gols para menos

        const snapshot = await getDocs(q)
        let list: ScorerProps[] = []

        snapshot.forEach((doc) => {
            list.push({
                uid: doc.id,
                name: doc.data().name,
                team: doc.data().team,
                goals: doc.data().goals
            })
        })

        setScorers(list)
    }

    // Função para adicionar 1 gol ao jogador rapidamente
    async function handleAddGoal(id: string, currentGoals: number) {
        try {
            const scorerDocRef = doc(db, "scorers", id)
            
            // Incrementa +1 no banco de dados
            await updateDoc(scorerDocRef, {
                goals: currentGoals + 1
            })

            // Atualiza a lista local e o contexto geral da Home
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
                                <div>
                                    <h3 className="font-bold text-zinc-900">{scorer.name}</h3>
                                    <p className="text-xs text-zinc-500">{scorer.team}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <span className="text-lg font-extrabold text-zinc-900">{scorer.goals}</span>
                                        <p className="text-[10px] uppercase font-semibold text-zinc-400">Gols</p>
                                    </div>
                                    <button 
                                        onClick={() => handleAddGoal(scorer.uid, scorer.goals)}
                                        className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer"
                                    >
                                        + Gol ⚽
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