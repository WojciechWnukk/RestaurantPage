import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import Navigation from "../Navigation";
import axios from "axios";
import NavigationForAdmin from "../NavigationForAdmin";
import CheckRoles from "../CheckRoles";
import { loadCartItemsFromLocalStorage } from "../Scripts/localStorage";
import Modal from "react-modal";
import ServerAvailability from "../Scripts/ServerAvailability";

//Modal.setAppElement("#root");

const MyOrders = ({ handleLogout }) => {
  const [orderData, setOrderData] = useState(null);
  const email = localStorage.getItem("email");
  const [cartItems, setCartItems] = useState([]);
  const [ratings, setRatings] = useState({});
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [modify, setModify] = useState("");
  const [showPointsModal, setShowPointsModal] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  useEffect(() => {
    loadCartItemsFromLocalStorage(setCartItems);
  }, []);

  const fetchOrderData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DEV_SERVER}/api/orders`
      );
      const orders = response.data.data.filter(
        (order) => order.userEmail === email
      );
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
        `${process.env.REACT_APP_DEV_SERVER}/api/orders/${orderId}`,
        { orderRate: rating }
      );

      //pobieranie danych o zalogowanym użytkowniku oraz dodawanie mu punktów o wartości 10% wartości zamówienia
      putPoints(orderId);

      fetchOrderData();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleRateOrder = (orderId, rating) => {
    if (
      !ratings[orderId] &&
      orderData.find((order) => order.orderId === orderId).status ===
        "Zamowienie dostarczone"
    ) {
      setRatings((prevRatings) => ({
        ...prevRatings,
        [orderId]: rating,
      }));

      handleRateChange(orderId, rating);

      console.log(rating, orderId);
    }
  };

  const handleModifyChange = (event) => {
    setModify(event.target.value);
  };

  const modifyOrder = async (orderId, newModify) => {
    console.log("Wchodzi tu");
    try {
      await axios.put(
        `${process.env.REACT_APP_DEV_SERVER}/api/orders/${orderId}`,
        { modifyOrder: newModify }
      );
    } catch (error) {
      console.error("Error updating order comments:", error);
    }
  };

  const putPoints = async (orderId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DEV_SERVER}/api/orders/${orderId}`
      );
      const order = response.data.data;
      const user = await axios.get(
        `${process.env.REACT_APP_DEV_SERVER}/api/users/${email}`
      );
      console.log(user.data.data);
      const points = Math.floor(order.totalPrice * 10);
      const newPoints = user.data.data.points + points;
      console.log("Po ocenie ", newPoints);
      console.log("Za zamowienie ", points);
      await axios.put(
        `${process.env.REACT_APP_DEV_SERVER}/api/users/points/${email}`,
        { points: newPoints }
      );
      showPointsCongratulations(points);
    } catch (error) {
      console.error("Error updating user points:", error);
    }
  };

  const showPointsCongratulations = (points) => {
    setEarnedPoints(points);
    setShowPointsModal(true);
  };

  return (
    <div className={styles.order_realize_container}>
      <div>
        <ServerAvailability></ServerAvailability>
      </div>
      <CheckRoles>
        {(details) => {
          if (details && details.roles === "Admin") {
            return (
              <NavigationForAdmin
                handleLogout={handleLogout}
                quantity={cartItems.reduce(
                  (acc, item) => acc + item.quantity,
                  0
                )}
              />
            );
          } else {
            return (
              <Navigation
                handleLogout={handleLogout}
                quantity={cartItems.reduce(
                  (acc, item) => acc + item.quantity,
                  0
                )}
              />
            );
          }
        }}
      </CheckRoles>
      <h2>Wszystkie Twoje zamówienia {email}</h2>
      <div className={styles.order_container}>
        <table className={styles.order_summary_table}>
          <thead>
            <tr>
              <th>Numer zamówienia</th>
              <th>Czas</th>
              <th>Status</th>
              <th>Cena</th>
              <th>Oceń i otrzymaj punkty!</th>
              <th>Zmień coś!</th>
              <th>Szczegóły zamówienia</th>
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
                      order.status === "Zamówiono"
                        ? styles.status_ordered
                        : styles.status_completed
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
                        className={`${styles.star} ${
                          ratings[order.orderId] >= rating &&
                          ratings[order.orderId] > 0
                            ? styles.selected
                            : ""
                        }`}
                        onClick={() => handleRateOrder(order.orderId, rating)}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  {order.status === "Zamówiono" ? (
                    <button
                      className={styles.btn_edit}
                      onClick={() => setSelectedOrderId(order.orderId)}
                    >
                      Edytuj
                    </button>
                  ) : (
                    <button disabled className={styles.btn_disabled}>
                      Niedostępne
                    </button>
                  )}
                </td>
                <td>
                  <button
                    className={styles.btn_edit}
                    onClick={() => setSelectedOrderDetails(order.orderId)}
                  >
                    Szczegóły
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
        isOpen={selectedOrderId !== null}
        onRequestClose={() => {
          setSelectedOrderId(null);
          setModify("");
        }}
        contentLabel="Edycja zamówienia"
        className={styles.modal_content}
        overlayClassName={styles.modal_overlay}
      >
        <h2>
          Chcesz coś zmienić w zamówieniu? <br></br>Pisz!
        </h2>
        <label htmlFor="comments">Dodatkowe komentarze:</label>
        <textarea
          id="comments"
          value={modify}
          onChange={handleModifyChange}
        ></textarea>
        <button
          className={styles.btn_close}
          onClick={() => {
            setSelectedOrderId(null);
            setModify("");
          }}
        >
          Zamknij
        </button>
        <button
          className={styles.btn_send}
          onClick={() => {
            setSelectedOrderId(null);
            modifyOrder(selectedOrderId, modify);
          }}
        >
          Prześlij
        </button>
      </Modal>

      {/*Modal z gratulacjami za ocenę zamówienia*/}
      <Modal
        isOpen={showPointsModal}
        onRequestClose={() => setShowPointsModal(false)}
        contentLabel="Gratulacje!"
        className={styles.modal_content}
        overlayClassName={styles.modal_overlay}
      >
        <h2>Gratulacje! Otrzymujesz {earnedPoints} punktów!</h2>
        <button
          className={styles.btn_close_points}
          onClick={() => setShowPointsModal(false)}
        >
          Zamknij
        </button>
      </Modal>

      {/*Modal z szczegółami zamówienia*/}
      <Modal
        isOpen={selectedOrderDetails !== null}
        onRequestClose={() => {
          setSelectedOrderDetails(null);
        }}
        contentLabel="Szczegóły zamówienia"
        className={styles.modal_content}
        overlayClassName={styles.modal_overlay}
      >
        <h2>Szczegóły zamówienia {selectedOrderDetails}</h2>
        <table className={styles.order_details_table}>
          <thead>
            <tr>
              <th>Nazwa</th>
              <th>Ilość</th>
              <th>Cena</th>
            </tr>
          </thead>
          <tbody>
            {reversedOrderData.map((order) =>
              order.orderId === selectedOrderDetails
                ? order.meals.map((meal) => (
                    <tr key={meal._id}>
                      <td>{meal.name}</td>
                      <td>{meal.quantity}</td>
                      <td>{meal.price}</td>
                    </tr>
                  ))
                : null
            )}
          </tbody>
        </table>
        <button
          className={styles.btn_close}
          onClick={() => {
            setSelectedOrderDetails(null);
          }}
        >
          Zamknij
        </button>
      </Modal>
    </div>
  );
};

export default MyOrders;
