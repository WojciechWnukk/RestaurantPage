import React, { useState } from "react";
import styles from "./styles.module.css";

const AccountSettings = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Walidacja pól formularza
    if (newPassword !== confirmPassword) {
      setErrorMessage("Potwierdzenie hasła nie jest zgodne z nowym hasłem.");
      return;
    }

    // Przetwarzanie logiki zmiany hasła

    // Zresetowanie pól formularza
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setErrorMessage("");
  };

  return (
    <div className={styles.account_settings_container}>
      <h2>Account Settings</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Change Password</button>
      </form>
    </div>
  );
};

export default AccountSettings;
