
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom"
import { onAuthStateChanged } from "firebase/auth"
import Login from "./components/auth/Login"
import SignUp from "./components/auth/SignUp"
import ResetPassword from "./components/auth/Resetpassword"
import SetNewPassword from "./components/auth/Setnewpassword"
import Home from "./components/ui/Home"
import { useState, useEffect, useMemo } from "react"
import { auth } from "./firebase"
import VideoCall from "./components/ui/VideoCall"


const App = () => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
            setLoading(false)
        })
        return () => unsubscribe()
    }, [])

    const router = useMemo(() => createBrowserRouter([
        { path: "/", element: user ? <Home /> : <Login /> },
        { path: "/signup", element: user ? <Navigate to="/" /> : <SignUp /> },
        { path: "/reset-password", element: user ? <Navigate to="/" /> : <ResetPassword /> },
        { path: "/set-new-password", element: user ? <Navigate to="/" /> : <SetNewPassword /> },
        { path: "/VideoCall", element: user ? <VideoCall /> : <Navigate to="/" /> },
        { path: "*", element: <Navigate to="/" /> },
    ]), [user])

    if (loading) return null

    return <RouterProvider router={router} />
}

export default App
