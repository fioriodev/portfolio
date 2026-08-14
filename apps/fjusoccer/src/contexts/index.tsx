import { createContext } from "react";
import { useState, useEffect } from "react";
import type { ReactNode } from "react";

import { auth, db } from "../services/firebaseConnection";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";

interface UserContextProps {
    signed: boolean;
    loading: boolean;
    setInfoUser: ({uid, name, email}:UserProps) => void;
    user: UserProps | null;
    dates: dataProps;
    fetchTotalTeams: () => void;
    totalGoals: string;
    fetchTotalGoals: () => void;
}

interface UserProps {
    uid: string;
    name: string | null;
    email: string | null;
}

interface dataProps {
    qtdTeams: string;
}

export const UserContextData = createContext({} as UserContextProps)

function UserProvider({children}: {children: ReactNode}) {
    const [user, setUser] = useState<UserProps | null>(null)
    const [loading, setLoading] = useState(true)
    const [dates, setDates] = useState<dataProps>({ qtdTeams: '00' })
    const [totalGoals, setTotalGoals] = useState<string>("00")

    async function fetchTotalTeams() {
        try {
            const querySnapshot = await getDocs(collection(db, "teams"));
            const total = querySnapshot.size;
            
            const formattedTotal = total < 10 ? `0${total}` : `${total}`;

            setDates({
                qtdTeams: formattedTotal
            })
        } catch (error) {
            console.log("Erro ao buscar total de times:", error);
        }
    }

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            if(user) {
                setUser({
                    uid: user.uid,
                    name: user.displayName,
                    email: user.email
                })
                fetchTotalTeams();
                fetchTotalGoals();
            } else {
                setUser(null)
            }
            setLoading(false)
        })
        
        return () => {
            unsub()
        }
    }, [])

    function setInfoUser({uid, name, email}: UserProps) {
        setUser({
            uid,
            name,
            email
        })
    }

    async function fetchTotalGoals() {
        try {
            const querySnapshot = await getDocs(collection(db, "scorers"));
            let sum = 0;
            
            querySnapshot.forEach((doc) => {
                sum += Number(doc.data().goals || 0);
            });

            const formattedGoals = sum < 10 ? `0${sum}` : `${sum}`;
            setTotalGoals(formattedGoals);
        } catch (error) {
            console.log("Erro ao buscar total de gols:", error);
        }
    }

    return (
        <UserContextData.Provider value={{ 
            signed: !!user, 
            loading, 
            setInfoUser, 
            user, 
            dates, 
            fetchTotalTeams, 
            totalGoals,       // <--- ADICIONADO AQUI
            fetchTotalGoals 
        }}>
            {children}
        </UserContextData.Provider>
    )
}

export default UserProvider;