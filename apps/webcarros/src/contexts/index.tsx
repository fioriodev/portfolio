import { createContext, useState, useEffect, type ReactNode } from "react";
import { auth } from "../services/firebaseConnection";
import { onAuthStateChanged } from "firebase/auth";

interface UserContextData {
    signed: boolean;
    loading: boolean;
    saveInfoUser: ({uid, name, email}: UserProps) => void;
    user: UserProps | null;
}

interface UserProps {
    uid: string;
    name: string | null;
    email: string | null;
}

export const UserContext = createContext({} as UserContextData)

function UserProvider({children}:{children: ReactNode}) {
    const[user, setUser] = useState<UserProps | null>(null)
    const[loading, setLoading] = useState(true)

    useEffect(() => {
        handleLogin()
    }, [])

    async function handleLogin() {
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
    }

    function saveInfoUser({uid, name, email}:UserProps) {
        setUser({
            uid,
            name,
            email
        })
    }

    return (
        <UserContext.Provider value={{ signed: !!user, loading, saveInfoUser, user }}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider