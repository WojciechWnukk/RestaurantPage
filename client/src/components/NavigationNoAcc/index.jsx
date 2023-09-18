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
          onClick={() => handleNavigation("/reservation")}
        >
          Rezerwacje
        </button>


      </div>
      <button
        className={`${styles.nav_button} ${styles.white_btn}`}
        onClick={() => handleNavigation("/login")}
      >
        Zaloguj
      </button>
    </nav>
  );
};

export default Navigation;
