import { useEffect, useState } from 'react'
import { Container } from '../../components/container'
import { db } from '../../services/firebaseConnection'
import { collection, onSnapshot, doc, updateDoc, query, orderBy } from 'firebase/firestore'
import { Link } from 'react-router-dom'
import { FiArrowLeft, FiArrowUp, FiArrowDown, FiMinus } from 'react-icons/fi'

// Importação dos escudos dos times
import Benjamin from '/benjamin.png'
import Naftali from '/naftali.png'
import Aser from '/aser.png'
import Levi from '/levi.png'
import Gade from '/gade.png'
import Efraim from '/efraim.png'

interface TeamStats {
    id: string;
    name: string;
    pts: number;
    j: number;
    v: number;
    e: number;
    d: number;
    gp: number;
    gc: number;
    sg: number;
    fju: number;
    lastPosition?: number; // Opcional: para calcular se subiu ou desceu
}

// Mapeamento do nome do time para a imagem correspondente
const teamLogos: Record<string, string> = {
    Benjamin: Benjamin,
    Naftali: Naftali,
    Aser: Aser,
    Levi: Levi,
    Gade: Gade,
    Efraim: Efraim,
}

export function Tabela() {
    const [standings, setStandings] = useState<TeamStats[]>([])

    useEffect(() => {
        const q = query(collection(db, "standings"), orderBy("pts", "desc"))
        const unsub = onSnapshot(q, (snapshot) => {
            const list: TeamStats[] = []
            snapshot.forEach((docSnap) => {
                const data = docSnap.data()
                list.push({ 
                    id: docSnap.id, 
                    name: data.name,
                    pts: Number(data.pts) || 0,
                    j: Number(data.j) || 0,
                    v: Number(data.v) || 0,
                    e: Number(data.e) || 0,
                    d: Number(data.d) || 0,
                    gp: Number(data.gp) || 0,
                    gc: Number(data.gc) || 0,
                    sg: Number(data.sg) || 0,
                    fju: Number(data.fju) || 0,
                    lastPosition: Number(data.lastPosition) || 0,
                } as TeamStats)
            })
            setStandings(list)
        })
        return () => unsub()
    }, [])

    async function handleUpdate(id: string, field: string, value: string) {
        const docRef = doc(db, "standings", id)
        await updateDoc(docRef, { [field]: Number(value) })
    }

    return (
        <div className="min-h-screen bg-zinc-100 text-zinc-800 pb-16 pt-6">
            <Container>
                {/* Botão de Voltar */}
                <div className="mb-6">
                    <Link 
                        to="/feed" 
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-zinc-300 text-zinc-600 hover:text-zinc-900 hover:border-zinc-400 transition-all text-sm font-semibold shadow-xs"
                    >
                        <FiArrowLeft className="text-base" /> Voltar para o início
                    </Link>
                </div>

                {/* Card Principal */}
                <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-zinc-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-zinc-100">
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-zinc-900">Classificação e Editor</h1>
                            <p className="text-xs text-zinc-500 mt-0.5">Edite os dados diretamente na tabela. As alterações são salvas ao sair do campo.</p>
                        </div>
                        <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg font-medium self-start sm:self-auto">
                            ● Sincronizado em tempo real
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b-2 border-zinc-200 text-zinc-500 text-[11px] font-bold uppercase tracking-wider bg-zinc-50/70">
                                    <th className="py-3 px-3 w-20 text-center">Classificação</th>
                                    <th className="py-3 px-4">Equipe</th>
                                    <th className="py-3 px-2 text-center text-zinc-900 font-extrabold">PTS</th>
                                    <th className="py-3 px-2 text-center">J</th>
                                    <th className="py-3 px-2 text-center">V</th>
                                    <th className="py-3 px-2 text-center">E</th>
                                    <th className="py-3 px-2 text-center">D</th>
                                    <th className="py-3 px-2 text-center">GP</th>
                                    <th className="py-3 px-2 text-center">GC</th>
                                    <th className="py-3 px-2 text-center">SG</th>
                                    <th className="py-3 px-2 text-center">FJU</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 text-sm">
                                {standings.map((team, index) => {
                                    const position = index + 1
                                    const logo = teamLogos[team.name]

                                    // Lógica para calcular a variação baseada na lastPosition (se cadastrada)
                                    // Se lastPosition for 0 ou igual à posição atual, fica estável.
                                    // Se lastPosition for maior que a posição atual, o time SUBIU (ex: era 5º e foi para 2º).
                                    // Se lastPosition for menor que a posição atual, o time DESCEU.
                                    let diff = 0
                                    if (team.lastPosition && team.lastPosition > 0) {
                                        diff = team.lastPosition - position
                                    }

                                    return (
                                        <tr 
                                            key={team.id} 
                                            className="hover:bg-zinc-50/80 transition-colors group"
                                        >
                                            {/* Posição com Indicador de Variação (Estilo GE) */}
                                            <td className="py-3 px-3 text-center">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    {/* Indicador de subida/descida */}
                                                    <span className="w-4 flex justify-center text-xs">
                                                        {diff > 0 ? (
                                                            <span title={`Subiu ${diff} posições`} className="text-emerald-600 flex items-center font-bold">
                                                                <FiArrowUp className="w-3.5 h-3.5" />
                                                            </span>
                                                        ) : diff < 0 ? (
                                                            <span title={`Desceu ${Math.abs(diff)} posições`} className="text-red-600 flex items-center font-bold">
                                                                <FiArrowDown className="w-3.5 h-3.5" />
                                                            </span>
                                                        ) : (
                                                            <span className="text-zinc-300">
                                                                <FiMinus className="w-3 h-3" />
                                                            </span>
                                                        )}
                                                    </span>

                                                    {/* Número da Posição */}
                                                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs ${
                                                        position <= 2 ? 'bg-emerald-100 text-emerald-800 font-extrabold' : 
                                                        position >= 5 ? 'bg-red-50 text-red-700 font-semibold' : 
                                                        'text-zinc-600 bg-zinc-100'
                                                    }`}>
                                                        {position}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Nome do Time com Escudo */}
                                            <td className="py-3 px-4 font-semibold text-zinc-900">
                                                <div className="flex items-center gap-3">
                                                    {logo ? (
                                                        <img src={logo} alt={`Escudo do ${team.name}`} className="w-7 h-7 object-contain" />
                                                    ) : (
                                                        <div className="w-7 h-7 rounded bg-zinc-100 flex items-center justify-center text-xs text-zinc-400">
                                                            ⚽
                                                        </div>
                                                    )}
                                                    <span className="truncate">{team.name}</span>
                                                </div>
                                            </td>

                                            {/* Campos Editáveis: PTS, J, V, E, D, GP, GC, SG, FJU */}
                                            {['pts', 'j', 'v', 'e', 'd', 'gp', 'gc', 'sg', 'fju'].map((field) => (
                                                <td key={field} className="py-3 px-2 text-center">
                                                    <input 
                                                        type="number"
                                                        defaultValue={team[field as keyof TeamStats]}
                                                        onBlur={(e) => handleUpdate(team.id, field, e.target.value)}
                                                        className={`w-11 h-8 text-center text-xs font-semibold rounded border transition-all outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                                                            field === 'pts' 
                                                                ? 'bg-zinc-900 text-white border-zinc-900 font-bold focus:ring-2 focus:ring-zinc-400' 
                                                                : 'bg-white text-zinc-700 border-zinc-300 hover:border-zinc-400 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900'
                                                        }`}
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </section>
            </Container>
        </div>
    )
}