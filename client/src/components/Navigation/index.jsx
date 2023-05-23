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
    window.location.reload()
  }
  return (
    <nav className={styles.navbar}>
      <h1>Restauracja</h1>
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
          onClick={() => handleNavigation("/account-settings")}
        >
          Account Settings
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

export default Navigation;
