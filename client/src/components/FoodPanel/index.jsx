import React, { useState, useEffect } from "react";
import styles from "./styles.module.css"
import axios from "axios";
import categoriesData from "../categoriesData";
import foodData from "../foodData";
import CheckRoles from "../CheckRoles";
import NavigationSelector from "../Scripts/NavigationSelector";
import { useNavigate } from "react-router-dom";


const FoodPanel = ({ handleLogout }) => {
    const [selectedCategory, setSelectedCategory] = useState(categoriesData[0]);
    const [cartItems, setCartItems] = useState([]);
    const [details, setDetails] = useState(null);
    const navigate = useNavigate()

    const handleNavigation = (path) => {
        navigate(path);
    }
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
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    }

    const filteredFoodData = foodData.filter((food) => food.category === selectedCategory.name);




    const updateFood = () => {

    }
    useEffect(() => {
        handleGetUserDetails()
    }, []);
    if (!details || details.roles !== "Admin") {
        return <p>Brak uprawnień</p>;
    }

    return (
        <div className={styles.main_container}>
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

            <div className={styles.menu_container}>
                <div className={styles.categories}>
                    <button className={styles.add_to_cart_btn}
                        onClick={() => handleNavigation("/new-product")}>
                        Dodaj nowy produkt
                    </button>
                    <h2>Kategorie posiłków</h2>
                    <table className={styles.categories_table}>
                        <thead>
                            <tr>
                                <th>Rodzaj</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categoriesData.map((category) => (
                                <tr
                                    key={category.id}
                                    className={
                                        category === selectedCategory ? styles.active_category : ""
                                    }
                                    onClick={() => handleCategoryClick(category)}
                                >
                                    <td>{category.name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className={styles.content}>
                    <h2>{selectedCategory.name}</h2>
                    <div className={styles.food_items}>
                        {filteredFoodData.map((food) => (
                            <div className={styles.food_item} key={food.id}>
                                <div className={styles.food_item_inner}>
                                    <img src={food.image} alt={food.name} className={styles.food_item_image} />
                                    <h3>{food.name}</h3>
                                    <p>{food.price}</p>
                                    <button className={styles.add_to_cart_btn}
                                        onClick={() => updateFood(food)}>
                                        Edytuj
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

export default FoodPanel;