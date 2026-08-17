import { useContext, type ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { UserContext } from "../contexts"

export function Private({children}: {children:ReactNode}) {
    const{ signed, loading } = useContext(UserContext)

    if(!signed) return <Navigate to="/login"/>

    if(loading) return <div className="h-screen w-full flex justify-center items-center"><p>Carregando...</p></div>

    return children
}