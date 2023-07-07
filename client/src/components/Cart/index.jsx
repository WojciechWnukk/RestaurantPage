import React, { useState, useEffect } from "react";
import styles from "./styles.module.css"
import { calculateTotalPrice } from "../Scripts/calculateTotalPrice";
import CheckRoles from "../CheckRoles";
import { useNavigate } from "react-router-dom";
import NavigationSelector from "../Scripts/NavigationSelector";

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
  
  const navigate1 = useNavigate();

  const handleNavigation = (path) => {
    navigate1(path);
  }
  const token = localStorage.getItem("token");

  return (
    <div className={styles.cart_container}>

      
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
          <h3 className={styles.total_price_label}>Total Price: {totalPrice + "zł"}</h3>
            <button className={styles.link_btn} onClick={() => handleNavigation("/order-realize")}>
              Przejdź do podsumowania
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;