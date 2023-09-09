import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import CheckRoles from "../CheckRoles";
import NavigationSelector from "../Scripts/NavigationSelector";
import ServerAvailability from "../Scripts/ServerAvailability";
import Graph from "../Scripts/Graph";
import axios from "axios";

const Reports = ({ handleLogout }) => {

    const [orders, setOrders] = useState([])
    const [transformedData, setTransformedData] = useState([])
    const fetchOrders = async () => {
        try {
            const url = `${process.env.REACT_APP_DEV_SERVER}/api/orders`
            const response = await axios.get(url)
            const orders = response.data.data
            setOrders(orders)
            const transformedDataa = orders.map(order => ({
                totalPrice: order.totalPrice,
                orderDate: order.orderDate
            }));
            setTransformedData(transformedDataa)
        } catch (error) {
            console.error("Error fetching orders: ", error)
        }
    }



    useEffect(() => {
        fetchOrders()

    }, [])

    return (
        <div className={styles.reports_container}>
            <div>
                <ServerAvailability>
                </ServerAvailability>
            </div>
            <div>
                <CheckRoles>
                    {(details) => (
                        <NavigationSelector
                            details={details}
                            cartItems={0}
                            handleLogout={handleLogout}
                            token={localStorage.getItem("token")}
                        />
                    )}
                </CheckRoles>
            </div>
            <div className={styles.graph_container}>
                <div className={styles.graph_title}>
                    <h2>Zarobki w danym miesiącu</h2>
                </div>
                <Graph data={transformedData} />
                {console.log("transformed ", transformedData)
                }

            </div>
        </div>
    );
};

export default Reports;