
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom"
import { onAuthStateChanged } from "firebase/auth"
import Login from "./components/auth/Login"
import SignUp from "./components/auth/SignUp"
import ResetPassword from "./components/auth/Resetpassword"
import SetNewPassword from "./components/auth/Setnewpassword"
import Home from "./components/ui/app/Home"
import { useState, useEffect, useMemo } from "react"
import { auth } from "./firebase"
import VideoCall from "./components/video/VideoCall"
import Layout from "./components/ui/common/layout/Layout"
import { Toaster } from "react-hot-toast"

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
        {
            path: "/", element: user ? <Layout /> : <Login />,
            children: [
                { index: true, element: <Home /> },
            ]
        },
        { path: "/signup", element: user ? <Navigate to="/" /> : <SignUp /> },
        { path: "/reset-password", element: user ? <Navigate to="/" /> : <ResetPassword /> },
        { path: "/set-new-password", element: user ? <Navigate to="/" /> : <SetNewPassword /> },
        { path: "/VideoCall/:meetingId", element: user ? <VideoCall /> : <Navigate to="/" /> },
        { path: "*", element: <Navigate to="/" /> },
    ]), [user])

    if (loading) return null

    return (
        <>
            <RouterProvider router={router} />
            <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
        </>
    )
}

export default App
