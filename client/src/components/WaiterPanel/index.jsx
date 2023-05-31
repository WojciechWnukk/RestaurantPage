//panel kelnera z prostym GUI pokazujący numer
//zamówienia pokarmy numer stolika opcje 
//zmiany statusu zamówienia itp Dostęp tylko dla uprawnionych
// + drugi panel do zmieniania dostępności zamówienia
import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./styles.module.css";

const WaiterPanel = () => {
  const [orders, setOrders] = useState([]);
  const [showAllOrders, setShowAllOrders] = useState(true);


  useEffect(() => {
    fetchOrders();
  }, [showAllOrders]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/orders"); // Zmień URL na odpowiedni
      const filteredOrders = response.data.data.filter(order => showAllOrders || order.status !== "Zamowienie dostarczone");
      setOrders(filteredOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:8080/api/orders/${orderId}`, { status: newStatus }); // Zmień URL na odpowiedni
      fetchOrders(); // Odśwież listę zamówień po zmianie statusu
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  }
  const toggleShowAllOrders = () => {
    setShowAllOrders(prevState => !prevState);
  }

  return (
    <div className={styles.waiter_panel_container}>
      <h2 className={styles.waiter_panel_title}>Waiter Panel</h2>
      <div className={styles.order_filter}>
        <button onClick={toggleShowAllOrders}>
          {showAllOrders ? "Show Undelivered Orders" : "Show All Orders"}
        </button>
      </div>
      {orders.map((order) => (
        <div key={order._id} className={styles.order_item}>
          <p className={styles.order_number}>Order Number: {order.orderId}</p>
          <p className={`${styles.status} ${order.status === "Przygotowanie zamowienia" ? styles.status_ordered : styles.status_inprogress}`}>Status: {order.status}</p>
          <p className={styles.order_table}>Table: {order.tableNumber}</p>
          <p className={styles.order_meals}>
            Meals:{" "}
            {order.meals.map((meal) => (
              <span key={meal._id}>{meal.name}   </span>
            ))}
          </p>          <p className={styles.order_date}>Date: {new Date(order.orderDate).toLocaleString()}</p>
          <select
            className={styles.status_select}
            value={order.status}
            onChange={(e) => handleStatusChange(order._id, e.target.value)}
          >
            <option value="Zamowienie zlozone">Zamówienie złożone</option>
            <option value="Przygotowanie zamowienia">Przygotowanie zamówienia</option>
            <option value="Zamowienie dostarczone">Zamówienie dostarczone</option>
          </select>
        </div>
      ))}
    </div>
  );
};

export default WaiterPanel;
