import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import Navigation from "../Navigation";
import axios from "axios";
import NavigationForAdmin from "../NavigationForAdmin";
import CheckRoles from "../CheckRoles";
import { loadCartItemsFromLocalStorage, saveCartItemsToLocalStorage } from "../Scripts/localStorage";

const MyOrders = ({ handleLogout }) => {
  const [orderData, setOrderData] = useState(null);
  const email = localStorage.getItem("email");
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    loadCartItemsFromLocalStorage(setCartItems);
  }, []);

  useEffect(() => {
    saveCartItemsToLocalStorage(cartItems);
  }, [cartItems]);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/orders");
        const orders = response.data.data.filter((order) => order.userEmail === email);
        setOrderData(orders);
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };

    fetchOrderData();
  }, [email]);

  if (!orderData) {
    return <p>Loading...</p>;
  }

  const reversedOrderData = orderData.slice().reverse();

  return (
    <div className={styles.order_realize_container}>
      <CheckRoles>
        {(details) => {
          if (details && details.roles === "Admin") {
            return <NavigationForAdmin handleLogout={handleLogout} />;
          } else {
            return <Navigation cartItemCount={cartItems.length} handleLogout={handleLogout} />;
          }
        }}
      </CheckRoles>
      <h2>Wszystkie Twoje zamówienia</h2>
      <div className={styles.order_container}>
        <table className={styles.order_summary_table}>
          <thead>
            <tr>
              <th>Order number</th>
              <th>Date</th>
              <th>Status</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {reversedOrderData.map((order) => (
              <tr key={order.orderId}>
                <td>{order.orderId}</td>
                <td>{new Date(order.orderDate).toLocaleString()}</td>
                <td>
                  <span
                    className={`${styles.status} ${
                      order.status === "Zamowiono" ? styles.status_ordered : styles.status_completed
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td>{order.totalPrice + "zł"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyOrders;
