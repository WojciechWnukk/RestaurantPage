import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import Navigation from "../Navigation";
import axios from "axios"
import { v4 as uuidv4 } from "uuid";
import { loadCartItemsFromLocalStorage, saveCartItemsToLocalStorage } from "../Scripts/localStorage";
import { calculateTotalPrice } from "../Scripts/calculateTotalPrice";

const OrderRealize = ({ handleLogout }) => {
  const [tableNumber, setTableNumber] = useState("");
  const [comments, setComments] = useState("");
  const [orderTime, setOrderTime] = useState("40min");
  const [cartItems, setCartItems] = useState([]);
  const totalPrice = calculateTotalPrice(cartItems);

  useEffect(() => {
    loadCartItemsFromLocalStorage(setCartItems);
  }, []);

  useEffect(() => {
    saveCartItemsToLocalStorage(cartItems);
  }, [cartItems]);

  const handleTableNumberChange = (event) => {
    setTableNumber(event.target.value);
  };

  const handleCommentsChange = (event) => {
    setComments(event.target.value);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderNumber = 123
    try {
      const url = "http://localhost:8080/api/orders";

      const data = {
        //orderNumber,
        tableNumber,
        comments,
        //meals,
        totalPrice,
        status: "Zamowiono"
      };

      const response = await axios.post(url, data);

      console.log("Order created successfully");
      // Dodać obsługę sukcesu, np. wyświetlenie komunikatu lub przekierowanie

    } catch (error) {
      console.error("Error creating order:", error);
      console.log(" numer " + orderNumber)
      // Dodać obsługę błędu, np. wyświetlenie komunikatu o błędzie
    }
  };

  return (
    <div className={styles.order_realize_container}>
      <Navigation cartItemCount={cartItems.length} handleLogout={handleLogout} />
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
          <label htmlFor="tableNumber">Table Number:</label>
          <input
            type="text"
            id="tableNumber"
            value={tableNumber}
            onChange={handleTableNumberChange}
          />
        </div>

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
