import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import Navigation from "../Navigation";
import { loadCartItemsFromLocalStorage, saveCartItemsToLocalStorage } from "../Scripts/localStorage";
import axios from "axios";
import NavigationForAdmin from "../NavigationForAdmin"
import CheckRoles from "../CheckRoles";

const AccountSettings = ({ handleLogout }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    loadCartItemsFromLocalStorage(setCartItems);
  }, []);

  useEffect(() => {
    saveCartItemsToLocalStorage(cartItems);
  }, [cartItems]);

  const changePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setErrorMessage("Potwierdzenie hasła nie jest zgodne z nowym hasłem.");
      return;
    }
    if (!validatePassword(newPassword)) {
      setErrorMessage("Hasło musi zawierać co najmniej 8 znaków i może zawierać tylko litery i cyfry.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (token) {
        const config = {
          method: "put",
          url: "http://localhost:8080/api/users/password",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
          data: {
            currentPassword: currentPassword,
            newPassword: newPassword,
          },
        };

        await axios(config);
        console.log("Zmieniono hasło");
      }
    } catch (error) {
      console.error("Wystąpił błąd podczas zmiany hasła:", error);
    }



    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setErrorMessage("");
  };

  const validatePassword = (password) => {
    const passwordRegex = /^[a-zA-Z0-9.!@#$%^&*()_+-]{8,}$/;
    return passwordRegex.test(password);
  }


  const deleteUser = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem("token")
    console.log("token" + token)
    const confirmed = window.confirm("Czy na pewno chcesz usunąć swoje konto?")

    if (confirmed) {
      const token = localStorage.getItem("token")

      if (token) {
        try {
          const config = {
            method: 'delete',
            url: 'http://localhost:8080/api/users',
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': token
            }
          }

          await axios(config)
          console.log("Usunieto konto")
        } catch (error) {

        }
      }
      localStorage.removeItem("token")
      localStorage.removeItem("cartItems")
      window.location.reload()
    }

  }

  return (
    <div className={styles.account_settings_container}>

      <CheckRoles>
        {(details) => {
          if (details && details.roles === "Admin") {
            return <NavigationForAdmin handleLogout={handleLogout} />;
          } else {
            return <Navigation cartItemCount={cartItems.length} handleLogout={handleLogout} />
          }
        }}
      </CheckRoles>
      <h2>Account Settings</h2>
      <form onSubmit={changePassword}>
        <div className={styles.form_group}>
          <label htmlFor="currentPassword">Current Password:</label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className={styles.form_group}>
          <label htmlFor="newPassword">New Password:</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className={styles.form_group}>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        {errorMessage && <p className={styles.error_message}>{errorMessage}</p>}
        <div className={styles.button_container}>
          <button type="submit">Change Password</button>
          <button className={styles.delete_account_button} onClick={deleteUser}>
            Delete Account
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountSettings;