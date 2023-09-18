import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import axios from "axios"
import { loadCartItemsFromLocalStorage, saveCartItemsToLocalStorage } from "../Scripts/localStorage";
import { calculateTotalPrice } from "../Scripts/calculateTotalPrice";
import { useNavigate } from "react-router-dom";
import CheckRoles from "../CheckRoles";
import NavigationSelector from "../Scripts/NavigationSelector";
import { loadStripe } from '@stripe/stripe-js';
import ServerAvailability from "../Scripts/ServerAvailability";
const stripePromise = loadStripe('pk_test_51NUCO4CTvIeCfZ48NcnZga4vVwWBjMV21jqsmPWuBgc9i6CSHUQIfC3hIgjBrdOiu5uMosaLlwmEhQzrWPEAdqYZ00NcG5v8jk');


const OrderRealize = ({ handleLogout }) => {
  const [tableNumber, setTableNumber] = useState(0);
  const [comments, setComments] = useState("");
  const [emailAddress, setEmailAddress] = useState("")
  const [orderTime] = useState("40min");
  const [cartItems, setCartItems] = useState([]);
  const totalPrice = calculateTotalPrice(cartItems);
  const token = localStorage.getItem("token")
  const [isTableNumberValid, setTableNumberValid] = useState(true);
  const [tableNumberErrorMessage, setTableNumberErrorMessage] = useState("");
  const [, setError] = useState("")
  const [checkedToken, setCheckedToken] = useState("")
  const storedEmail = localStorage.getItem("email");

  const navigate = useNavigate()
  useEffect(() => {
    loadCartItemsFromLocalStorage(setCartItems);

    if (token && storedEmail) {
      setEmailAddress(storedEmail);
    }
  }, [token])

  useEffect(() => {
    saveCartItemsToLocalStorage(cartItems);
    if (!token) {
      setCheckedToken("Użytkownik niezalogowany")
    } else {
      setCheckedToken(token)
    }
  }, [cartItems, token]);

  const handleTableNumberChange = (event) => {
    const value = event.target.value;
    const isValid = !isNaN(value) && value !== "" && parseInt(value) >= 0;
    setTableNumber(value);
    setTableNumberValid(isValid);
    if (!isValid) {
      setTableNumberErrorMessage("Please enter a valid table number.");
    } else {
      setTableNumberErrorMessage("");
    }
  };

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
    if (tableNumber <= 0) {
      setTableNumberErrorMessage("Please enter a valid table number.");
      return;
    }
    console.log(" " + JSON.stringify(mealsData))
    console.log(token)

    try {
      const url = `${process.env.REACT_APP_DEV_SERVER}/api/orders`;
      const data = {
        tableNumber,
        comments,
        meals: mealsData,
        totalPrice,
        userToken: checkedToken,
        userEmail: emailAddress,
        orderRate: 0,
        status: "Zamówiono",
        paymentStatus: "Platne przy odbiorze"
      };

      await axios.post(url, data);

      console.log("Order created successfully");

      localStorage.removeItem("cartItems")
      navigate("/order-success")


    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        console.log("Validation error details:", error.response.data.message);
        setError(error.response.data.message);

      } else {
        console.log("Error creating order:", error);
        setError("An error occurred while creating the order.");
      }
    }
  };

  const handlePayment = async () => {
    if (tableNumber <= 0) {
      setTableNumberErrorMessage("Please enter a valid table number.");
      return;
    }
    try {
      const stripe = await stripePromise;
      const mealsData = cartItems.map((item) => ({
        name: item.productName,
        quantity: item.quantity,
        price: item.productPrice,
      }));
      const response = await axios.post(`${process.env.REACT_APP_DEV_SERVER}/api/payment`, { tableNumber, comments, meals: mealsData, totalPrice, userToken: checkedToken, userEmail: emailAddress });
      const { url } = response.data;
      const session = await stripe.redirectToCheckout({
        sessionId: url,
      });

      if (session.error) {
        console.error("Błąd podczas przekierowania do płatności:", session.error.message);
      } else {
        const email = token ? email : emailAddress
        const orderData = {
          tableNumber,
          comments,
          meals: mealsData,
          totalPrice,
          userToken: checkedToken,
          userEmail: emailAddress,
          orderRate: 0,
          status: "Zamówiono",
          paymentStatus: "Oplacone"
        }
        const url = `${process.env.REACT_APP_DEV_SERVER}/api/orders`;
        await axios.post(url, orderData);
        console.log("Order created successfully");

        navigate("/order-success");
      }
    } catch (error) {
      console.error("Błąd podczas tworzenia sesji płatności:", error);
    }
  };


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
            cartItems={cartItems}
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
      <form onSubmit={handleSubmit}>
        <div className={styles.form_group}>
          {!isTableNumberValid && (
            <p className={styles.error_message}>{tableNumberErrorMessage}</p>
          )}
          <label htmlFor="tableNumber">Number stolika:</label>
          <input
            type="text"
            id="tableNumber"
            value={tableNumber}
            onChange={handleTableNumberChange}
            className={`${styles.input} ${isTableNumberValid ? "" : styles.invalid}`}
          />
        </div>

        {(
          <div className={styles.guestData}
            hidden={storedEmail}>
            <label htmlFor="email">Podaj maila:</label>
            <input
              type="text"
              id="email"
              value={emailAddress}
              onChange={handleEmailChange}
              className={styles.input}
            />

          </div>
        )}

        <div className={styles.form_group}>
          <label htmlFor="comments">Dodatkowe komentarze:</label>
          <textarea
            id="comments"
            value={comments}
            onChange={handleCommentsChange}
          ></textarea>
        </div>

        <div className={styles.form_group}>
          <label>Czas zamówienia:</label>
          <p>{orderTime}</p>

        </div>

        <div className={styles.form_group}>
          <button type="submit">Płacę przy odbiorze!</button>
        </div>
        <div className={styles.form_group}>
          <button type="button"
            onClick={handlePayment}
            hidden={totalPrice === "0.00"}>
            Płacę online!
          </button>
        </div>
      </form>


    </div>
  );
};

export default OrderRealize;
