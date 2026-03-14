import type { ReactNode } from "react"

interface privateProps {
    children: ReactNode;
}

import { auth } from "../services/firebaseConnection";
import { onAuthStateChanged } from "firebase/auth";

import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

export function Private({children}: privateProps) {
    const[loading, setLoading] = useState(true)
    const[signed, setSigned] = useState(false)

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            if(user) {
                const userData = {
                    uid: user.uid,
                    email: user.email
                }

                localStorage.setItem("devlink", JSON.stringify(userData))
                setSigned(true)
            } else {
                setSigned(false)
            }
            setLoading(false)
        })
        return () => {
            unsub()
        }
    }, [])

    if(loading) return <h2 className="flex flex-col justify-center items-center text-white h-screen text-lg">Carregando...</h2>

    if(!signed) return <Navigate to="/login"/>

    return children
}