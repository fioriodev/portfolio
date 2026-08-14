import { createBrowserRouter } from "react-router-dom";

import { Layout } from "./components/layout";
import { Home } from "./pages/home";
import { Detail } from "./pages/detail";
import { Dashboard } from "./pages/dashboard";
import { New } from "./pages/dashboard/new";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { Goals } from "./pages/goals";
import { Goalkeeper } from "./pages/goalkeeper";
import { Tabela } from "./pages/tabela";

export const router = createBrowserRouter([
    {
        element: <Layout/>,
        children: [
            {
                path: "/feed",
                element: <Home/>
            },
            {
                path: "/detail/:id",
                element: <Detail/>
            },
            {
                path: "/dashboard",
                element: <Dashboard/>
            },
            {
                path: "/dashboard/new",
                element: <New/>
            },
            {
                path: "/artilheiros",
                element: <Goals/>
            },
            {
                path: "/rankgoleiros",
                element: <Goalkeeper/>
            },
            {
                path: "/tabela",
                element: <Tabela/>
            }
        ]
    },
    {
        path: "/",
        element: <Login/>
    },
    {
        path: "/register",
        element: <Register/>
    }
])