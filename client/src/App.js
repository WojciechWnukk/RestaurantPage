import { Route, Routes, Navigate } from "react-router-dom"
import Main from "./components/Main"
import Signup from "./components/Signup"
import Login from "./components/Login"
import Cart from "./components/Cart"
import AccountSettings from "./components/AccountSettings"
import OrderRealize from "./components/OrderRealize"
import OrderSuccess from "./components/OrderSuccess"
import WaiterPanel from "./components/WaiterPanel"
import React from "react";
import MyOrders from "./components/MyOrders"
import UserPermissions from "./components/UserPermissions"
import AddEmployee from "./components/AddEmployee"
import Reservation from "./components/Reservation"
function App() {
    const user = localStorage.getItem("token")
    
    return (
        <Routes>
            {user && <Route path="/" exact element={<Main />} />}
            <Route path="/signup" exact element={<Signup />} />
            <Route path="/login" exact element={<Login />} />
            {user && <Route path="/cart" exact element={<Cart />} />}
             {user && <Route path="/account-settings" exact element={<AccountSettings />} />}
             {user && <Route path="/reservation" exact element={<Reservation />} />}
             {user && <Route path="/permisions" exact element={<Cart />} />}
             {user && <Route path="/order-realize" exact element={<OrderRealize />} />}
             {user && <Route path="/order-success" exact element={<OrderSuccess />} />}
             {user && <Route path="/my-orders" exact element={<MyOrders />} />}
             {<Route path="/waiter-panel" element={<WaiterPanel />} />}
             {<Route path="/user-permissions" element={<UserPermissions />} />}
             {<Route path="/add-employee" element={<AddEmployee />} />}
            <Route path="/" element={<Navigate replace to="/login" />} />
            <Route path="/cart" element={<Navigate replace to="/login" />} />
            <Route path="/account-settings" element={<Navigate replace to="/login" />} />
            <Route path="/reservation" element={<Navigate replace to="/login" />} />
            <Route path="/permisions" element={<Navigate replace to="/login" />} />
            <Route path="/order-realize" element={<Navigate replace to="/login" />} />
            <Route path="/order-success" element={<Navigate replace to="/login" />} />
            <Route path="/waiter-panel" element={<Navigate replace to="/login" />} />
            <Route path="/my-orders" element={<Navigate replace to="/login" />} />
            <Route path="/user-permissions" element={<Navigate replace to="/login" />} />
            <Route path="/add-employee" element={<Navigate replace to="/login" />} />

            
        </Routes>
    )
}
export default App