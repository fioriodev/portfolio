import { Link } from "react-router-dom"
import { BiLogOut } from "react-icons/bi"

import { auth } from "../../services/firebaseConnection"
import { signOut } from "firebase/auth"

export function Header() {
    async function handleLogout() {
        await signOut(auth)
    }

    return (
        <header className="md:py-4">

            <nav className="bg-white m-auto md:max-w-xl md:mt-5 flex justify-between items-center px-5 h-17 md:h-12 md:rounded">
                <ul className="flex gap-4 md:gap-3 font-medium">
                    <Link to="/">Home</Link>
                    <Link to="/admin">Links</Link>
                    <Link to="/admin/social">Redes sociais</Link>
                </ul>
                <button className="cursor-pointer transition-transform hover:scale-110" onClick={handleLogout}>
                    <BiLogOut size={25} color="red"/>
                </button>
            </nav>

        </header>
    )
}