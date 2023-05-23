import { Route, Routes, Navigate } from "react-router-dom"
import Main from "./components/Main"
import Signup from "./components/Signup"
import Login from "./components/Login"
import Cart from "./components/Cart"
import AccountSettings from "./components/AccountSettings"

function App() {
    const user = localStorage.getItem("token")
    return (
        <Routes>
            {user && <Route path="/" exact element={<Main />} />}
            <Route path="/signup" exact element={<Signup />} />
            <Route path="/login" exact element={<Login />} />
            <Route path="/cart" exact element={<Cart />} />
            <Route path="/account-settings" exact element={<AccountSettings />} />
            <Route path="/reservation" exact element={<Cart />} />
            <Route path="/permisions" exact element={<Cart />} />
            <Route path="/" element={<Navigate replace to="/login" />} />
        </Routes>
    )
}
export default App