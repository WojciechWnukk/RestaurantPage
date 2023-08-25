import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./styles.module.css";

const WaiterPanel = () => {
  const [orders, setOrders] = useState([]);
  const [showAllOrders, setShowAllOrders] = useState(true);
  const [details, setDetails] = useState(null);




  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_DEV_SERVER}/api/orders`)
      const filteredOrders = response.data.data.filter(
        (order) =>
          showAllOrders || order.status !== "Zamowienie dostarczone"
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
      )
      fetchOrders()
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
        console.log(details.data)

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
/*
  const handlePoints = async (orderId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/orders/${orderId}`)
      const order = response.data.data;
      const userId = order.userId;
      const points = order.totalPrice;
      const config = {
        method: "post",
        url: `http://localhost:8080/api/users/${userId}/points`,
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          points: points,
        },
      };
      await axios(config);
    } catch (error) {
      console.error("Error updating user points:", error);
    }
  }

  //zrób funkcje w której sprawdzasz czy order.status === "Zamowienie dostarczone" i jeśli tak to wywołaj funkcje handlePoints(order._id), nie zapomnij o zabezpieczeniu aby nie wywoływać jej kilka razy dla tego samego zamówienia
  const handlePointsForOrder = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/orders")
      const filteredOrders = response.data.data.filter(
        (order) =>
          showAllOrders || order.status !== "Zamowienie dostarczone"
      );
      filteredOrders.forEach(order => {
        if (order.status === "Zamowienie dostarczone") {
          handlePoints(order._id)
        }
      })
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }

*/

  return (
    <div className={styles.waiter_panel_container}>
      <h2 className={styles.waiter_panel_title}>Panel kelnera</h2>
      <div className={styles.order_filter}>
        <button className={`${showAllOrders ? styles.order_filter_btn_on : styles.order_filter_btn_off}`} onClick={toggleShowAllOrders}>
          {showAllOrders ? "Pokaż niezrealizowane" : "Pokaż wszystkie"}
        </button>
      </div>
      {orders.map((order) => (
        <div key={order._id} className={styles.order_item}>
          <p className={styles.order_number}>Numer zamówienia: {order.orderId}</p>
          <p
            className={`${styles.status} ${order.status === "Przygotowanie zamowienia"
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
              <span key={meal._id}>{meal.name} {"(x"}{meal.quantity}{") "} </span>
            ))}
          </p>
          <p className={styles.order_table}>
              {order.comments ? "Komentarze: " + order.comments : ""}
          </p>
          <p className={styles.order_table}>
              {order.modifyOrder ? "Zmiany w zamówieniu: " + order.modifyOrder : ""}
          </p>
          <p className={styles.order_date}>
            Czas: {new Date(order.orderDate).toLocaleString()}
          </p>
          <p className={styles.order_table}>
              Płatność: {order.paymentStatus==="Oplacono" ? order.paymentStatus : order.totalPrice + " zł"}
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
  );
};

export default WaiterPanel;
