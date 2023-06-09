import React, { useState, useEffect } from "react";
import styles from "./styles.module.css"
import categoriesData from "../categoriesData";
import foodData from "../foodData";
import { loadCartItemsFromLocalStorage, saveCartItemsToLocalStorage } from "../Scripts/localStorage";
import CheckRoles from "../CheckRoles";
import NavigationSelector from "../Scripts/NavigationSelector";

const Main = ({ handleLogout }) => {

  const [selectedCategory, setSelectedCategory] = useState(categoriesData[0]);
  const [cartItems, setCartItems] = useState([]);

  console.log("Cart Items:", cartItems);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  }

  const filteredFoodData = foodData.filter((food) => food.category === selectedCategory.name);

  useEffect(() => {
    loadCartItemsFromLocalStorage(setCartItems);
  }, []);

  useEffect(() => {
    saveCartItemsToLocalStorage(cartItems);
  }, [cartItems]);


  const addToCart = (food) => {
    const existingItem = cartItems.find((item) => item.id === food.id);
    if (existingItem) {
      const updatedCartItems = cartItems.map((item) => {
        if (item.id === food.id) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
      setCartItems(updatedCartItems);
    } else {
      const updatedCartItems = [...cartItems, { ...food, quantity: 1 }];
      setCartItems(updatedCartItems);
    }
  };


  return (
    <div className={styles.main_container}>
      {
      }
      
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
                    onClick={() => addToCart(food)}>
                    Add to Cart
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