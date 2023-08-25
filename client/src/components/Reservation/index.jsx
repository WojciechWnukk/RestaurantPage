 import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import CheckRoles from "../CheckRoles";
import { loadCartItemsFromLocalStorage, saveCartItemsToLocalStorage } from "../Scripts/localStorage";
import NavigationSelector from "../Scripts/NavigationSelector";
import axios from "axios";
import Modal from "react-modal";

const Reservation = ({ handleLogout }) => {
  const [cartItems, setCartItems] = useState([]);
  const [currentDate, setCurrentDate] = useState("");
  const [currentDay, setCurrentDay] = useState("");
  const [week, setWeek] = useState([]);
  const storedEmail = localStorage.getItem("email");
  const [selectedTime, setSelectedTime] = useState(null)
  const [selectedPersons, setSelectedPersons] = useState(1)
  const [comment, setComment] = useState("")
  const [tempEmail, setTempEmail] = useState("")

  useEffect(() => {
    loadCartItemsFromLocalStorage(setCartItems);
    const today = new Date();
    const daysOfWeek = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];

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

  const reserveTable = (date, hours, persons, comment, email) => {
    console.log(date)
    console.log(hours)
    console.log(persons)
    console.log(email)
    console.log(comment)
    try {
      const url = `${process.env.REACT_APP_DEV_SERVER}/api/reservations`;
      const data = {
        reservationDate:  date,
        reservationTime: hours,
        reservationTable: persons,
        reservationPerson: email,
        reservationComment: comment,
      };
      axios.post(url, data);
      console.log("Zarezerwowano stolik" + " " + date + " " + hours);
    } catch (error) {
      console.error("Błąd podczas rezerwacji stolika:", error.response.data);
      throw new Error("Błąd podczas rezerwacji stolika");
    }
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
                <button onClick={() => setSelectedTime({day: day.day, date: day.date, time: 10})}>10:00 - 12:00</button>
                <button onClick={() => setSelectedTime({day: day.day, date: day.date, time: 12})}>12:00 - 14:00</button>
                <button onClick={() => setSelectedTime({day: day.day, date: day.date, time: 14})}>14:00 - 16:00</button>
                <button onClick={() => setSelectedTime({day: day.day, date: day.date, time: 16})}>16:00 - 18:00</button>
                <button onClick={() => setSelectedTime({day: day.day, date: day.date, time: 18})}>18:00 - 20:00</button>
                <button onClick={() => setSelectedTime({day: day.day, date: day.date, time: 20})}>20:00 - 22:00</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal
        isOpen={selectedTime !== null}
        onRequestClose={() => setSelectedTime(null)}
        className={styles.modal}
        overlayClassName={styles.overlay}
        >
  {selectedTime && (
    <div>
      <h2>Potwierdź rezerwację</h2>
      <p>Data: {selectedTime.date}</p>
      <p>Dzień tygodnia: {selectedTime.day}</p>
      <p>Godzina: {selectedTime.time}</p>
      <label>Liczba osób:</label>
      <input
        type="number"
        value={selectedPersons}
        onChange={(e) => setSelectedPersons(e.target.value)}
        min="1"
      />
      <label>Komentarz:</label>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <p>Adres email: {storedEmail ? storedEmail : 
      <input
        type="email"
        value={tempEmail}
        placeholder="Podaj adres email"
        onChange={(e) => setTempEmail(e.target.value)}
      />
      }</p>
      <button className={styles.btn_close} onClick={() => setSelectedTime(null)}>Anuluj</button>
      <button className={styles.btn_send} onClick={() => {
        reserveTable(selectedTime.date, selectedTime.time, selectedPersons, comment, storedEmail ? storedEmail : tempEmail)
        setSelectedTime(null)
        setSelectedPersons(1)
        setComment("")
        }}>Zarezerwuj</button>
    </div>
    )}
        </Modal>
    </div>
  );
};

export default Reservation;
