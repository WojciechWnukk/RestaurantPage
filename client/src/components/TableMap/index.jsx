import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import CheckRoles from '../CheckRoles';
import NavigationSelector from '../Scripts/NavigationSelector';
import ServerAvailability from '../Scripts/ServerAvailability';
import axios from 'axios';
import Modal from "react-modal";


const TableMap = ({ handleLogout }) => {
    const [tables, setTables] = useState([]);
    const [tableDetails, setTableDetails] = useState({});
    const [selectedTable, setSelectedTable] = useState(null);
    const [newTable, setNewTable] = useState(null);
    const [newTableData, setNewTableData] = useState({
        tableNumber: null,
        tableCapacity: null
    });
    const [orders, setOrders] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [crossedItems, setCrossedItems] = useState([]);


    const fetchTables = async () => {
        try {
            const url = `${process.env.REACT_APP_DEV_SERVER}/api/tables`;
            const response = await axios.get(url);
            const tables = response.data.data;
            setTables(tables);
        } catch (error) {
            console.error('Error fetching tables: ', error);
        }
    }

    const handleTableDragEnd = async (tableId, newX, newY) => {
        try {
            newX = newX - 456;
            newY = newY - 185;

            const mapElement = document.querySelector(`.${styles.map}`);
            const mapRect = mapElement.getBoundingClientRect();

            const tableWidth = 30;
            const tableHeight = 30;

            const minX = 0;
            const maxX = mapRect.width - tableWidth;
            const minY = 0;
            const maxY = mapRect.height - tableHeight;
            console.log(minX, maxX, minY, maxY)

            const clampedX = Math.min(Math.max(newX, minX), maxX);
            const clampedY = Math.min(Math.max(newY, minY), maxY);

            const tableIndex = tables.findIndex((table) => table._id === tableId);
            console.log(clampedX, clampedY)
            const updatedTables = [...tables];
            updatedTables[tableIndex] = { ...updatedTables[tableIndex], x: clampedX, y: clampedY };

            setTables(updatedTables);

            const updateUrl = `${process.env.REACT_APP_DEV_SERVER}/api/tables/${tableId}`;
            await axios.put(updateUrl, { x: clampedX, y: clampedY });
        } catch (error) {
            console.error('Error updating table position: ', error);
        }
    }

    const addTable = async (tableNumber, tableCapacity) => {
        try {
            const url = `${process.env.REACT_APP_DEV_SERVER}/api/tables`;
            const data = {
                x: 0,
                y: 0,
                tableNumber: tableNumber,
                tableCapacity: tableCapacity,
                tableStatus: "Wolny",

            }
            const response = await axios.post(url, data);
            fetchTables()
        } catch (error) {
            console.error('Error adding table: ', error);
        }
    }

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
            console.error('Error fetching orders: ', error);
        }
    }

    const fetchReservations = async () => {
        try {
            const url = `${process.env.REACT_APP_DEV_SERVER}/api/reservations`;
            const response = await axios.get(url);
            const reservations = response.data.data;
            setReservations(reservations);
        } catch (error) {
            console.error('Error fetching reservations: ', error);
        }
    }

    const changeTableStatus = async () => {
        try {
            const url = `${process.env.REACT_APP_DEV_SERVER}/api/tables/${tableDetails._id}`;
            const data = {
                tableStatus: tableDetails.tableStatus === "Wolny" ? "Zajęty" : "Wolny"
            }
            const response = await axios.put(url, data);

            fetchTables()
        } catch (error) {
            console.error('Error changing table status: ', error);
        }
    }

    const handleItemCross = (itemId) => {
        if (crossedItems.includes(itemId)) {
            setCrossedItems(crossedItems.filter((id) => id !== itemId));
        } else {
            setCrossedItems([...crossedItems, itemId]);
        }
    };


    useEffect(() => {
        fetchTables()
        fetchOrders()
        fetchReservations()
        const today = new Date().toISOString().split('T')[0];
        console.log(today)
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
                            handleLogout={handleLogout}
                            token={localStorage.getItem('token')}
                        />
                    )}
                </CheckRoles>
            </div>
            <div className={styles.tableMap}>
                <h2>Mapa Stolików</h2>
                <button className={styles.btn_add_table} onClick={() => { setNewTable(true) }}>Dodaj stolik</button>
                <div className={styles.map}>
                    {tables ? tables.map((table) => (
                        <div
                            key={table._id}
                            className={table.tableStatus === "Wolny" ? styles.table : styles.table_occupied}
                            style={{ left: table.x, top: table.y }}
                            draggable="true"
                            onDragEnd={(e) => {
                                const newX = e.clientX;
                                const newY = e.clientY;
                                console.log(newX, newY, table._id);
                                handleTableDragEnd(table._id, newX, newY);
                            }}
                            onClick={() => {
                                setSelectedTable(table)
                                setTableDetails(table)
                            }}
                        >{table.tableNumber}</div>
                    )) : null}
                </div>
                <Modal
                    isOpen={selectedTable !== null}
                    onRequestClose={() => setSelectedTable(null)}
                    className={styles.modal_content}
                    overlayClassName={styles.modal_overlay}
                >
                    <h2>Stolik {tableDetails.tableNumber}</h2>
                    <p>Status: {tableDetails.tableStatus}</p>
                    <p>Koordynaty: {tableDetails ? `${tableDetails.x}x${tableDetails.y}` : 'Brak danych'}</p>
                    <p>Liczba miejsc: {tableDetails.tableCapacity}</p>
                    {tableDetails.tableStatus === "Zajęty" ? <div>
                        <h3>Zamówienia:</h3>
                        {orders ? orders.map((order) => (
                            <div key={order._id}
                            >
                                {order.tableNumber === tableDetails.tableNumber && order.status !== "Zamowienie dostarczone" && order.orderDate.split('T')[0].toString() === new Date().toISOString().split('T')[0].toString() ? <div>
                                    <p>Status zamówienia: {order.status}</p>
                                    {order.meals.map((item) => (
                                        <div
                                            key={item._id}
                                            className={crossedItems.includes(item._id) ? styles.crossedItem : styles.normalItem}
                                            onClick={() => handleItemCross(item._id)}>
                                            <p>{item.name} x{item.quantity}</p>
                                        </div>
                                    ))}
                                    <p>Do zapłaty: {order.totalPrice}zł</p>
                                    <p>------------------------------</p>
                                </div> : null}
                            </div>
                        )) : null}
                    </div> : null}
                    <p>Rezerwacje w dniu dzisiejszym:</p>
                    {reservations ? reservations.map((reservation) => (
                        <div key={reservation._id}>
                            {reservation.reservationTable === tableDetails.tableNumber && reservation.reservationDate === new Date().toISOString().split('T')[0].toString()/*"2023-09-14"*/ ? <div>
                                <p>Na godzine: {reservation.reservationTime}:00</p>
                                <p>Zarezerwowano przez: {reservation.reservationPerson}</p>
                            </div> : null}
                        </div>
                    )) : null}
                    <button className={styles.btn_close} onClick={() => setSelectedTable(null)}>Zamknij</button>
                    <button className={tableDetails.tableStatus === "Wolny" ? styles.btn_free : styles.btn_occupied} onClick={() => { changeTableStatus() && setSelectedTable(null) }}>Zmień na {tableDetails.tableStatus === "Wolny" ? "zajęty" : "wolny"}</button>
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
                            value={newTableData.tableNumber === null ? "" : newTableData.tableNumber}
                            onChange={handleChange}
                            required
                        />
                        Liczba miejsc:
                        <input
                            type="number"
                            name="tableCapacity"
                            value={newTableData.tableCapacity === null ? "" : newTableData.tableCapacity}
                            onChange={handleChange}
                            required
                        />

                    </label>
                    <button className={styles.btn_close} onClick={() => setNewTable(null)}>Zamknij</button>
                    <button className={styles.btn_add} onClick={() => {
                        addTable(newTableData.tableNumber, newTableData.tableCapacity)
                        setNewTable(null)
                    }}>Dodaj</button>
                </Modal>
            </div>
        </div>
    );
};

export default TableMap;
