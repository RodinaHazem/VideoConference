
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom"
import { onAuthStateChanged } from "firebase/auth"
import Login from "./components/auth/Login"
import SignUp from "./components/auth/SignUp"
import ResetPassword from "./components/auth/Resetpassword"
import SetNewPassword from "./components/auth/Setnewpassword"
import Home from "./components/ui/Home"
import { useState, useEffect } from "react"
import { auth } from "./firebase"


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

    if (loading) return null  

    const router = createBrowserRouter([
        { path: "/", element: user ? <Home /> : <Login /> },
        { path: "/signup", element: user ? <Navigate to="/"  /> : <SignUp /> },
        { path: "/reset-password", element: user ? <Navigate to="/"/> : <ResetPassword /> },
        { path: "/set-new-password", element: user ? <Navigate to="/" /> : <SetNewPassword /> },
        { path: "*", element: <Navigate to="/" /> },
    ])

    return <RouterProvider router={router} />
}

export default App
