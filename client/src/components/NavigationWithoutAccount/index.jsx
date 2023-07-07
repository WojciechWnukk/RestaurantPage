import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

const Navigation = ({ cartItemCount }) => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

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
          onClick={() => handleNavigation("/cart")}
        >
          Cart ({cartItemCount})
        </button>
        <button
          className={`${styles.nav_button} ${styles.white_btn}`}
          onClick={() => handleNavigation("/reservation")}
        >
          Reservations
        </button>
        
        <button
          className={`${styles.nav_button} ${styles.white_btn}`}
          onClick={() => handleNavigation("/login")}
        >
          Zaloguj się
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
