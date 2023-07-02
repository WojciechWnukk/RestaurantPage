import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

const NavigationForAdmin = ({ cartItemCount }) => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };
  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("cartItems")
    window.location.reload()
    
  }
  return (
    <nav className={styles.navbar}>
      <div className={styles.nav_links}>
        <button
          className={`${styles.nav_button} ${styles.white_btn}`}
          onClick={() => handleNavigation("/")}
        >
          Home
        </button>
        <button
          className={`${styles.nav_button} ${styles.white_btn}`}
          onClick={() => handleNavigation("/waiter-panel")}
        >
          WaiterPanel
        </button>
        <button
          className={`${styles.nav_button} ${styles.white_btn}`}
          onClick={() => handleNavigation("/account-settings")}
        >
          Account Settings
        </button>
        <button
          className={`${styles.nav_button} ${styles.white_btn}`}
          onClick={() => handleNavigation("/reservation")}
        >
          Reservations
        </button>
        <button
          className={`${styles.nav_button} ${styles.white_btn}`}
          onClick={() => handleNavigation("/user-permissions")}
        >
          Permisions
        </button>
      </div>
      <button
        className={`${styles.nav_button} ${styles.white_btn}`}
        onClick={handleLogout}
      >
        Logout
      </button>
    </nav>
  );
};

export default NavigationForAdmin;
