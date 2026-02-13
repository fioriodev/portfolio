import style from './detail.module.css'

import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import type { CoinProps } from '../home'

interface ResponseData {
    data: CoinProps
}

interface ErrorData {
    error: string;
}

type dataProps = ResponseData | ErrorData

export function Detail() {
    const { cripto } = useParams()
    const[coin, setCoin] = useState<CoinProps>()
    const[loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        getCoin()
    }, [cripto])

    function getCoin() {
        fetch(`https://rest.coincap.io/v3/assets/${cripto}?apiKey=d41564b6f16fb466efa3f0a51cd06dc82821979da8e3dd199aa1d40ab8c19a04`)
        .then(response => response.json())
        .then((data: dataProps) => {

            if("error" in data) {
                navigate("/")
                return
            }
            
            const formatter = Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                notation: "compact"
            })

            const resultFormatted = {
                ...data.data,
                priceUsdFormatted: formatter.format(Number(data.data.priceUsd)),
                marketCapUsdFormatted: formatter.format(Number(data.data.marketCapUsd)),
                volumeUsd24HrFormatted: formatter.format(Number(data.data.volumeUsd24Hr))
            }

            setCoin(resultFormatted)
            setLoading(false)
        }).catch((error) => {
            console.log("Não foi possível completar os dados, tente novamente mais tarde", error)
            navigate("/")
        })
    }

    if(loading) {
        return <div className={style.loading}><h3>Carregando os dados...</h3></div>
    }

    return (
        <section className={style.container}>
            <div className={style.div}>
                <img src={`https://assets.coincap.io/assets/icons/${coin?.symbol.toLowerCase()}@2x.png`} alt="Logo Cripto" className={style.icone}/>
                <div>
                    <h1>{coin?.name}</h1>
                    <h2>{coin?.symbol}</h2>
                </div>
            </div>

            <ul>
                <li><span className={style.legend}>Preço:</span> {coin?.priceUsdFormatted}</li>
                <li><span className={style.legend}>Valor Mercado:</span> {coin?.marketCapUsdFormatted}</li>
                <li><span className={style.legend}>Volume:</span> {coin?.volumeUsd24HrFormatted}</li>
                <li><span className={style.legend}>Mudança 24h:</span> <span className={Number(coin?.changePercent24Hr) > 0 ? style.tdProfit : style.tdLoss}>{Number(coin?.changePercent24Hr).toFixed(2)}</span></li>
            </ul>
        </section>
    )
}