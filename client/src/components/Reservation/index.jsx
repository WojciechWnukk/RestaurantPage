//Tutaj będzie kalendarz z terminami 
import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import CheckRoles from "../CheckRoles";
import { loadCartItemsFromLocalStorage, saveCartItemsToLocalStorage } from "../Scripts/localStorage";
import NavigationSelector from "../Scripts/NavigationSelector";

const Reservation = ({ handleLogout }) => {

  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    loadCartItemsFromLocalStorage(setCartItems);
  }, []);

  useEffect(() => {
    saveCartItemsToLocalStorage(cartItems);
  }, [cartItems]);

  return (
    <div className={styles.order_realize_container}>
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

    </div>
  );
};

export default Reservation;
