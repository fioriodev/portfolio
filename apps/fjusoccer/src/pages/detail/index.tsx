import { Container } from '../../components/container'
import { Panel } from '../../components/panel'
import { FiUserPlus, FiTrash2, FiShield, FiUser, FiActivity, FiUpload } from 'react-icons/fi'

import { db } from '../../services/firebaseConnection'
import { addDoc, getDocs, collection, deleteDoc, doc, query, where } from 'firebase/firestore'
import { useParams } from 'react-router-dom'

import { useState, useEffect, type ChangeEvent, useContext } from 'react'
import { UserContextData } from '../../contexts'

import { storage } from '../../services/firebaseConnection'
import { uploadBytes, getDownloadURL, deleteObject, ref } from 'firebase/storage'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Input } from '../../components/input'

interface teamProps {
    uid: string;
    name: string;
    manager: string;
    imageLogo: {
        imagePath: string;
        name: string;
        url: string;
    }
}

interface ImagePlayerProps {
    name: string | null;
    previewUrl: string;
    url: string;
    imagePath?: string;
}

interface playerProps {
    id: string;
    name: string;
    imagePlayer: string;
    imagePath?: string;
    posicao: string;
    numero: string;
    ritmo: string;
    finalizacao: string;
    passe: string;
    drible: string;
    defesa: string;
    fisico: string;
}

const schema = z.object({
    name: z.string().nonempty("Nome obrigatório"),
    position: z.string().nonempty("Posição obrigatório"),
    number: z.string().nonempty("Número obrigatório"),
    rit: z.string().nonempty("Inserir Ritmo"),
    fin: z.string().nonempty("Inserir Finalização"),
    pas: z.string().nonempty("Inserir Passe"),
    dri: z.string().nonempty("Inserir Drible"),
    def: z.string().nonempty("Inserir Defesa"),
    fis: z.string().nonempty("Inserir Físico")
})

type FormData = z.infer<typeof schema>

