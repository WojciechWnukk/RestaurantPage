import React, { useState, useEffect } from "react";
import styles from "./serverAvailability.module.css";

const ServerAvailability = ({ children }) => {
  const [serverOnline, setServerOnline] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkServerAvailability = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_DEV_SERVER}/api/products`
        );
        const data = await response.json();
        console.log(data);
        if (data) {
          setServerOnline(true);
        }
      } catch (error) {
        setServerOnline(false);
      } finally {
        setLoading(false);
      }
    };

    checkServerAvailability();
  }, []);

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.loader}></div>
      </div>
    );
  }

  if (serverOnline) {
    return children;
  } else {
    return (
      <div className={styles.serverOfflineOverlay}>
        <p>Serwer jest offline. Proszę spróbować ponownie później.</p>
      </div>
    );
  }
};

export default ServerAvailability;
