import React, { useState, useEffect } from "react";
import styles from "./styles.module.css"
import categoriesData from "../categoriesData";
import axios from "axios";
import { loadCartItemsFromLocalStorage, saveCartItemsToLocalStorage } from "../Scripts/localStorage";
import CheckRoles from "../CheckRoles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUtensils, faBurger, faIceCream, faWhiskeyGlass } from "@fortawesome/free-solid-svg-icons";
import NavigationSelector from "../Scripts/NavigationSelector";
import ServerAvailability from "../Scripts/ServerAvailability";
import { v4 as uuidv4 } from 'uuid';

const Promotions = ({ handleLogout }) => {

    const [selectedCategory, setSelectedCategory] = useState(categoriesData[0]);
    const [cartItems, setCartItems] = useState([]);
    const [products, setProducts] = useState([]);
    const [filteredFoodData, setFilteredFoodData] = useState([])
    const [details, setDetails] = useState(null);
    const [userPoints, setUserPoints] = useState(0);
    const email = localStorage.getItem("email");

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    }

    useEffect(() => {
        loadCartItemsFromLocalStorage(setCartItems);
    }, []);

    useEffect(() => {
        saveCartItemsToLocalStorage(cartItems);
    }, [cartItems]);


    const addToCart = (food) => {
        const confirmed = window.confirm("Czy na pewno chcesz przeznaczyć punkty na ten produkt?");
        if (!confirmed) {
            return;
        }

        reducePoints(food.productPrice * 100);

        const updatedCartItems = [...cartItems, { ...food, quantity: 1, productPrice: "0.00", _id: uuidv4() }];
        setCartItems(updatedCartItems);

        console.log(cartItems)
    };

    const fetchProducts = async () => {
        try {
            const url = `${process.env.REACT_APP_DEV_SERVER}/api/products`
            const response = await axios.get(url)
            const availableProducts = response.data.data.filter(
                (product) =>
                    product.productStatus === "Dostępny"
            )
            setProducts(availableProducts)

        } catch (error) {
            console.error("Error fetching products: ", error)
        }
    }

    const handleGetUserDetails = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const config = {
                    method: "get",
                    url: `${process.env.REACT_APP_DEV_SERVER}/api/users/user`,
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": token,
                    },
                };
                const { data: res } = await axios(config);
                setDetails(res.data);
                setUserPoints(res.data.points)
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

    const reducePoints = async (points) => {
        try {
            const user = await axios.get(`${process.env.REACT_APP_DEV_SERVER}/api/users/${email}`);
            const newPoints = user.data.data.points - points;
            await axios.put(
                `${process.env.REACT_APP_DEV_SERVER}/api/users/points/${email}`,
                { points: newPoints }
            )
        } catch (error) {
            console.error("Error updating user points:", error);
        }
    }

    useEffect(() => {
        fetchProducts()
        const filteredData = products.filter(
            (product) => product.productCategory === selectedCategory.name
        )
        setFilteredFoodData(filteredData)
        handleGetUserDetails()
    }, [products, selectedCategory]);



    return (
        <div className={styles.main_container}>
            <div>
                <ServerAvailability>
                </ServerAvailability>
            </div>
            <div>
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
            </div>
            <div className={styles.menu_container}>
                <div className={styles.categories}>
                    <div className={styles.categories_buttons}>
                        {categoriesData.map((category) => (
                            <button
                                key={category.id}
                                className={`${styles.category_button} ${category === selectedCategory ? styles.active_category : ""
                                    }`}
                                onClick={() => handleCategoryClick(category)}
                            >
                                {category.name}
                                <br /><br />
                                {
                                    category.name === "Przystawki" ? <FontAwesomeIcon icon={faUtensils} size="xl" /> :
                                        category.name === "Dania główne" ? <FontAwesomeIcon icon={faBurger} size="xl" /> :
                                            category.name === "Desery" ? <FontAwesomeIcon icon={faIceCream} size="xl" /> :
                                                category.name === "Napoje" ? <FontAwesomeIcon icon={faWhiskeyGlass} size="xl" /> : null
                                }
                            </button>
                        ))}
                    </div>
                </div>
                <div className={styles.points}>
                    <h3>Twoje punkty: {details ? details.points : "Ładowanie..."}</h3>
                </div>
                <div className={styles.content}>
                    <div className={styles.food_items}>
                        {filteredFoodData.map((food) => (
                            <div className={styles.food_item} key={food._id}>
                                <div className={styles.food_item_inner}>
                                    <img src={food.productImage} alt={food.productName} className={styles.food_item_image} />
                                    <h3>{food.productName}</h3>
                                    <p>{food.productPrice * 100 + " punktów"}</p>
                                    <button className={styles.add_to_cart_btn}
                                        onClick={() => addToCart(food)}
                                        disabled={userPoints < food.productPrice * 100}>
                                        {userPoints > food.productPrice * 100 ? "Biorę!" : "Brak punktów!"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Promotions;