import { Route, Routes, Navigate } from "react-router-dom"
import Main from "./components/Main"
import Signup from "./components/Signup"
import Login from "./components/Login"
import Cart from "./components/Cart"
import AccountSettings from "./components/AccountSettings"
import OrderRealize from "./components/OrderRealize"
import OrderSuccess from "./components/OrderSuccess"
import WaiterPanel from "./components/WaiterPanel"
import axios from "axios"
import React, { useState, useEffect } from "react";

function App() {
    const user = localStorage.getItem("token")
    



    return (
        <Routes>
            {user && <Route path="/" exact element={<Main />} />}
            <Route path="/signup" exact element={<Signup />} />
            <Route path="/login" exact element={<Login />} />
            {user && <Route path="/cart" exact element={<Cart />} />}
             {user && <Route path="/account-settings" exact element={<AccountSettings />} />}
             {user && <Route path="/reservation" exact element={<Cart />} />}
             {user && <Route path="/permisions" exact element={<Cart />} />}
             {user && <Route path="/order-realize" exact element={<OrderRealize />} />}
             {user && <Route path="/order-success" exact element={<OrderSuccess />} />}
             {<Route path="/waiter-panel" element={<WaiterPanel />} />}
            <Route path="/" element={<Navigate replace to="/login" />} />
            <Route path="/cart" element={<Navigate replace to="/login" />} />
            <Route path="/account-settings" element={<Navigate replace to="/login" />} />
            <Route path="/reservation" element={<Navigate replace to="/login" />} />
            <Route path="/permisions" element={<Navigate replace to="/login" />} />
            <Route path="/order-realize" element={<Navigate replace to="/login" />} />
            <Route path="/order-success" element={<Navigate replace to="/login" />} />
            <Route path="/waiter-panel" element={<Navigate replace to="/login" />} />
            
            
        </Routes>
    )
}
export default App