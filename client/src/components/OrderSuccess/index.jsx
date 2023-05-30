import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import Navigation from "../Navigation";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OrderSuccess = ({ handleLogout }) => {

  const [orderData, setOrderData] = useState(null);
  const token = localStorage.getItem("token")
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/orders"); // Zmień URL na odpowiedni
        const orders = response.data.data.filter(order => order.userToken === token);
        setOrderData(orders);
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };

    fetchOrderData();
  }, [token]);

  if (!orderData) {
    return <p>Loading...</p>;
  }

  const reversedOrderData = orderData.slice().reverse()

  return (
    <div className={styles.order_realize_container}>
      <Navigation cartItemCount={""} handleLogout={handleLogout} />
      <h2>Thank you for placing your order!</h2>
      {reversedOrderData.map((order) => (
        <div key={order._id}>
          <p className={styles.order_number}>Order Number: {order.orderId}</p>
          <p className={`${styles.status} ${order.status === "Zamowiono" ? styles.status_ordered : styles.status_completed}`}>Status: {order.status}</p>
          <p className={styles.order_table}>Table: {order.tableNumber}</p>
          <p className={styles.order_date}>Date: {new Date(order.orderDate).toLocaleString()}</p>
          <table className={styles.order_summary_table}>
            <thead>
              <tr>
                <th>Meal Name</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {order.meals.map((meal) => (
                <tr key={meal._id}>
                  <td>{meal.name}</td>
                  <td>{meal.quantity}</td>
                  <td>{meal.price}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="2">Total Price:</td>
                <td>{order.totalPrice} zł</td>
              </tr>
            </tfoot>
          </table>
        </div>
      ))}
    </div>
  );
};

export default OrderSuccess;
