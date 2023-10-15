import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import CheckRoles from "../CheckRoles";
import NavigationSelector from "../Scripts/NavigationSelector";
import ServerAvailability from "../Scripts/ServerAvailability";
import axios from "axios";
import Modal from "react-modal";
import { loadCartItemsFromLocalStorage } from "../Scripts/localStorage";

const TableMap = ({ handleLogout }) => {
  const [tables, setTables] = useState([]);
  const [tableDetails, setTableDetails] = useState({});
  const [selectedTable, setSelectedTable] = useState(null);
  const [newTable, setNewTable] = useState(null);
  const [newTableData, setNewTableData] = useState({
    tableNumber: null,
    tableCapacity: null,
  });
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [crossedItems, setCrossedItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    loadCartItemsFromLocalStorage(setCartItems);
  }, []);

  const fetchTables = async () => {
    try {
      const url = `${process.env.REACT_APP_DEV_SERVER}/api/tables`;
      const response = await axios.get(url);
      const tables = response.data.data;
      setTables(tables);
    } catch (error) {
      console.error("Error fetching tables: ", error);
    }
  };

  const handleTableDragEnd = async (tableId, clientX, clientY) => {
    try {
      const mapElements =  document.getElementsByClassName(styles.map);
      const mapElement = Array.from(mapElements)[0];
      console.log(mapElement);

      const mapRect = mapElement.getBoundingClientRect();
      console.log("elooo" + mapRect.left, mapRect.top);
      // Szerokość i wysokość kratki
      const gridSize = 40;

      // Skalowanie pozycji myszki względem szerokości i wysokości mapy
      const scaledX =
        Math.round((clientX - mapRect.left) / gridSize) * gridSize;
      const scaledY = Math.round((clientY - mapRect.top) / gridSize) * gridSize;
      if (scaledX < 0 || scaledY < 0 || scaledX > 560 || scaledY > 360) {
        console.log("Nie można ustawić poza mapą");
        return;
      }
      const tableIndex = tables.findIndex((table) => table._id === tableId);
      const updatedTables = [...tables];
      updatedTables[tableIndex] = {
        ...updatedTables[tableIndex],
        x: scaledX,
        y: scaledY,
      };

      setTables(updatedTables);

      const updateUrl = `${process.env.REACT_APP_DEV_SERVER}/api/tables/${tableId}`;
      await axios.put(updateUrl, { x: scaledX, y: scaledY });
    } catch (error) {
      console.error("Error updating table position: ", error);
    }
  };

  const addTable = async (tableNumber, tableCapacity) => {
    try {
      const url = `${process.env.REACT_APP_DEV_SERVER}/api/tables`;
      const data = {
        x: 0,
        y: 0,
        tableNumber: tableNumber,
        tableCapacity: tableCapacity,
        tableStatus: "Wolny",
      };
      const response = await axios.post(url, data);
      fetchTables();
    } catch (error) {
      console.error("Error adding table: ", error);
    }
  };

  const handleChange = (e) => {
    setNewTableData({ ...newTableData, [e.target.name]: e.target.value });
  };

  const fetchOrders = async () => {
    try {
      const url = `${process.env.REACT_APP_DEV_SERVER}/api/orders`;
      const response = await axios.get(url);
      const orders = response.data.data;
      setOrders(orders);
    } catch (error) {
      console.error("Error fetching orders: ", error);
    }
  };

  const fetchReservations = async () => {
    try {
      const url = `${process.env.REACT_APP_DEV_SERVER}/api/reservations`;
      const response = await axios.get(url);
      const reservations = response.data.data;
      setReservations(reservations);
    } catch (error) {
      console.error("Error fetching reservations: ", error);
    }
  };

  const changeTableStatus = async () => {
    try {
      const url = `${process.env.REACT_APP_DEV_SERVER}/api/tables/${tableDetails._id}`;
      const data = {
        tableStatus: tableDetails.tableStatus === "Wolny" ? "Zajęty" : "Wolny",
      };
      const response = await axios.put(url, data);

      fetchTables();
    } catch (error) {
      console.error("Error changing table status: ", error);
    }
  };

  const handleItemCross = (itemId) => {
    if (crossedItems.includes(itemId)) {
      setCrossedItems(crossedItems.filter((id) => id !== itemId));
    } else {
      setCrossedItems([...crossedItems, itemId]);
    }
  };

  useEffect(() => {
    fetchTables();
    fetchOrders();
    fetchReservations();
    const today = new Date().toISOString().split("T")[0];
    console.log(today);
  }, []);

  return (
    <div className={styles.tableMap_container}>
      <div>
        <ServerAvailability></ServerAvailability>
      </div>
      <div>
        <CheckRoles>
          {(details) => (
            <NavigationSelector
              details={details}
              cartItems={0}
              quantity={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              handleLogout={handleLogout}
              token={localStorage.getItem("token")}
            />
          )}
        </CheckRoles>
      </div>
      <div className={styles.tableMap}>
        <h2>Mapa Stolików - przeciągnij aby zmienić pozycje</h2>
        <button
          className={styles.btn_add_table}
          onClick={() => {
            setNewTable(true);
          }}
        >
          Dodaj stolik
        </button>
        <div className={styles.map}>
          {tables
            ? tables.map((table) => (
                <div
                  key={table._id}
                  className={
                    table.tableStatus === "Wolny"
                      ? styles.table
                      : styles.table_occupied
                  }
                  style={{
                    left: `${table.x}px`,
                    top: `${table.y}px`,
                  }}
                  draggable="true"
                  onDragEnd={(e) => {
                    const newX = e.clientX;
                    const newY = e.clientY;
                    console.log(newX, newY, table._id);
                    handleTableDragEnd(table._id, newX, newY);
                  }}
                  onClick={() => {
                    setSelectedTable(table);
                    setTableDetails(table);
                  }}
                >
                  {table.tableNumber}
                </div>
              ))
            : null}
        </div>
        <Modal
          isOpen={selectedTable !== null}
          onRequestClose={() => setSelectedTable(null)}
          className={styles.modal_content}
          overlayClassName={styles.modal_overlay}
        >
          <h2>Stolik {tableDetails.tableNumber}</h2>
          <p>Status: {tableDetails.tableStatus}</p>
          <p>
            Koordynaty:{" "}
            {tableDetails
              ? `${tableDetails.x}x${tableDetails.y}`
              : "Brak danych"}
          </p>
          <p>Liczba miejsc: {tableDetails.tableCapacity}</p>
          {tableDetails.tableStatus /*=== "Zajęty"*/ ? (
            <div>
              {orders
                ? orders.map((order) => (
                    <div key={order._id}>
                      {order.tableNumber === tableDetails.tableNumber &&
                      order.status !== "Zamowienie dostarczone" &&
                      order.orderDate.split("T")[0].toString() ===
                        new Date().toISOString().split("T")[0].toString() ? (
                        <div>
                          <h3>Zamówienia: </h3>
                          <p>Status zamówienia: {order.status}</p>
                          {order.meals.map((item) => (
                            <div
                              key={item._id}
                              className={
                                crossedItems.includes(item._id)
                                  ? styles.crossedItem
                                  : styles.normalItem
                              }
                              onClick={() => handleItemCross(item._id)}
                            >
                              <p>
                                {item.name} x{item.quantity}
                              </p>
                            </div>
                          ))}
                          {order.comments ? `Uwagi: ${order.comments}` : null}
                          <p>Do zapłaty: {order.totalPrice}zł</p>
                          <p>------------------------------</p>
                        </div>
                      ) : null}
                    </div>
                  ))
                : null}
            </div>
          ) : null}

          {reservations
            ? reservations.map((reservation) => (
                <div key={reservation._id}>
                  {reservation.reservationTable === tableDetails.tableNumber &&
                  reservation.reservationDate ===
                    new Date()
                      .toISOString()
                      .split("T")[0]
                      .toString() /*"2023-09-14"*/ ? (
                    <div>
                      <p>Rezerwacje w dniu dzisiejszym:</p>
                      <p>Na godzine: {reservation.reservationTime}:00</p>
                      <p>
                        Zarezerwowano przez: {reservation.reservationPerson}
                      </p>
                    </div>
                  ) : null}
                </div>
              ))
            : null}
          <button
            className={styles.btn_close}
            onClick={() => setSelectedTable(null)}
          >
            Zamknij
          </button>
          <button
            className={
              tableDetails.tableStatus === "Wolny"
                ? styles.btn_free
                : styles.btn_occupied
            }
            onClick={() => {
              changeTableStatus() && setSelectedTable(null);
            }}
          >
            Zmień na {tableDetails.tableStatus === "Wolny" ? "zajęty" : "wolny"}
          </button>
        </Modal>
        <Modal
          isOpen={newTable !== null}
          onRequestClose={() => setNewTable(null)}
          className={styles.modal_content}
          overlayClassName={styles.modal_overlay}
        >
          <h2>Dodaj stolik</h2>
          <label>
            Numer stolika:
            <input
              type="number"
              name="tableNumber"
              value={
                newTableData.tableNumber === null
                  ? ""
                  : newTableData.tableNumber
              }
              onChange={handleChange}
              required
            />
            Liczba miejsc:
            <input
              type="number"
              name="tableCapacity"
              value={
                newTableData.tableCapacity === null
                  ? ""
                  : newTableData.tableCapacity
              }
              onChange={handleChange}
              required
            />
          </label>
          <button
            className={styles.btn_close}
            onClick={() => setNewTable(null)}
          >
            Zamknij
          </button>
          <button
            className={styles.btn_add}
            onClick={() => {
              addTable(newTableData.tableNumber, newTableData.tableCapacity);
              setNewTable(null);
            }}
          >
            Dodaj
          </button>
        </Modal>
      </div>
    </div>
  );
};

export default TableMap;
