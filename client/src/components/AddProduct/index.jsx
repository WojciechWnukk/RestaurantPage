import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import Navigation from "../Navigation";
import axios from "axios";
import NavigationForAdmin from "../NavigationForAdmin";
import CheckRoles from "../CheckRoles";

const AddProduct = ({ handleLogout }) => {
    const [details, setDetails] = useState(null)
    const [cartItems, setCartItems] = useState([]);
    const [data, setData] = useState({
        productName: "",
        productPrice: "",
        productStatus: "",
        productCategory: "",
        productImage: ""
    })

    const handleGetUserDetails = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const config = {
                    method: "get",
                    url: "http://localhost:8080/api/users/user",
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": token,
                    },
                };
                const { data: res } = await axios(config);
                setDetails(res.data);
                console.log(details)

            } catch (error) {
                if (
                    error.response &&
                    error.response.status >= 400 &&
                    error.response.status <= 500
                ) {

                    localStorage.removeItem("token");
                    window.location.reload();
                }
            }
        }
    }

    useEffect(() => {
        handleGetUserDetails()
    }, []);
    if (!details || details.roles !== "Admin") {
        return <p>Brak uprawnień</p>;
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            //const url=`${process.env.DEV_SERVER}/api/addproduct`
            const url="http://localhost:8080/api/products"
            const { data: res } = await axios.post(url, data)
            console.log(res.message)
            await AddProduct()

            setTimeout(() => {
                window.location.reload();
              }, 5000)

            console.log(url)
        } catch (error) {
            if (
                error.response &&
                error.response.status >= 400 &&
                error.response.status <= 500
            ) {
                //setError(error.response.data.message)
            }
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    return (
        <div className={styles.order_realize_container}>
            <CheckRoles>
                {(details) => {
                    if (details && details.roles === "Admin") {
                        return <NavigationForAdmin handleLogout={handleLogout} />;
                    } else {
                        return <Navigation cartItemCount={cartItems.length} handleLogout={handleLogout} />;
                    }
                }}
            </CheckRoles>
            <div className={styles.addproduct_container}>
                <h3>Dodaj produkt</h3>
                <form onSubmit={handleSubmit}>
                    <label>
                        Nazwa produktu:
                        <input
                            type="text"
                            name="productName"
                            value={data.productName}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Cena:
                        <input
                            type="text" //nwm czy zadziala
                            name="productPrice"
                            value={data.productPrice}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Kategoria:
                        <select name="productCategory" value={data.productCategory} onChange={handleChange} required>
                            <option value="">Wybierz kategorie</option> {/* trzeba zrobic integracje z bazą potem */}
                            <option value="Przystawki">Przystawki</option>
                            <option value="Dania Główne">Dania główne</option>
                            <option value="Desery">Desery</option>
                            <option value="Napoje">Napoje</option>
                        </select>
                    </label>
                    <label>
                        Link do obrazka:
                        <input
                            type="text"
                            name="productImage"
                            value={data.productImage}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <button type="submit">Dodaj produkt</button>
                </form>

            </div>
        </div>
    );
};

export default AddProduct;
