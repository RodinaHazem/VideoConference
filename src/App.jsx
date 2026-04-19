
import { createBrowserRouter,RouterProvider } from "react-router-dom"
import Login from "./components/auth/Login"
import SignUp from "./components/auth/SignUp"
import ResetPassword from "./components/auth/Resetpassword"


function App() {
    const router = createBrowserRouter([
        {path: "/", element: <Login/>},
        {path: "/signup", element: <SignUp/>},
        {path: "/reset-password", element: <ResetPassword/>},
    ])
    
    return <RouterProvider router={router} />


}

export default App
