import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./styles.module.css";
import CheckRoles from "../CheckRoles";
import NavigationSelector from "../Scripts/NavigationSelector";
import { loadCartItemsFromLocalStorage } from "../Scripts/localStorage";

const WaiterPanel = ({ handleLogout }) => {
  const [orders, setOrders] = useState([]);
  const [showAllOrders, setShowAllOrders] = useState(true);
  const [details, setDetails] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    loadCartItemsFromLocalStorage(setCartItems);
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DEV_SERVER}/api/orders`
      );
      const filteredOrders = response.data.data.filter(
        (order) => showAllOrders || order.status !== "Zamowienie dostarczone"
      );
      setOrders(filteredOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_DEV_SERVER}/api/orders/${orderId}`,
        { status: newStatus }
      );
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const toggleShowAllOrders = () => {
    setShowAllOrders((prevState) => !prevState);
  };

  const handleGetUserDetails = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const config = {
          method: "get",
          url: `${process.env.REACT_APP_DEV_SERVER}/api/users/user`,
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        };
        const { data: res } = await axios(config);
        setDetails(res.data);
        console.log(details.data);
      } catch (error) {
        if (
          error.response &&
          error.response.status >= 400 &&
          error.response.status <= 500
        ) {
          localStorage.removeItem("token");
          window.location.reload();
        }
      }
    }
  };
  useEffect(() => {
    fetchOrders();
    handleGetUserDetails();
  }, [showAllOrders]);

  if (!details || details.roles !== "Admin") {
    return <p>Brak uprawnień</p>;
  }

  return (
    <div className={styles.waiter_panel_container}>
      <CheckRoles>
        {(details) => (
          <NavigationSelector
            details={details}
            cartItems={cartItems}
            quantity={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
            handleLogout={handleLogout}
            token={localStorage.getItem("token")}
          />
        )}
      </CheckRoles>
      <div className={styles.waiter_panel}>
        <h2 className={styles.waiter_panel_title}>Panel kelnera</h2>
        <div className={styles.order_filter}>
          <button
            className={`${
              showAllOrders
                ? styles.order_filter_btn_on
                : styles.order_filter_btn_off
            }`}
            onClick={toggleShowAllOrders}
          >
            {showAllOrders ? "Pokaż niezrealizowane" : "Pokaż wszystkie"}
          </button>
        </div>
        {orders.map((order) => (
          <div key={order._id} className={styles.order_item}>
            <p className={styles.order_number}>
              Numer zamówienia: {order.orderId}
            </p>
            <p
              className={`${styles.status} ${
                order.status === "Przygotowanie zamowienia"
                  ? styles.status_ordered
                  : styles.status_inprogress
              }`}
            >
              Status: {order.status}
            </p>
            <p className={styles.order_table}>Email: {order.userEmail}</p>
            <p className={styles.order_table}>Stolik: {order.tableNumber}</p>
            <p className={styles.order_meals}>
              Zamówiono:{" "}
              {order.meals.map((meal) => (
                <span key={meal._id}>
                  {meal.name} {"(x"}
                  {meal.quantity}
                  {") "}{" "}
                </span>
              ))}
            </p>
            <p className={styles.order_table}>
              {order.comments ? "Komentarze: " + order.comments : ""}
            </p>
            <p className={styles.order_table}>
              {order.modifyOrder
                ? "Zmiany w zamówieniu: " + order.modifyOrder
                : ""}
            </p>
            <p className={styles.order_date}>
              Czas: {new Date(order.orderDate).toLocaleString()}
            </p>
            <p className={styles.order_table}>
              Płatność:{" "}
              {order.paymentStatus === "Oplacono"
                ? order.paymentStatus
                : order.totalPrice + " zł"}
            </p>
            <select
              className={styles.status_select}
              value={order.status}
              onChange={(e) => handleStatusChange(order._id, e.target.value)}
            >
              <option value="Zamowienie zlozone">Zamówienie złożone</option>
              <option value="Przygotowanie zamowienia">
                Przygotowanie zamówienia
              </option>
              <option value="Zamowienie dostarczone">
                Zamówienie dostarczone
              </option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WaiterPanel;
