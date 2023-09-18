import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import axios from "axios";
import CheckRoles from "../CheckRoles";
import NavigationSelector from "../Scripts/NavigationSelector";
import ServerAvailability from "../Scripts/ServerAvailability";

const OrderSuccess = ({ handleLogout }) => {
  const [orderData, setOrderData] = useState(null);
  const token = localStorage.getItem("token");
  const [, setLoading] = useState(true)

  useEffect(() => {
    localStorage.removeItem("cartItems");
    const fetchOrderData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_DEV_SERVER}/api/orders`);
        const orders = response.data.data.filter(
          (order) => order.userToken === token
        );
        setOrderData(orders);
        setLoading(false)
      } catch (error) {
        console.error("Error fetching order data:", error);
        setLoading(false)
      }
    };

    if (token) {
      fetchOrderData();
    }
  }, [token]);

  if (!orderData && token) {
    return <p>Loading...</p>
  }

  return (
    <div className={styles.order_realize_container}>
      <div>
        <ServerAvailability>
        </ServerAvailability>
      </div>
      <CheckRoles>
        {(details) => (
          <NavigationSelector
            details={details}
            cartItemCount={"Zamówiono"}
            handleLogout={handleLogout}
            token={localStorage.getItem("token")}
          />
        )}
      </CheckRoles>
      {!orderData && (
        <h2 className={styles.centered}>Dziękujemy za złożenie zamówienia!<br />Dostarczymy je do Ciebie tak szybko jak to jest możliwe.<br />Aby w przyszłości otrzymywać więcej szczegółów o zamówieniu zalecamy rejestracje.</h2>
      )}
      {orderData && (
        <>
          <h2>Dziękujemy za złożenie zamówienia!</h2>
          {orderData.slice().reverse().map((order) => (
            <div key={order._id}>
              <p className={styles.order_number}>Numer zamówienia: {order.orderId}</p>
              <p
                className={`${styles.status} ${order.status === "Zamówiono"
                  ? styles.status_ordered
                  : styles.status_completed
                  }`}
              >
                Status: {order.status}
              </p>
              <p className={styles.order_table}>Stolik: {order.tableNumber}</p>
              <p className={styles.order_date}>
                Data: {new Date(order.orderDate).toLocaleString()}
              </p>
              <table className={styles.order_summary_table}>
                <thead>
                  <tr>
                    <th>Jedzonko</th>
                    <th>Ilość</th>
                    <th>Cena</th>
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
                    <td colSpan="2">Całkowita cena:</td>
                    <td>{order.totalPrice} zł</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default OrderSuccess;
