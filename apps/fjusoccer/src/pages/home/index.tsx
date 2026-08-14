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

interface StandingProps {
    teamId: string;
    name: string;
    pts: number;
    j: number;
    v: number;
    e: number;
    d: number;
    sg: number;
}

export function Home() {
    const { dates, fetchTotalTeams } = useContext(UserContextData)
    const [topScorer, setTopScorer] = useState<TopScorerProps | null>(null)
    const [topGoalkeeper, setTopGoalkeeper] = useState<TopGoalkeeperProps | null>(null)
    const [totalGoalsSum, setTotalGoalsSum] = useState<number>(0)
    const [standings, setStandings] = useState<StandingProps[]>([])

    // Carrega todos os dados ao abrir a página
    useEffect(() => {
        fetchTotalTeams()
        loadScorersData()
        loadGoalkeepersData()
        loadStandingsData()
    }, [])

    async function loadStandingsData() {
        try {
            const standingsRef = collection(db, "standings")
            const snapshot = await getDocs(standingsRef)

            let listStandings: StandingProps[] = []

            snapshot.forEach((docSnap) => {
                const data = docSnap.data()
                listStandings.push({
                    teamId: data.teamId || docSnap.id,
                    name: data.name,
                    pts: Number(data.pts) || 0,
                    j: Number(data.j) || 0,
                    v: Number(data.v) || 0,
                    e: Number(data.e) || 0,
                    d: Number(data.d) || 0,
                    sg: Number(data.sg) || 0,
                })
            })

            // Ordena os times: Primeiro por Pontos (decrescente), depois por Saldo de Gols (decrescente)
            listStandings.sort((a, b) => {
                if (b.pts !== a.pts) {
                    return b.pts - a.pts
                }
                return b.sg - a.sg
            })

            setStandings(listStandings)
        } catch (error) {
            console.log("Erro ao carregar a classificação:", error)
        }
    }

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

                sumGoals += goals

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

    return (
        <div className="min-h-screen bg-zinc-50 pb-16 pt-1">
            <Container>

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
                    
                    {/* Cards de Indicadores */}
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

                    {/* Grid Principal */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
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

                        {/* Coluna Direita: Tabela Parcial Dinâmica com Estilização Aprimorada */}
                        <div className="lg:col-span-1">
                            <section className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200/80 h-full flex flex-col">
                                <div className="flex items-center justify-between mb-5">
                                    <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                                        🛡️ Classificação
                                    </h3>
                                    <Link to="/tabela" className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                                        Ver completa &gt;
                                    </Link>
                                </div>

                                <div className="flex flex-col flex-1">
                                    {/* Cabeçalho da Tabela */}
                                    <div className="grid grid-cols-12 items-center text-[11px] font-bold text-zinc-400 uppercase tracking-wider pb-3 border-b border-zinc-100 px-3">
                                        <span className="col-span-7">Equipe</span>
                                        <span className="col-span-2 text-center">J</span>
                                        <span className="col-span-1 text-center">SG</span>
                                        <span className="col-span-2 text-center">PTS</span>
                                    </div>

                                    {/* Corpo da Tabela */}
                                    <div className="flex flex-col gap-1.5 mt-2">
                                        {standings.length === 0 ? (
                                            <p className="text-xs text-zinc-400 text-center py-8">Nenhum time cadastrado.</p>
                                        ) : (
                                            standings.map((team, index) => {
                                                const pos = index + 1
                                                return (
                                                    <div 
                                                        key={team.teamId} 
                                                        className={`grid grid-cols-12 items-center py-2.5 px-3 rounded-xl transition-all border ${
                                                            pos === 1 
                                                                ? 'bg-amber-50/60 border-amber-200/70 shadow-2xs' 
                                                                : pos === 2 
                                                                ? 'bg-zinc-50/70 border-zinc-200/50' 
                                                                : 'bg-white border-transparent hover:bg-zinc-50 hover:border-zinc-100'
                                                        }`}
                                                    >
                                                        <div className="col-span-7 flex items-center gap-2.5">
                                                            <span className={`w-6 h-6 flex items-center justify-center text-[11px] font-extrabold rounded-md shadow-2xs ${
                                                                pos === 1 ? 'bg-amber-400 text-white' : 
                                                                pos === 2 ? 'bg-zinc-300 text-zinc-800' : 
                                                                pos === 3 ? 'bg-amber-700/20 text-amber-800' :
                                                                'bg-zinc-100 text-zinc-500'
                                                            }`}>
                                                                {pos}
                                                            </span>
                                                            <span className="font-semibold text-sm text-zinc-800 truncate">{team.name}</span>
                                                        </div>
                                                        <div className="col-span-2 text-center text-xs font-medium text-zinc-500">
                                                            {team.j}
                                                        </div>
                                                        <div className="col-span-1 text-center text-xs font-medium text-zinc-600">
                                                            {team.sg}
                                                        </div>
                                                        <div className="col-span-2 text-center text-xs font-black text-zinc-900 bg-zinc-100/80 py-1 rounded-md">
                                                            {team.pts}
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        )}
                                    </div>
                                </div>
                            </section>
                        </div>

                    </div>

                </main>
            </Container>
        </div>
    )
}