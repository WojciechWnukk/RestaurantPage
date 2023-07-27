import React, { useState, useEffect } from "react";
import styles from "./styles.module.css"
import categoriesData from "../categoriesData";
import axios from "axios";
import { loadCartItemsFromLocalStorage, saveCartItemsToLocalStorage } from "../Scripts/localStorage";
import CheckRoles from "../CheckRoles";
import NavigationSelector from "../Scripts/NavigationSelector";

const Main = ({ handleLogout }) => {

  const [selectedCategory, setSelectedCategory] = useState(categoriesData[0]);
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredFoodData, setFilteredFoodData] = useState([])

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
    const existingItem = cartItems.find((item) => item._id === food._id);
    if (existingItem) {
      const updatedCartItems = cartItems.map((item) => {
        if (item._id === food._id) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
      setCartItems(updatedCartItems);
    } else {
      const updatedCartItems = [...cartItems, { ...food, quantity: 1 }];
      setCartItems(updatedCartItems);
    }
    console.log(cartItems)
  };

  const fetchProducts = async () => {
    try {
        const url = "http://localhost:8080/api/products"
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

useEffect(() => {
  fetchProducts()
  const filteredData = products.filter(
      (product) => product.productCategory === selectedCategory.name
  )
  setFilteredFoodData(filteredData);
}, [products, selectedCategory]);

  return (
    <div className={styles.main_container}>
      {
      }

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
              <div className={styles.food_item} key={food._id}>
                <div className={styles.food_item_inner}>
                  <img src={food.productImage} alt={food.productName} className={styles.food_item_image} />
                  <h3>{food.productName}</h3>
                  <p>{food.productPrice + " zł"}</p>
                  <button className={styles.add_to_cart_btn}
                    onClick={() => addToCart(food)}>
                    Biorę!
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

export default Main;