export function Detail() {
    const [team, setTeam] = useState<teamProps>()
    const { id } = useParams()
    const [imagePlayer, setImagePlayer] = useState<ImagePlayerProps | null>()
    const [players, setPlayers] = useState<playerProps[]>([])
    const { user } = useContext(UserContextData)
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    })

    useEffect(() => {
        loadTeam()
    }, [id])

    useEffect(() => {
        if (team?.name) {
            loadPlayers(team.name)
        }
    }, [team])

    async function loadTeam() {
        const teamsRef = collection(db, "teams")
        const snapshot = await getDocs(teamsRef)
        let listTeams = [] as teamProps[]
        
        snapshot.forEach((docSnap) => {
            listTeams.push({
                uid: docSnap.id,
                name: docSnap.data().name,
                manager: docSnap.data().manager,
                imageLogo: docSnap.data().imageLogo
            })
        })
        const teamRef = listTeams.filter((t) => t.name === id)
        setTeam(teamRef[0])
    }

    async function loadPlayers(teamName: string) {
        const playerRef = collection(db, "players")
        const q = query(playerRef, where("team", "==", teamName))
        const snapshot = await getDocs(q)
        
        let listPlayers = [] as playerProps[]

        snapshot.forEach(docSnap => {
            listPlayers.push({
                id: docSnap.id,
                name: docSnap.data().name,
                imagePlayer: docSnap.data().imagePlayer,
                imagePath: docSnap.data().imagePath,
                posicao: docSnap.data().posicao,
                numero: docSnap.data().number,
                ritmo: docSnap.data().ritmo,
                finalizacao: docSnap.data().finalizacao,
                passe: docSnap.data().passe,
                drible: docSnap.data().drible,
                defesa: docSnap.data().defesa,
                fisico: docSnap.data().fisico,
            })
        })

        setPlayers(listPlayers)
    }

    async function handleFile(data: ChangeEvent<HTMLInputElement>) {
        if(data.target.files && data.target.files[0]) {
            const image = data.target.files[0]
            if(image.type === 'image/jpeg' || image.type === 'image/png') {
                await handleUpload(image)
            } else {
                alert("Insira uma imagem PNG ou JPEG")
                return
            }
        } 
    }

    async function handleUpload(image: File) {
        const imageName = `${Date.now()}_${image.name}`
        const imagePath = `/players/${user?.uid}/${imageName}`
        const uploadRef = ref(storage, imagePath)

        try {
            const snapshot = await uploadBytes(uploadRef, image)
            const downloadUrl = await getDownloadURL(snapshot.ref)

            setImagePlayer({
                name: image.name,
                previewUrl: URL.createObjectURL(image),
                url: downloadUrl,
                imagePath: imagePath 
            })
        } catch(error) {
            console.log("Erro ao enviar imagem:", error)
            alert("Erro ao fazer upload da imagem.")
        }
    }

    async function handleDeleteImage(image: ImagePlayerProps) {
        const pathToDelete = image.imagePath

        if (!pathToDelete) {
            alert("Caminho da imagem não encontrado.")
            return
        }

        const imageRef = ref(storage, pathToDelete)

        try {
            await deleteObject(imageRef)
            setImagePlayer(null)
            alert("Imagem deletada com sucesso")
        } catch(error) {
            console.log("Erro detalhado:", error)
            alert("ERRO AO DELETAR IMAGEM")
        }
    }
    
    function formSubmit(data: FormData) {
        if(!imagePlayer?.previewUrl) {
            alert("Envie imagem para continuar")
            return
        }

        if(!team?.name) return

        // 1. Cadastra o jogador na coleção de players do time
        addDoc(collection(db, "players"), {
            name: data.name,
            posicao: data.position,
            number: data.number,
            ritmo: data.rit,
            finalizacao: data.fin,
            passe: data.pas,
            drible: data.dri,
            defesa: data.def,
            fisico: data.fis,
            imagePlayer: imagePlayer?.url,
            imagePath: imagePlayer?.imagePath,
            team: team.name
        })
        .then(() => {
            // 2. ADICIONA AUTOMATICAMENTE NA ARTILHARIA COM 0 GOLS
            addDoc(collection(db, "scorers"), {
                name: data.name,
                team: team.name,
                goals: 0
            }).catch((err) => {
                console.log("Erro ao cadastrar na artilharia:", err)
            })

            // 3. SE FOR GOLEIRO, ADICIONA AUTOMATICAMENTE NO RANKING DE GOLEIROS COM 0 GOLS SOFRIDOS
            if (data.position === "Goleiro") {
                addDoc(collection(db, "goalkeepers"), {
                    name: data.name,
                    team: team.name,
                    goalsAgainst: 0
                }).catch((err) => {
                    console.log("Erro ao cadastrar nos goleiros:", err)
                })
            }

            reset()
            setImagePlayer(null)
            loadPlayers(team.name)
            alert("CADASTRADO COM SUCESSO")
        })
        .catch(() => {
            alert("ERRO AO CADASTRAR")
        })
    }

    async function handleDeletePlayer(player: playerProps) {
        try {
            // 1. Deleta a imagem do Storage se existir
            if (player.imagePath) {
                const imageRef = ref(storage, player.imagePath)
                await deleteObject(imageRef)
            }

            // 2. Deleta o documento do jogador na coleção "players"
            await deleteDoc(doc(db, "players", player.id))

            // 3. Procura e deleta o jogador correspondente na coleção "scorers" (Artilharia)
            const scorersRef = collection(db, "scorers")
            const qScorers = query(scorersRef, where("name", "==", player.name), where("team", "==", team?.name))
            const snapshotScorers = await getDocs(qScorers)
            
            snapshotScorers.forEach(async (scorerDoc) => {
                await deleteDoc(doc(db, "scorers", scorerDoc.id))
            })

            // 4. Procura e deleta o goleiro correspondente na coleção "goalkeepers" (se ele for goleiro)
            if (player.posicao === "Goleiro") {
                const keepersRef = collection(db, "goalkeepers")
                const qKeepers = query(keepersRef, where("name", "==", player.name), where("team", "==", team?.name))
                const snapshotKeepers = await getDocs(qKeepers)
                
                snapshotKeepers.forEach(async (keeperDoc) => {
                    await deleteDoc(doc(db, "goalkeepers", keeperDoc.id))
                })
            }

            // 5. Atualiza o estado local removendo o jogador da tela
            setPlayers(players.filter(p => p.id !== player.id))
            alert("Atleta e imagem removidos com sucesso!")
        } catch (error) {
            console.log("Erro ao deletar jogador:", error)
            alert("Erro ao remover atleta.")
        }
    }

    return (
        <div className="min-h-screen bg-zinc-100 pb-12 pt-5">
            <Container>
                <Panel />

                {/* --- CABEÇALHO DO TIME --- */}
                <div className="bg-white rounded-2xl p-6 mt-6 shadow-sm border border-zinc-200 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-32 h-32 bg-zinc-200 border-zinc-300 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center border">
                        <img 
                            src={team?.imageLogo.url} 
                            alt="Escudo do Time" 
                            className="w-full h-full object-cover" 
                        />
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl font-extrabold text-zinc-900 mt-2">{team?.name}</h1>
                        <p className="text-zinc-500 text-sm mt-1 flex items-center justify-center md:justify-start gap-1">
                            <FiUser size={16} /> Técnico/Responsável: <span className="font-medium text-zinc-700">{team?.manager}</span>
                        </p>
                    </div>
                </div>

                {/* --- GRID PRINCIPAL (Formulário + Lista) --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                    
                    {/* COLUNA 1: Formulário para Adicionar Jogador com Atributos */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-200 h-fit">
                        <h2 className="text-lg font-bold text-zinc-800 mb-4 flex items-center gap-2">
                            <FiUserPlus className="text-blue-600" /> Adicionar Jogador
                        </h2>

                        <form className="flex flex-col gap-4" onSubmit={handleSubmit(formSubmit)}>

                            {!imagePlayer?.previewUrl && (
                                <button type="button" className="border border-zinc-300 w-full h-48 rounded-xl mb-5 flex flex-col justify-center items-center relative overflow-hidden">
                                    <div className="absolute">
                                        <FiUpload size={30}/>
                                    </div>
                                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFile}/>
                                </button>
                            )}

                            {imagePlayer?.previewUrl && (
                                <div className="w-full h-48 rounded-xl mb-5 flex flex-col justify-center items-center relative overflow-hidden">
                                    <button type="button" className="absolute top-0 left-3 bg-black p-1.5 rounded-md cursor-pointer transition duration-150 hover:bg-red-800 active:bg-red-600 z-10">
                                        <FiTrash2 color="white" size={20} onClick={() => handleDeleteImage(imagePlayer)}/>
                                    </button>
                                    <img src={imagePlayer.previewUrl} alt="foto-perfil" className="w-48 h-48 rounded-full object-cover" />
                                </div>
                            )}

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-zinc-600 uppercase">Nome do Jogador</label>
                                <Input
                                type="text"
                                placeholder="Ex: Vinicius Junior"
                                register={register}
                                name="name"
                                error={errors.name?.message}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-zinc-600 uppercase">Posição</label>
                                    <select className="w-full h-11 px-3 rounded-xl border border-zinc-300 text-zinc-800 bg-white focus:outline-none focus:border-zinc-950 transition-colors text-sm"
                                    {...register("position")}>
                                        <option value="">Selecione</option>
                                        <option value="Atacante">Atacante</option>
                                        <option value="Meia">Meia</option>
                                        <option value="Zagueiro">Zagueiro</option>
                                        <option value="Goleiro">Goleiro</option>
                                    </select>
                                    {errors.position && (
                                        <span className="text-sm text-red-600">{errors.position?.message}</span>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-zinc-600 uppercase">Nº Camisa</label>
                                    <Input
                                    type="number"
                                    placeholder="Ex: 7"
                                    name="number"
                                    register={register}
                                    error={errors?.number?.message}
                                    />
                                </div>
                            </div>

                            {/* Seção de Atributos (0 a 100) */}
                            <div className="border-t border-zinc-200 pt-3 mt-1">
                                <span className="text-xs font-bold text-zinc-700 uppercase flex items-center gap-1.5 mb-3">
                                    <FiActivity className="text-blue-600" /> Atributos (0 a 100)
                                </span>

                                <div className="grid grid-cols-3 gap-2.5">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] font-semibold text-zinc-500 uppercase">Ritmo</label>
                                        <Input type="number" placeholder="0" name="rit" register={register} error={errors?.rit?.message} />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] font-semibold text-zinc-500 uppercase">Finalização</label>
                                        <Input type="number" placeholder="0" name="fin" register={register} error={errors?.fin?.message} />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] font-semibold text-zinc-500 uppercase">Passe</label>
                                        <Input type="number" placeholder="0" name="pas" register={register} error={errors?.pas?.message} />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] font-semibold text-zinc-500 uppercase">Drible</label>
                                        <Input type="number" placeholder="0" name="dri" register={register} error={errors?.dri?.message} />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] font-semibold text-zinc-500 uppercase">Defesa</label>
                                        <Input type="number" placeholder="0" name="def" register={register} error={errors?.def?.message} />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] font-semibold text-zinc-500 uppercase">Físico</label>
                                        <Input type="number" placeholder="0" name="fis" register={register} error={errors?.fis?.message} />
                                    </div>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                className="bg-zinc-900 text-white font-medium h-11 rounded-xl hover:bg-zinc-800 transition-colors mt-3 shadow-md cursor-pointer text-sm"
                            >
                                Cadastrar Atleta
                            </button>
                        </form>
                    </div>

                    {/* COLUNA 2 E 3: Elenco / Lista de Jogadores */}
                    <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-zinc-200">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-zinc-800 flex items-center gap-2">
                                <FiShield className="text-blue-600" /> Elenco Inscrito
                            </h2>
                            <span className="bg-zinc-100 text-zinc-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                                {players.length} {players.length === 1 ? 'atleta' : 'atletas'}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {players.map((player) => (
                                <div className="flex flex-col p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/50 gap-3" key={player.id}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <img src={player.imagePlayer} alt={player.name} className="h-16 w-16 rounded-xl object-cover" />
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-zinc-900 text-white font-bold rounded-xl flex items-center justify-center text-sm shadow-sm">
                                                    {player.numero}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-zinc-800 text-sm">{player.name}</h3>
                                                    <p className="text-xs text-zinc-500 font-medium">{player.posicao}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                            title="Remover jogador"
                                            onClick={() => handleDeletePlayer(player)}
                                        >
                                            <FiTrash2 size={18} />
                                        </button>
                                    </div>

                                    {/* Mini Exibição dos Atributos no Card */}
                                    <div className="grid grid-cols-6 gap-1 bg-white p-2 rounded-lg border border-zinc-200 text-center">
                                        <div>
                                            <span className="text-[9px] block text-zinc-400 font-bold">RIT</span>
                                            <span className="text-xs font-extrabold text-zinc-800">{player.ritmo}</span>
                                        </div>
                                        <div>
                                            <span className="text-[9px] block text-zinc-400 font-bold">FIN</span>
                                            <span className="text-xs font-extrabold text-zinc-800">{player.finalizacao}</span>
                                        </div>
                                        <div>
                                            <span className="text-[9px] block text-zinc-400 font-bold">PAS</span>
                                            <span className="text-xs font-extrabold text-zinc-800">{player.passe}</span>
                                        </div>
                                        <div>
                                            <span className="text-[9px] block text-zinc-400 font-bold">DRI</span>
                                            <span className="text-xs font-extrabold text-zinc-800">{player.drible}</span>
                                        </div>
                                        <div>
                                            <span className="text-[9px] block text-zinc-400 font-bold">DEF</span>
                                            <span className="text-xs font-extrabold text-zinc-800">{player.defesa}</span>
                                        </div>
                                        <div>
                                            <span className="text-[9px] block text-zinc-400 font-bold">FIS</span>
                                            <span className="text-xs font-extrabold text-zinc-800">{player.fisico}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </Container>
        </div>
    )
}