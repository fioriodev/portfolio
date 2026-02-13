import style from './home.module.css'
import { BsSearch } from 'react-icons/bs'

import type { FormEvent } from 'react'
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export interface CoinProps {
    id: string;
    rank: string;
    symbol: string;
    name: string;
    supply: string;
    maxSupply: string;
    marketCapUsd: string;
    volumeUsd24Hr: string;
    priceUsd: string;
    changePercent24Hr: string;
    vwap24Hr: string;
    priceUsdFormatted?: string;
    marketCapUsdFormatted?: string;
    volumeUsd24HrFormatted?: string;
}

interface dataProps {
    data: CoinProps[]
}

export function Home() {
    const[input, setInput] = useState("")
    const[offset, setOffset] = useState(0)
    const[coins, setCoins] = useState<CoinProps[]>([])

    const navigate = useNavigate()

    useEffect(() => {
        getData()
    }, [offset])

    async function getData() {
        fetch(`https://rest.coincap.io/v3/assets?limit=10&offset=${offset}&apiKey=d41564b6f16fb466efa3f0a51cd06dc82821979da8e3dd199aa1d40ab8c19a04`)
        .then(response => response.json())
        .then((data: dataProps) => {
            const coinsData = data.data

            const formatter = Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                notation: "compact"
            })

            const resultFormatted = coinsData.map((item) => {
                return {
                    ...item,
                    priceUsdFormatted: formatter.format(Number(item.priceUsd)),
                    marketCapUsdFormatted: formatter.format(Number(item.marketCapUsd)),
                    volumeUsd24HrFormatted: formatter.format(Number(item.volumeUsd24Hr))
                }
            })

            const allCoins = [...coins, ...resultFormatted]
            setCoins(allCoins)
        })
    }

    function handleSubmit(event: FormEvent) {
        event.preventDefault()

        if(!input) return alert("Digite uma moeda para continuar")

        navigate(`/detail/${input}`)
    }

    function handleGetMore() {
        if(offset === 0) return setOffset(10)

        setOffset(offset + 10)
    }

    return (
        <main className={style.container}>

            <form className={style.form} onSubmit={handleSubmit}>
                <input type="text" placeholder="Digite a moeda..."
                value={input} onChange={(e) => setInput(e.target.value)}/>

                <button type="submit">
                    <BsSearch size={30} color="white"/>
                </button>
            </form>

            <table>
                <thead>
                    <tr>
                        <th>Moeda</th>
                        <th>Preço</th>
                        <th>Valor Mercado</th>
                        <th>Volume</th>
                        <th>Mudança 24h</th>
                    </tr>
                </thead>

                <tbody>
                    {coins.length > 0 && coins.map((item) => (
                        <tr className={style.tr} key={item.id}>
                            <td className={style.tdLabel} data-label="Moeda">
                                <div className={style.name}>
                                    <img src={`https://assets.coincap.io/assets/icons/${item.symbol.toLowerCase()}@2x.png`} alt="Logo Cripto" className={style.icone} />
                                    <Link to={`/detail/${item.id}`}>
                                        <span>{item.name}</span> | {item.symbol}
                                    </Link>
                                </div>
                            </td>

                            <td className={style.tdLabel} data-label="Preço">
                                {item.priceUsdFormatted}
                            </td>

                            <td className={style.tdLabel} data-label="Valor Mercado">
                                {item.marketCapUsdFormatted}
                            </td>

                            <td className={style.tdLabel} data-label="Volume">
                                {item.volumeUsd24HrFormatted}
                            </td>

                            <td className={Number(item.changePercent24Hr) > 0 ? style.tdProfit : style.tdLoss} data-label="Mudança 24h">
                                {Number(item.changePercent24Hr).toFixed(2)}%
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button className={style.buttonMore} onClick={handleGetMore}>Carregar Mais</button>

        </main>
    )
}