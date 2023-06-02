import React, { useState, useEffect } from "react";
import styles from "./styles.module.css"
import Navigation from "../Navigation";
import { Link } from "react-router-dom";
import { calculateTotalPrice } from "../Scripts/calculateTotalPrice";
import NavigationForAdmin from "../NavigationForAdmin"
import CheckRoles from "../CheckRoles";

const Cart = ({ handleLogout }) => {
  const [cartItems, setCartItems] = useState([]);
  console.log("Cart Items:", cartItems);
  const totalPrice = calculateTotalPrice(cartItems);


  useEffect(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);



  const removeFromCart = (itemId) => {
    const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedCartItems);
  };
/*
  const calculateTotalPrice = () => {
    const totalPrice = cartItems.reduce(
      (total, item) => total + parseFloat(item.price) * item.quantity,
      0
    );
    return totalPrice.toFixed(2);
  };*/


  return (
    <div className={styles.cart_container}>
{//<Navigation cartItemCount={cartItems.length} handleLogout={handleLogout} />
      }
      
      <CheckRoles>
        {(details) => {
          // Use the details to determine which navigation to render
          if (details && details.roles === "Admin") {
            return <NavigationForAdmin handleLogout={handleLogout} />;
          } else {
            return <Navigation cartItemCount={cartItems.length} handleLogout={handleLogout} />
          }
        }}
      </CheckRoles>
      <h2>Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className={styles.cart_items}>
          {cartItems.map((item) => (
            <div className={styles.cart_item} key={item.id}>
              <div className={styles.item_info}>
                <img src={item.image} alt={item.name} className={styles.item_image} />
                <div className={styles.item_details}>
                  <h3>{item.name}</h3>
                  <p>{item.price}</p>
                  <p>Quantity: {item.quantity}</p> { }
                </div>
              </div>
              <button
                className={styles.remove_btn}
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </button>
            </div>
          ))}

          <div className={styles.total_price}>
          <Link to="/order-realize" className={styles.link_btn}>
              Przejdź do podsumowania
            </Link>
            <h3>Total Price: {totalPrice + "zł"}</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;