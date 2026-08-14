import { Container } from '../../components/container'
import { Panel } from '../../components/panel'
import { db } from '../../services/firebaseConnection'
import { collection, getDocs, query, orderBy, doc, updateDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { FiPlus, FiMinus, FiShield } from 'react-icons/fi'

interface GoalkeeperProps {
    id: string;
    name: string;
    team: string;
    goalsAgainst: number;
}

export function Goalkeeper() {
    const [goalkeepers, setGoalkeepers] = useState<GoalkeeperProps[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadGoalkeepers()
    }, [])

    async function loadGoalkeepers() {
        try {
            const keepersRef = collection(db, "goalkeepers")
            const q = query(keepersRef, orderBy("goalsAgainst", "asc"))
            const snapshot = await getDocs(q)

            const list = snapshot.docs.map((doc) => ({
                id: doc.id,
                name: doc.data().name,
                team: doc.data().team,
                goalsAgainst: Number(doc.data().goalsAgainst) || 0
            }))

            setGoalkeepers(list)
        } catch (error) {
            console.log("Erro ao buscar goleiros:", error)
        } finally {
            setLoading(false)
        }
    }

    async function handleUpdateGoals(id: string, currentGoals: number, operation: 'add' | 'sub') {
        const newGoals = operation === 'add' ? currentGoals + 1 : Math.max(0, currentGoals - 1)

        try {
            const keeperDocRef = doc(db, "goalkeepers", id)
            await updateDoc(keeperDocRef, {
                goalsAgainst: newGoals
            })

            setGoalkeepers(prev => 
                prev.map(keeper => keeper.id === id ? { ...keeper, goalsAgainst: newGoals } : keeper)
                    .sort((a, b) => a.goalsAgainst - b.goalsAgainst)
            )
        } catch (error) {
            console.log("Erro ao atualizar gols:", error)
            alert("Erro ao atualizar placar de gols.")
        }
    }

    const bestKeeper = goalkeepers.length > 0 ? goalkeepers[0] : null

    return (
        <div className="min-h-screen bg-zinc-100 pb-16 pt-5">
            <Container>
                <main className="flex flex-col gap-6">
                    
                    {/* Menu Superior */}
                    <Panel />

                    {/* Cabeçalho */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-zinc-200">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                                Defesa Menos Vazada
                            </span>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 mt-2">
                                Ranking de Goleiros
                            </h1>
                            <p className="text-sm text-zinc-500 mt-1">
                                Goleiros cadastrados nos times aparecem aqui automaticamente.
                            </p>
                        </div>
                    </div>

                    {/* Destaque do 1º Lugar */}
                    {bestKeeper && (
                        <div className="bg-zinc-900 p-6 rounded-2xl text-white shadow-md border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-3xl shadow-inner text-amber-400">
                                    <FiShield />
                                </div>
                                <div>
                                    <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest">
                                        Menos Vazado (1º Lugar)
                                    </span>
                                    <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                                        {bestKeeper.name}
                                    </h2>
                                    <p className="text-xs text-zinc-400">Equipe: <span className="font-bold text-zinc-200">{bestKeeper.team}</span></p>
                                </div>
                            </div>
                            <div className="bg-zinc-800 border border-zinc-700 px-6 py-3 rounded-xl text-center">
                                <span className="text-2xl font-black text-amber-400">{bestKeeper.goalsAgainst}</span>
                                <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Gols Sofridos</p>
                            </div>
                        </div>
                    )}

                    {/* Tabela */}
                    <section className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
                        <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-zinc-900">
                                Tabela Geral de Gols Sofridos
                            </h3>
                            <span className="text-xs font-semibold text-zinc-400 bg-zinc-100 px-3 py-1 rounded-full">
                                {goalkeepers.length} {goalkeepers.length === 1 ? 'goleiro' : 'goleiros'}
                            </span>
                        </div>

                        {loading ? (
                            <div className="p-12 text-center text-zinc-400 text-sm font-medium">
                                Carregando ranking de goleiros...
                            </div>
                        ) : goalkeepers.length === 0 ? (
                            <div className="p-12 text-center text-zinc-400 text-sm text-zinc-500">
                                Nenhum goleiro cadastrado nos times ainda. Cadastre um jogador com a posição <strong className="text-zinc-800">"Goleiro"</strong> para começar!
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-zinc-100 text-xs font-bold text-zinc-400 uppercase tracking-wider bg-zinc-50/50">
                                            <th className="py-4 px-6">Posição</th>
                                            <th className="py-4 px-6">Goleiro</th>
                                            <th className="py-4 px-6">Time</th>
                                            <th className="py-4 px-6 text-center">Gols Sofridos</th>
                                            <th className="py-4 px-6 text-right">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-100 text-sm">
                                        {goalkeepers.map((keeper, index) => {
                                            const position = index + 1
                                            return (
                                                <tr key={keeper.id} className="hover:bg-zinc-50/80 transition-colors">
                                                    <td className="py-4 px-6 font-bold">
                                                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-extrabold ${
                                                            position === 1 ? 'bg-amber-100 text-amber-700' : 
                                                            position === 2 ? 'bg-zinc-200 text-zinc-700' : 
                                                            position === 3 ? 'bg-amber-700/10 text-amber-800' : 
                                                            'text-zinc-500 bg-zinc-100'
                                                        }`}>
                                                            {position}º
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-6 font-bold text-zinc-900">
                                                        {keeper.name}
                                                    </td>
                                                    <td className="py-4 px-6 font-medium text-zinc-600">
                                                        {keeper.team}
                                                    </td>
                                                    <td className="py-4 px-6 text-center">
                                                        <span className="bg-zinc-100 text-zinc-900 px-3 py-1.5 rounded-lg text-xs font-black shadow-inner">
                                                            {keeper.goalsAgainst}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-6 text-right">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <button
                                                                onClick={() => handleUpdateGoals(keeper.id, keeper.goalsAgainst, 'sub')}
                                                                className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-600 hover:bg-zinc-200 flex items-center justify-center transition-colors cursor-pointer"
                                                                title="Diminuir gol"
                                                            >
                                                                <FiMinus size={14} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleUpdateGoals(keeper.id, keeper.goalsAgainst, 'add')}
                                                                className="w-8 h-8 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 flex items-center justify-center transition-colors cursor-pointer shadow-sm"
                                                                title="Adicionar gol sofrido"
                                                            >
                                                                <FiPlus size={14} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>

                </main>
            </Container>
        </div>
    )
}