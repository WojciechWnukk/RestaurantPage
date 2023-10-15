import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

const Navigation = ({ quantity }) => {
  const navigate = useNavigate();
  const [highlighted, setHighlighted] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
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
          Koszyk ({quantity})
        </button>
        <button
          className={styles.nav_button}
          onClick={() => handleNavigation("/reservation")}
        >
          Rezerwacje
        </button>
      </div>
      <button
        className={styles.nav_button}
        onClick={() => handleNavigation("/login")}
      >
        Zaloguj
      </button>
    </nav>
  );
};

export default Navigation;
