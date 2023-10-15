import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Main from "./components/Main";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Cart from "./components/Cart";
import AccountSettings from "./components/AccountSettings";
import OrderRealize from "./components/OrderRealize";
import OrderSuccess from "./components/OrderSuccess";
import WaiterPanel from "./components/WaiterPanel";
import React from "react";
import MyOrders from "./components/MyOrders";
import UserPermissions from "./components/UserPermissions";
import AddEmployee from "./components/AddEmployee";
import Reservation from "./components/Reservation";
import FoodPanel from "./components/FoodPanel";
import AddProduct from "./components/AddProduct";
//import UpdateProduct from "./components/UpdateProduct"
import Promotions from "./components/Promotions";
import Reports from "./components/Reports";
import TableMap from "./components/TableMap";

function App() {
  const user = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<Main />} />
        <Route path="/signup" exact element={<Signup />} />
        <Route path="/login" exact element={<Login />} />
        <Route path="/cart" exact element={<Cart />} />
        {user && (
          <Route path="/account-settings" exact element={<AccountSettings />} />
        )}
        <Route path="/reservation" exact element={<Reservation />} />
        <Route path="/order-realize" exact element={<OrderRealize />} />
        <Route path="/order-success" exact element={<OrderSuccess />} />
        {user && <Route path="/my-orders" exact element={<MyOrders />} />}
        {user && <Route path="/waiter-panel" element={<WaiterPanel />} />}
        {user && (
          <Route path="/user-permissions" element={<UserPermissions />} />
        )}
        {user && <Route path="/add-employee" element={<AddEmployee />} />}
        {user && <Route path="/food-panel" element={<FoodPanel />} />}
        {user && <Route path="/new-product" element={<AddProduct />} />}
        {/*user && <Route path="/update-product" element={<UpdateProduct />} />*/}
        {user && <Route path="/promotions" element={<Promotions />} />}
        {user && <Route path="/reports" element={<Reports />} />}
        {user && <Route path="/table-map" element={<TableMap />} />}

        <Route
          path="/account-settings"
          element={<Navigate replace to="/login" />}
        />
        <Route path="/reservation" element={<Navigate replace to="/login" />} />
        <Route
          path="/waiter-panel"
          element={<Navigate replace to="/login" />}
        />
        <Route path="/my-orders" element={<Navigate replace to="/login" />} />
        <Route
          path="/user-permissions"
          element={<Navigate replace to="/login" />}
        />
        <Route
          path="/add-employee"
          element={<Navigate replace to="/login" />}
        />
        <Route path="/food-panel" element={<Navigate replace to="/login" />} />
        <Route path="/new-product" element={<Navigate replace to="/login" />} />
        <Route
          path="/update-product"
          element={<Navigate replace to="/login" />}
        />
        <Route path="/promotions" element={<Navigate replace to="/login" />} />
        <Route path="/reports" element={<Navigate replace to="/login" />} />
        <Route path="/table-map" element={<Navigate replace to="/login" />} />
      </Routes>
    </Router>
  );
}
export default App;
