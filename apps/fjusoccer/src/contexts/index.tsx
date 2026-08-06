import { createContext } from "react";
import { useState, useEffect } from "react";
import type { ReactNode } from "react";

import { auth } from "../services/firebaseConnection";
import { onAuthStateChanged } from "firebase/auth";

interface UserContextProps {
    signed: boolean;
    loading: boolean;
    setInfoUser: ({uid, name, email}:UserProps) => void;
    user: UserProps | null;
}

interface UserProps {
    uid: string;
    name: string | null;
    email: string | null;
}

export const UserContextData = createContext({} as UserContextProps)

function UserProvider({children}: {children: ReactNode}) {
    const[user, setUser] = useState<UserProps | null>(null)
    const[loading, setLoading] = useState(true)

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            if(user) {
                setUser({
                    uid: user.uid,
                    name: user.displayName,
                    email: user.email
                })
            } else {
                setUser(null)
            }
            setLoading(false)
            return () => {
                unsub()
            }
        })
    }, [])

    function setInfoUser({uid, name, email}: UserProps) {
        setUser({
            uid,
            name,
            email
        })
    }

    return (
        <UserContextData.Provider value={{ signed: !!user, loading, setInfoUser, user }}>
            {children}
        </UserContextData.Provider>
    )
}

export default UserProvider;