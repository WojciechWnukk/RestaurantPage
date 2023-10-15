import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import categoriesData from "../categoriesData";
import axios from "axios";
import {
  loadCartItemsFromLocalStorage,
  saveCartItemsToLocalStorage,
} from "../Scripts/localStorage";
import CheckRoles from "../CheckRoles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUtensils,
  faBurger,
  faIceCream,
  faWhiskeyGlass,
} from "@fortawesome/free-solid-svg-icons";
import NavigationSelector from "../Scripts/NavigationSelector";
import ServerAvailability from "../Scripts/ServerAvailability";

const Main = ({ handleLogout }) => {
  const [selectedCategory, setSelectedCategory] = useState(categoriesData[0]);
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredFoodData, setFilteredFoodData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [wantSearch, setWantSearch] = useState(false);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

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
      saveCartItemsToLocalStorage(updatedCartItems);
    } else {
      const updatedCartItems = [...cartItems, { ...food, quantity: 1 }];
      setCartItems(updatedCartItems);
      saveCartItemsToLocalStorage(updatedCartItems);
    }
    console.log(cartItems);
  };

  const fetchProducts = async () => {
    try {
      const url = `${process.env.REACT_APP_DEV_SERVER}/api/products`;
      const response = await axios.get(url);
      const availableProducts = response.data.data.filter(
        (product) => product.productStatus === "Dostępny"
      );
      setProducts(availableProducts);
    } catch (error) {
      console.error("Error fetching products: ", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    let filteredData = products;
    if (!wantSearch) {
      filteredData = products.filter(
        (product) =>
          product.productCategory === selectedCategory.name &&
          product.productName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else {
      filteredData = products.filter((product) =>
        product.productName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredFoodData(filteredData);
  }, [products, selectedCategory, searchQuery, wantSearch]);

  return (
    <div className={styles.main_container}>
      <div>
        <ServerAvailability></ServerAvailability>
      </div>
      <div>
        <CheckRoles>
          {(details) => (
            <NavigationSelector
              details={details}
              cartItems={cartItems}
              quantity={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
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
                className={`${styles.category_button} ${
                  category === selectedCategory ? styles.active_category : ""
                }`}
                onClick={() => handleCategoryClick(category)}
                disabled={wantSearch}
              >
                {category.name}
                <br />
                <br />
                {category.name === "Przystawki" ? (
                  <FontAwesomeIcon icon={faUtensils} size="xl" />
                ) : category.name === "Dania główne" ? (
                  <FontAwesomeIcon icon={faBurger} size="xl" />
                ) : category.name === "Desery" ? (
                  <FontAwesomeIcon icon={faIceCream} size="xl" />
                ) : category.name === "Napoje" ? (
                  <FontAwesomeIcon icon={faWhiskeyGlass} size="xl" />
                ) : null}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.search_bar}>
          {wantSearch ? (
            <button
              className={styles.search_button}
              onClick={() => setWantSearch(!wantSearch)}
            >
              {"❌"}
            </button>
          ) : null}
          {wantSearch ? null : (
            <button
              className={styles.search_button}
              onClick={() => setWantSearch(!wantSearch)}
            >
              {"🔍"}
            </button>
          )}
          {wantSearch ? (
            <input
              type="text"
              placeholder="Szukaj produktów..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          ) : null}
        </div>
        <div className={styles.content}>
          <div className={styles.food_items}>
            {filteredFoodData.map((food) => (
              <div className={styles.food_item} key={food._id}>
                {food.productStatus === "Dostępny" ? (
                  <div className={styles.food_item_inner}>
                    <img
                      src={food.productImage}
                      alt={food.productName}
                      className={styles.food_item_image}
                    />
                    <h3>{food.productName}</h3>
                    {food.productDescription ? (
                      <p>{food.productDescription}</p>
                    ) : (
                      ""
                    )}
                    <p>{food.productPrice + " zł"}</p>
                    <button
                      className={styles.add_to_cart_btn}
                      onClick={() => addToCart(food)}
                    >
                      Biorę!
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
