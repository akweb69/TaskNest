import { createBrowserRouter } from "react-router-dom";
import Home from "./Home";
import SignIn_Up from "../Components/SignIn_Up";
import Tasknest from "../Components/Tasknest";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home></Home>
    },
    {
        path: "/join_taskNest",
        element: <SignIn_Up></SignIn_Up>
    },
    {
        path: "/tasknest_home",
        element: <Tasknest></Tasknest>
    }
])

export default router;