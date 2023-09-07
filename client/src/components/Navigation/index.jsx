import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

const Navigation = ({ cartItemCount }) => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };
  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("cartItems")
    localStorage.removeItem("email")
    window.location.reload()

  }
  return (
    <nav className={styles.navbar}>
      <div className={styles.nav_links}>
        <button
          className={`${styles.nav_button} ${styles.white_btn}`}
          onClick={() => handleNavigation("/")}
        >
          Start
        </button>
        <button
          className={`${styles.nav_button} ${styles.white_btn}`}
          onClick={() => handleNavigation("/cart")}
        >
          Koszyk ({cartItemCount})
        </button>
        <button
          className={`${styles.nav_button} ${styles.white_btn}`}
          onClick={() => handleNavigation("/account-settings")}
        >
          Ustawienia konta
        </button>
        <button
          className={`${styles.nav_button} ${styles.white_btn}`}
          onClick={() => handleNavigation("/reservation")}
        >
          Rezerwacje
        </button>

        <button
          className={`${styles.nav_button} ${styles.white_btn}`}
          onClick={() => handleNavigation("/my-orders")}
        >
          Zamówienia
        </button>

        <button
          className={`${styles.nav_button} ${styles.white_btn}`}
          onClick={() => handleNavigation("/promotions")}
        >
          Punkty
        </button>
      </div>
      <button
        className={`${styles.nav_button} ${styles.white_btn}`}
        onClick={handleLogout}
      >
        Wyloguj
      </button>
    </nav>
  );
};

export default Navigation;
