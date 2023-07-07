import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import Navigation from "../Navigation";
import axios from "axios"
import { loadCartItemsFromLocalStorage, saveCartItemsToLocalStorage } from "../Scripts/localStorage";
import { calculateTotalPrice } from "../Scripts/calculateTotalPrice";
import { useNavigate } from "react-router-dom";
import NavigationForAdmin from "../NavigationForAdmin"
import CheckRoles from "../CheckRoles";
import NavigationSelector from "../Scripts/NavigationSelector";

const OrderRealize = ({ handleLogout }) => {
  const [tableNumber, setTableNumber] = useState(0);
  const [comments, setComments] = useState("");
  const [emailAddress, setEmailAddress] = useState("")
  const [orderTime, setOrderTime] = useState("40min");
  const [cartItems, setCartItems] = useState([]);
  const totalPrice = calculateTotalPrice(cartItems);
  const token = localStorage.getItem("token")
  const email = localStorage.getItem("email")
  const [isTableNumberValid, setTableNumberValid] = useState(true);
  const [tableNumberErrorMessage, setTableNumberErrorMessage] = useState("");
  const [error, setError] = useState("")
  const navigate = useNavigate()
  useEffect(() => {
    loadCartItemsFromLocalStorage(setCartItems);
  }, []);

  useEffect(() => {
    saveCartItemsToLocalStorage(cartItems);
  }, [cartItems]);

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
    name: item.name,
    quantity: item.quantity,
    price: item.price,
  }));



  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderNumber = 123
    if (tableNumber <= 0) {
      setTableNumberErrorMessage("Please enter a valid table number.");
      return;
    }
    console.log(" " + JSON.stringify(mealsData))
    console.log(token)
    
    try {
      const url = "http://localhost:8080/api/orders";

      const data = {
        //orderNumber,
        tableNumber,
        comments,
        meals: mealsData,
        totalPrice,
        userToken: String(null),
        userEmail: email,
        orderRate: 0,
        status: "Zamowiono"
      };

      const response = await axios.post(url, data);

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

  return (
    <div className={styles.order_realize_container}>
{
      }
      
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
      <h3>Order Summary</h3>
      {cartItems.length === 0 ? (
        <p>No items in the cart.</p>
      ) : (
        <table className={styles.order_summary_table}>
          <thead>
            <tr>
              <th>Meal Name</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{item.price}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="2">Total Price:</td>
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
          <label htmlFor="tableNumber">Table Number:</label>
          <input
            type="text"
            id="tableNumber"
            value={tableNumber}
            onChange={handleTableNumberChange}
            className={`${styles.input} ${isTableNumberValid ? "" : styles.invalid}`}
            />
        </div>

        {!token && (
          <div className={styles.guestData}>
              <label htmlFor="email">Email Address:</label>
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
          <label htmlFor="comments">Additional Comments:</label>
          <textarea
            id="comments"
            value={comments}
            onChange={handleCommentsChange}
          ></textarea>
        </div>

        <div className={styles.form_group}>
          <label>Order Time:</label>
          <p>{orderTime}</p>

        </div>

        <div className={styles.form_group}>
          <button type="submit">Submit</button>
        </div>
      </form>


    </div>
  );
};

export default OrderRealize;
