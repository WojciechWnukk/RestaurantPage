import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

const NavigationForAdmin = ({ quantity }) => {
  const navigate = useNavigate();
  const [highlighted, setHighlighted] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cartItems");
    localStorage.removeItem("email");
    window.location.reload();
  };

  useEffect(() => {
    if (quantity > 0) {
      setHighlighted(true);

      setTimeout(() => {
        setHighlighted(false);
      }, 1000);
    }
  }, [quantity]);

  return (
    <nav className={styles.navbar}>
      <div className={styles.nav_links}>
        <button
          className={styles.nav_button}
          onClick={() => handleNavigation("/")}
        >
          Start
        </button>
        <button
          className={
            highlighted ? styles.nav_button_highlight : styles.nav_button
          }
          onClick={() => handleNavigation("/cart")}
        >
          Złóż zamówienie ({quantity})
        </button>
        <button
          className={styles.nav_button}
          onClick={() => handleNavigation("/waiter-panel")}
        >
          Panel kelnera
        </button>
        <button
          className={styles.nav_button}
          onClick={() => handleNavigation("/account-settings")}
        >
          Ustawienia konta
        </button>
        <button
          className={styles.nav_button}
          onClick={() => handleNavigation("/reservation")}
        >
          Rezerwacje
        </button>
        <button
          className={styles.nav_button}
          onClick={() => handleNavigation("/user-permissions")}
        >
          Uprawnienia
        </button>
        <button
          className={styles.nav_button}
          onClick={() => handleNavigation("/food-panel")}
        >
          Panel produktów
        </button>
        <button
          className={styles.nav_button}
          onClick={() => handleNavigation("/reports")}
        >
          Statystyki
        </button>
        <button
          className={styles.nav_button}
          onClick={() => handleNavigation("/table-map")}
        >
          Mapa stolików
        </button>
      </div>
      <button className={styles.nav_button} onClick={handleLogout}>
        Wyloguj
      </button>
    </nav>
  );
};

export default NavigationForAdmin;
