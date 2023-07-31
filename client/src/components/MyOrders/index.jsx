import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import Navigation from "../Navigation";
import axios from "axios";
import NavigationForAdmin from "../NavigationForAdmin";
import CheckRoles from "../CheckRoles";
import { loadCartItemsFromLocalStorage, saveCartItemsToLocalStorage } from "../Scripts/localStorage";
import Modal from "react-modal";

Modal.setAppElement("#root");

const MyOrders = ({ handleLogout }) => {
  const [orderData, setOrderData] = useState(null);
  const email = localStorage.getItem("email");
  const [cartItems, setCartItems] = useState([]);
  const [ratings, setRatings] = useState({});
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const [comments, setComments] = useState("");

 
  useEffect(() => {
    loadCartItemsFromLocalStorage(setCartItems);
  }, []);

  useEffect(() => {
    saveCartItemsToLocalStorage(cartItems);
  }, [cartItems]);

  const fetchOrderData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/orders");
      const orders = response.data.data.filter((order) => order.userEmail === email);
      setOrderData(orders);

      const initialRatings = {};
      orders.forEach((order) => {
        initialRatings[order.orderId] = order.orderRate;
      });
      setRatings(initialRatings);
    } catch (error) {
      console.error("Error fetching order data:", error);
    }
  };

  useEffect(() => {
    fetchOrderData();
  }, [email]);

  if (!orderData) {
    return <p>Loading...</p>;
  }

  const reversedOrderData = orderData.slice().reverse();

  const handleRateChange = async (orderId, rating) => {
    try {
      await axios.put(
        `http://localhost:8080/api/orders/${orderId}`,
        { orderRate: rating }
      )
      fetchOrderData()
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  }

  const handleRateOrder = (orderId, rating) => {
    if (!ratings[orderId] && orderData.find((order) => order.orderId === orderId).status == "Zamowienie dostarczone") {

      setRatings((prevRatings) => ({
        ...prevRatings,
        [orderId]: rating,
      }))

      handleRateChange(orderId, rating)

      console.log(rating, orderId);
    }
  }

  const handleCommentsChange = (event) => {
    setComments(event.target.value);
  };


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
              <th>Numer zamówienia</th>
              <th>Czas</th>
              <th>Status</th>
              <th>Cena</th>
              <th>Oceń!</th>
              <th>Zmień coś!</th>
            </tr>
          </thead>
          <tbody>
            {reversedOrderData.map((order) => (
              <tr key={order.orderId}>
                <td>{order.orderId}</td>
                <td>{new Date(order.orderDate).toLocaleString()}</td>
                <td>
                  <span
                    className={`${styles.status} ${order.status === "Zamówiono" ? styles.status_ordered : styles.status_completed
                      }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td>{order.totalPrice + "zł"}</td>
                <td>
                  <div className={styles.rating}>
                    {[0, 1, 2, 3, 4, 5].map((rating) => (
                      <span
                        key={rating}
                        className={`${styles.star} ${ratings[order.orderId] >= rating && ratings[order.orderId] > 0 ? styles.selected : ""}`}
                        onClick={() => handleRateOrder(order.orderId, rating)}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  {order.status === "Zamówiono" ? (
                    <button className={styles.btn_edit} onClick={() => setSelectedOrderId(order.orderId)}>
                      Edytuj
                    </button>
                  ) : (
                    <button disabled className={styles.btn_disabled}>
                      Niedostępne
                    </button>
                  )}

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
        isOpen={selectedOrderId !== null}
        onRequestClose={() => setSelectedOrderId(null)}
        contentLabel="Edycja zamówienia"
        className={styles.modal_content}
        overlayClassName={styles.modal_overlay}
      >
        <h2>Chcesz coś zmienić w zamówieniu {selectedOrderId}? Pisz!</h2>
        <label htmlFor="comments">Dodatkowe komentarze:</label>
          <textarea
            id="comments"
            value={comments}
            onChange={handleCommentsChange}
          ></textarea>
        <button onClick={() => setSelectedOrderId(null)}>Zamknij</button>
        <button onClick={() => setSelectedOrderId(null)}>Prześlij</button>
      </Modal>
    </div>
  );
};

export default MyOrders;
