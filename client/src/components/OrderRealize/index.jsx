import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import axios from "axios";
import {
  loadCartItemsFromLocalStorage,
  saveCartItemsToLocalStorage,
} from "../Scripts/localStorage";
import { calculateTotalPrice } from "../Scripts/calculateTotalPrice";
import { useNavigate } from "react-router-dom";
import CheckRoles from "../CheckRoles";
import NavigationSelector from "../Scripts/NavigationSelector";
import { loadStripe } from "@stripe/stripe-js";
import ServerAvailability from "../Scripts/ServerAvailability";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowPointer } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";

const stripePromise = loadStripe(
  "pk_test_51NUCO4CTvIeCfZ48NcnZga4vVwWBjMV21jqsmPWuBgc9i6CSHUQIfC3hIgjBrdOiu5uMosaLlwmEhQzrWPEAdqYZ00NcG5v8jk"
);

const OrderRealize = ({ handleLogout }) => {
  const [comments, setComments] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [orderTime] = useState("40min");
  const [cartItems, setCartItems] = useState([]);
  const totalPrice = calculateTotalPrice(cartItems);
  const token = localStorage.getItem("token");
  const [isTableNumberValid, setTableNumberValid] = useState(true);
  const [tableNumberErrorMessage, setTableNumberErrorMessage] = useState("");
  const [, setError] = useState("");
  const [checkedToken, setCheckedToken] = useState("");
  const storedEmail = localStorage.getItem("email");
  const [selectedTable, setSelectedTable] = useState(null);
  const [chooseTableModal, setChooseTableModal] = useState(false);
  const [tables, setTables] = useState(null);

  const navigate = useNavigate();
  useEffect(() => {
    loadCartItemsFromLocalStorage(setCartItems);

    if (token && storedEmail) {
      setEmailAddress(storedEmail);
    }
  }, [token]);

  useEffect(() => {
    saveCartItemsToLocalStorage(cartItems);
    if (!token) {
      setCheckedToken("Użytkownik niezalogowany");
    } else {
      setCheckedToken(token);
    }
  }, [cartItems, token]);

  const handleCommentsChange = (event) => {
    setComments(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmailAddress(event.target.value);
  };

  const mealsData = cartItems.map((item) => ({
    name: item.productName,
    quantity: item.quantity,
    price: item.productPrice + " zł",
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(" " + JSON.stringify(mealsData));
    console.log(token);

    try {
      const url = `${process.env.REACT_APP_DEV_SERVER}/api/orders`;
      const data = {
        tableNumber: selectedTable,
        comments,
        meals: mealsData,
        totalPrice,
        userToken: checkedToken,
        userEmail: emailAddress,
        orderRate: 0,
        status: "Zamówiono",
        paymentStatus: "Platne przy odbiorze",
      };

      await axios.post(url, data);

      console.log("Order created successfully");

      localStorage.removeItem("cartItems");
      navigate("/order-success");
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.log("Validation error details:", error.response.data.message);
        setError(error.response.data.message);
      } else {
        console.log("Error creating order:", error);
        setError("An error occurred while creating the order.");
      }
    }
  };

  const handlePayment = async () => {
    try {
      const stripe = await stripePromise;
      const mealsData = cartItems.map((item) => ({
        name: item.productName,
        quantity: item.quantity,
        price: item.productPrice,
      }));
      const response = await axios.post(
        `${process.env.REACT_APP_DEV_SERVER}/api/payment`,
        {
          tableNumber: selectedTable,
          comments,
          meals: mealsData,
          totalPrice,
          userToken: checkedToken,
          userEmail: emailAddress,
        }
      );
      const { url } = response.data;
      const session = await stripe.redirectToCheckout({
        sessionId: url,
      });

      if (session.error) {
        console.error(
          "Błąd podczas przekierowania do płatności:",
          session.error.message
        );
      } else {
        const email = token ? email : emailAddress;
        const orderData = {
          selectedTable,
          comments,
          meals: mealsData,
          totalPrice,
          userToken: checkedToken,
          userEmail: emailAddress,
          orderRate: 0,
          status: "Zamówiono",
          paymentStatus: "Rozpoczęto płatność online",
        };
        const url = `${process.env.REACT_APP_DEV_SERVER}/api/orders`;
        await axios.post(url, orderData);
        console.log("Order created successfully");

        navigate("/order-success");
      }
    } catch (error) {
      console.error("Błąd podczas tworzenia sesji płatności:", error);
    }
  };

  const fetchTables = async () => {
    try {
      const url = `${process.env.REACT_APP_DEV_SERVER}/api/tables`;
      const response = await axios.get(url);
      const tables = response.data.data;
      setTables(tables);
    } catch (error) {
      console.error("Error fetching tables: ", error);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  return (
    <div className={styles.order_realize_container}>
      <div>
        <ServerAvailability></ServerAvailability>
      </div>
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
      <h3>Podsumowanie zamówienia</h3>
      {cartItems.length === 0 ? (
        <p>Najpierw dodaj coś do koszyka! :D</p>
      ) : (
        <table className={styles.order_summary_table}>
          <thead>
            <tr>
              <th>Jedzonko</th>
              <th>Ilość</th>
              <th>Cena</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item._id}>
                <td>{item.productName}</td>
                <td>{item.quantity}</td>
                <td>{item.productPrice + "zł"}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="2">Całkowita cena:</td>
              <td>{totalPrice} zł</td>
            </tr>
          </tfoot>
        </table>
      )}

      <div className={styles.form_group}>
        {!isTableNumberValid && (
          <p className={styles.error_message}>{tableNumberErrorMessage}</p>
        )}
        {!selectedTable ? (
          <div className={styles.table_choose_container}>
            <label>Wybierz stolik:</label>
            <button
              className={styles.table_choose}
              onClick={() => {
                setChooseTableModal(true);
              }}
            >
              <FontAwesomeIcon
                icon={faArrowPointer}
                size="xl"
                style={{ color: "#ffffff" }}
              />
            </button>
          </div>
        ) : (
          <div className={styles.table_choose_container}>
            <label>Wybrano stolik: {selectedTable}</label>
          </div>
        )}
      </div>
      <div className={styles.guestData} hidden={storedEmail}>
        <label htmlFor="email">Podaj maila:</label>
        <input
          type="text"
          id="email"
          value={emailAddress}
          onChange={handleEmailChange}
          className={styles.input}
        />
      </div>

      <div className={styles.guestData}>
        <label htmlFor="comments">Dodatkowe komentarze:</label>
        <input
          type="text"
          id="comments"
          value={comments}
          onChange={handleCommentsChange}
          className={styles.input}
        ></input>
      </div>

      <div className={styles.form_group}>
        <button className={styles.btn_submit} onClick={handleSubmit}>
          Płacę przy odbiorze!
        </button>
      </div>
      <div className={styles.form_group}>
        <button
          className={styles.btn_payment}
          onClick={handlePayment}
          hidden={totalPrice === "0.00"}
        >
          Płacę online!
        </button>
      </div>
      <Modal
        isOpen={chooseTableModal}
        onRequestClose={() => setChooseTableModal(false)}
        className={styles.modal_choose_table}
        overlayClassName={styles.overlay_choose_table}
      >
        <h2>Wybierz stolik</h2>
        <div className={styles.map}>
          {tables
            ? tables.map((table) => (
                <div
                  key={table._id}
                  className={
                    table.tableStatus === "Zajęty"
                      ? styles.table_occupied
                      : styles.table
                  }
                  style={{
                    left: `${table.x}px`,
                    top: `${table.y}px`,
                  }}
                  onClick={() => {
                    setSelectedTable(table.tableNumber);
                    setChooseTableModal(false);
                  }}
                  title={"Liczba miejsc " + table.tableCapacity}
                >
                  {table.tableNumber}
                </div>
              ))
            : null}
        </div>

        <button
          className={styles.btn_close}
          onClick={() => setChooseTableModal(false)}
        >
          Anuluj
        </button>
      </Modal>
    </div>
  );
};

export default OrderRealize;
