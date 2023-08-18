 import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import CheckRoles from "../CheckRoles";
import { loadCartItemsFromLocalStorage, saveCartItemsToLocalStorage } from "../Scripts/localStorage";
import NavigationSelector from "../Scripts/NavigationSelector";

const Reservation = ({ handleLogout }) => {
  const [cartItems, setCartItems] = useState([]);
  const [currentDate, setCurrentDate] = useState("");
  const [currentDay, setCurrentDay] = useState("");
  const [week, setWeek] = useState([]);

  useEffect(() => {
    loadCartItemsFromLocalStorage(setCartItems);
    const today = new Date();
    const daysOfWeek = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];
    setCurrentDate(today.toLocaleDateString());
    setCurrentDay(daysOfWeek[today.getDay()]);

    const nextDays = [];
    for (let i = 0; i <= 6; i++) {
      const nextDate = new Date();
      nextDate.setDate(today.getDate() + i);
      nextDays.push({
        day: daysOfWeek[nextDate.getDay()],
        date: nextDate.toLocaleDateString(),
      });
    }
    setWeek(nextDays);
  }, []);

  useEffect(() => {
    saveCartItemsToLocalStorage(cartItems);
  }, [cartItems]);

  const reserveTable = (day, date, hours) => {
    console.log("Zarezerwowano stolik");
  };

  return (
    <div className={styles.reservation_container}>
      <CheckRoles>
        {(details) => (
          <NavigationSelector
            details={details}
            cartItems={cartItems}
            handleLogout={handleLogout}
            token={localStorage.getItem("token")}
          />
        )}
      </CheckRoles>
      <div className={styles.reservation}>
        <h3>Zarezerwuj stolik na najbliższy tydzień:</h3>
        <div className={styles.date_boxes}>
          {week.map((day, index) => (
            <div key={index} className={styles.date_box}>
              <p>{day.day}</p>
              <p>{day.date}</p>
              <div className={styles.time_ranges}>
                <button onClick={reserveTable(day.day, day.date, 10)}>10:00 - 12:00</button>
                <button onClick={reserveTable(day.day, day.date, 12)}>12:00 - 14:00</button>
                <button onClick={reserveTable(day.day, day.date, 14)}>14:00 - 16:00</button>
                <button onClick={reserveTable(day.day, day.date, 16)}>16:00 - 18:00</button>
                <button onClick={reserveTable(day.day, day.date, 18)}>18:00 - 20:00</button>
                <button onClick={reserveTable(day.day, day.date, 20)}>20:00 - 22:00</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reservation;
