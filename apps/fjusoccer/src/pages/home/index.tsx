import { Container } from '../../components/container'
import { Link } from 'react-router-dom'

import Benjamin from '/benjamin.png'
import Naftali from '/naftali.png'
import Aser from '/aser.png'
import Levi from '/levi.png'
import Gade from '/gade.png'
import Efraim from '/efraim.png'

import { useContext, useEffect, useState } from 'react'
import { UserContextData } from '../../contexts'
import { db } from '../../services/firebaseConnection'
import { collection, getDocs } from 'firebase/firestore'

interface TopScorerProps {
    name: string;
    team: string;
    goals: number;
}

interface TopGoalkeeperProps {
    name: string;
    team: string;
    goalsAgainst: number;
}

export function Home() {
    const { dates, fetchTotalTeams } = useContext(UserContextData)
    const [topScorer, setTopScorer] = useState<TopScorerProps | null>(null)
    const [topGoalkeeper, setTopGoalkeeper] = useState<TopGoalkeeperProps | null>(null)
    const [totalGoalsSum, setTotalGoalsSum] = useState<number>(0)

    // Atualiza os dados gerais, busca o artilheiro, o goleiro menos vazado e a soma total de gols ao carregar a página
    useEffect(() => {
        fetchTotalTeams()
        loadScorersData()
        loadGoalkeepersData()
    }, [])

    async function loadScorersData() {
        try {
            const scorersRef = collection(db, "scorers")
            const snapshot = await getDocs(scorersRef)

            let sumGoals = 0
            let bestScorer: TopScorerProps | null = null
            let maxGoals = -1

            snapshot.forEach((docSnap) => {
                const data = docSnap.data()
                const goals = Number(data.goals) || 0

                // Soma para o total geral de gols do campeonato
                sumGoals += goals

                // Identifica o artilheiro (maior número de gols)
                if (goals > maxGoals) {
                    maxGoals = goals
                    bestScorer = {
                        name: data.name,
                        team: data.team,
                        goals: goals
                    }
                }
            })

            setTotalGoalsSum(sumGoals)

            if (bestScorer) {
                setTopScorer(bestScorer)
            } else {
                setTopScorer({ name: "Nenhum cadastrado", team: "-", goals: 0 })
            }

        } catch (error) {
            console.log("Erro ao carregar dados da artilharia:", error)
        }
    }

    async function loadGoalkeepersData() {
        try {
            const goalkeepersRef = collection(db, "goalkeepers")
            const snapshot = await getDocs(goalkeepersRef)

            let bestGoalkeeper: TopGoalkeeperProps | null = null
            let minGoals = Infinity

            snapshot.forEach((docSnap) => {
                const data = docSnap.data()
                const goalsAgainst = Number(data.goalsAgainst) || 0

                // Identifica o goleiro menos vazado (menor número de gols sofridos)
                if (goalsAgainst < minGoals) {
                    minGoals = goalsAgainst
                    bestGoalkeeper = {
                        name: data.name,
                        team: data.team,
                        goalsAgainst: goalsAgainst
                    }
                }
            })

            if (bestGoalkeeper) {
                setTopGoalkeeper(bestGoalkeeper)
            } else {
                setTopGoalkeeper({ name: "Nenhum cadastrado", team: "-", goalsAgainst: 0 })
            }

        } catch (error) {
            console.log("Erro ao carregar dados dos goleiros:", error)
        }
    }

    const stats = [
        { label: 'Times Inscritos', value: dates?.qtdTeams || '00', icon: '👥', color: 'bg-blue-50 text-blue-600' },
        { label: 'Partidas Jogadas', value: '00/11', icon: '⚡', color: 'bg-emerald-50 text-emerald-600' },
        { label: 'Gols Marcados', value: totalGoalsSum, icon: '⚽', color: 'bg-amber-50 text-amber-600' },
        { label: 'Próxima Rodada', value: 'Sábado, 29/08', icon: '📅', color: 'bg-purple-50 text-purple-600' },
    ]

    const calendarMatch = {
        time: '17:00',
        date: 'Sábado, 29/08',
        stadium: 'Arena Municipal'
    }

    const nextMatch1 = {
        homeTeam: 'Aser',
        homeLogo: <img src={Aser} alt="logo-equipe" className="w-12 h-12 object-contain"/>,
        awayTeam: 'Benjamin',
        awayLogo: <img src={Benjamin} alt="logo-equipe" className="w-12 h-12 object-contain"/>,
    }

    const nextMatch2 = {
        homeTeam: 'Levi',
        homeLogo: <img src={Levi} alt="logo-equipe" className="w-12 h-12 object-contain"/>,
        awayTeam: 'Efraim',
        awayLogo: <img src={Efraim} alt="logo-equipe" className="w-12 h-12 object-contain"/>,
    }

    const nextMatch3 = {
        homeTeam: 'Gade',
        homeLogo: <img src={Gade} alt="logo-equipe" className="w-12 h-12 object-contain"/>,
        awayTeam: 'Naftali',
        awayLogo: <img src={Naftali} alt="logo-equipe" className="w-12 h-12 object-contain"/>,
    }

    const topStandings = [
        { pos: 1, name: 'Benjamin', pts: 0, j: 0, sg: 0 },
        { pos: 2, name: 'Naftali', pts: 0, j: 0, sg: 0 },
        { pos: 3, name: 'Aser', pts: 0, j: 0, sg: 0 },
        { pos: 4, name: 'Levi', pts: 0, j: 0, sg: 0 },
        { pos: 5, name: 'Gade', pts: 0, j: 0, sg: 0 },
        { pos: 6, name: 'Efraim', pts: 0, j: 0, sg: 0 },
    ]

    return (
        <div className="min-h-screen bg-zinc-50 pb-16 pt-1">
            <Container>

                {/* Botões de navegação para o Dashboard e Logout */}
                <div className="flex items-center justify-center mt-5 w-2xl md:w-xl w-full mx-auto mb-10 bg-zinc-800 text-white uppercase">
                    <Link 
                        to="/dashboard" 
                        className="hover:bg-zinc-700 flex-2 py-2.5 text-sm font-medium transition-colors flex justify-center"
                    >
                        Acessar Detalhes
                    </Link>
                    
                    <Link 
                        to="/" 
                        className="hover:bg-red-900 flex-1 py-2.5 text-sm font-medium transition-colors flex justify-center"
                    >
                        Sair
                    </Link>
                </div>
                
                <main className="flex flex-col gap-8">
                    
                    {/* 1. Cards de Indicadores (Estatísticas Rápidas) */}
                    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-white p-5 rounded-2xl shadow-sm border border-zinc-200/80 flex items-center gap-4 transition-all hover:border-zinc-300">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-inner ${stat.color}`}>
                                    {stat.icon}
                                </div>
                                <div>
                                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{stat.label}</span>
                                    <h2 className="text-2xl font-extrabold text-zinc-900">{stat.value}</h2>
                                </div>
                            </div>
                        ))}
                    </section>

                    {/* Grid Principal: Próximo Jogo e Classificação Parcial */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Coluna Esquerda/Centro: Próximo Jogo, Artilharia & Goleiro Menos Vazado */}
                        <div className="lg:col-span-2 flex flex-col gap-8">
                            
                            {/* Card do Próximo Jogo */}
                            <section className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200/80">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                                        📅 Próximos Confrontos
                                    </h3>
                                    <span className="text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60 px-3 py-1 rounded-full">
                                        {calendarMatch.date} - {calendarMatch.time}
                                    </span>
                                </div>

                                <div className="flex flex-col gap-3">
                                    {[nextMatch1, nextMatch2, nextMatch3].map((match, idx) => (
                                        <div key={idx} className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-800 p-5 rounded-xl text-white flex items-center justify-between shadow-md border border-zinc-800">
                                            <div className="flex flex-col items-center flex-1 gap-1">
                                                <span className="flex justify-center">{match.homeLogo}</span>
                                                <span className="font-bold text-sm sm:text-base text-center text-zinc-100">{match.homeTeam}</span>
                                            </div>
                                            <div className="px-4 text-center">
                                                <span className="text-xs font-black tracking-widest text-zinc-500 bg-zinc-800/80 px-2.5 py-1 rounded-md">VS</span>
                                                <p className="text-[11px] text-zinc-400 mt-1.5">{calendarMatch.stadium}</p>
                                            </div>
                                            <div className="flex flex-col items-center flex-1 gap-1">
                                                <span className="flex justify-center">{match.awayLogo}</span>
                                                <span className="font-bold text-sm sm:text-base text-center text-zinc-100">{match.awayTeam}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Grid em 2 colunas para Artilheiro e Goleiro Menos Vazado */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                
                                {/* Seção de Artilheiro */}
                                <section className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200/80 flex flex-col justify-between">
                                    <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2 mb-4">
                                        🏆 Artilheiro
                                    </h3>
                                    <div className="flex items-center justify-between p-3.5 bg-zinc-50/80 rounded-xl border border-zinc-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-base shadow-sm">
                                                ⚽
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm text-zinc-900">{topScorer?.name || "Carregando..."}</h4>
                                                <p className="text-xs text-zinc-500">{topScorer?.team || "-"}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-lg font-extrabold text-zinc-900">{topScorer ? topScorer.goals : 0}</span>
                                            <p className="text-[10px] uppercase font-semibold text-zinc-400">Gols</p>
                                        </div>
                                    </div>
                                </section>

                                {/* Seção de Goleiro Menos Vazado */}
                                <section className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200/80 flex flex-col justify-between">
                                    <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2 mb-4">
                                        🧤 Goleiro Menos Vazado
                                    </h3>
                                    <div className="flex items-center justify-between p-3.5 bg-zinc-50/80 rounded-xl border border-zinc-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-base shadow-sm">
                                                🧱
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm text-zinc-900">{topGoalkeeper?.name || "Carregando..."}</h4>
                                                <p className="text-xs text-zinc-500">{topGoalkeeper?.team || "-"}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-lg font-extrabold text-zinc-900">{topGoalkeeper ? topGoalkeeper.goalsAgainst : 0}</span>
                                            <p className="text-[10px] uppercase font-semibold text-zinc-400">Sofridos</p>
                                        </div>
                                    </div>
                                </section>

                            </div>

                        </div>

                        {/* Coluna Direita: Tabela Parcial */}
                        <div className="lg:col-span-1">
                            <section className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200/80 h-full flex flex-col">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                                        🛡️ Classificação
                                    </h3>
                                    <Link to="/tabela" className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                                        Ver completa &gt;
                                    </Link>
                                </div>

                                <div className="flex flex-col flex-1 divide-y divide-zinc-100">
                                    <div className="flex items-center justify-between text-xs font-bold text-zinc-400 pb-3">
                                        <span>Time</span>
                                        <div className="flex gap-4">
                                            <span className="w-3 text-center">J</span>
                                            <span className="w-4 text-center">SG</span>
                                            <span className="w-5 text-center">PTS</span>
                                        </div>
                                    </div>

                                    {topStandings.map((team) => (
                                        <div key={team.pos} className="flex items-center justify-between py-3 text-sm">
                                            <div className="flex items-center gap-3">
                                                <span className={`w-6 text-center font-extrabold text-xs py-0.5 rounded ${team.pos <= 2 ? 'bg-emerald-50 text-emerald-600' : team.pos >= 5 ? 'bg-red-50 text-red-600' : 'text-zinc-500'}`}>
                                                    {team.pos}º
                                                </span>
                                                <span className="font-semibold text-zinc-800">{team.name}</span>
                                            </div>
                                            <div className="flex gap-4 text-xs font-semibold text-zinc-600">
                                                <span className="w-3 text-center">{team.j}</span>
                                                <span className="w-4 text-center">{team.sg}</span>
                                                <span className="w-5 text-center text-zinc-900 font-extrabold">{team.pts}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                    </div>

                </main>
            </Container>
        </div>
    )
}