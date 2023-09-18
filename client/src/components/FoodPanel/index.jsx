import React, { useState, useEffect } from "react";
import styles from "./styles.module.css"
import axios from "axios";
import categoriesData from "../categoriesData";
import CheckRoles from "../CheckRoles";
import NavigationSelector from "../Scripts/NavigationSelector";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUtensils, faBurger, faIceCream, faWhiskeyGlass } from "@fortawesome/free-solid-svg-icons";
import ServerAvailability from "../Scripts/ServerAvailability";


const FoodPanel = ({ handleLogout }) => {
    const [selectedCategory, setSelectedCategory] = useState(categoriesData[0]);
    const [cartItems] = useState([]);
    const [details, setDetails] = useState(null);
    const [products, setProducts] = useState([]);
    const [filteredFoodData, setFilteredFoodData] = useState([])
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [data, setData] = useState({})
    const [searchQuery, setSearchQuery] = useState("");


    const handleChange = (e) => {
        const { name, value } = e.target;
        // Zamiana przecinka na kropkę w polu "Cena"
        if (name === "productPrice") {
            setData((prevData) => ({
                ...prevData,
                [name]: value.replace(",", "."),
            }));
        } else {
            setData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    }


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
                    url: `${process.env.REACT_APP_DEV_SERVER}/api/users/user`,
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



    const fetchProducts = async () => {
        try {
            const url = `${process.env.REACT_APP_DEV_SERVER}/api/products`
            const response = await axios.get(url)
            const availableProducts = response.data.data.filter(
                (product) =>
                    product.productStatus === "Dostępny" || product.productStatus === "Niedostępny"
            )
            setProducts(availableProducts)

        } catch (error) {
            console.error("Error fetching products: ", error)
        }
    }

    const modifyProduct = async (productId, newProduct) => {
        console.log(productId)
        try {
            await axios.put(
                `${process.env.REACT_APP_DEV_SERVER}/api/products/${productId}`,
                //`http://localhost:8080/api/products/${productId}`,
                {
                    productName: newProduct.productName,
                    productDescription: newProduct.productDescription,
                    productPrice: newProduct.productPrice,
                    productCategory: newProduct.productCategory,
                    productImage: newProduct.productImage,
                    productStatus: newProduct.productStatus
                }
            )
            fetchProducts()
        } catch (error) {
            console.error("Error updating product")
        }
    }



    useEffect(() => {
        handleGetUserDetails()
        fetchProducts()
    }, []);

    useEffect(() => {
        const filteredData = products.filter(
            (product) =>
                product.productCategory === selectedCategory.name &&
                product.productName.toLowerCase().includes(searchQuery.toLowerCase())
        )
        setFilteredFoodData(filteredData);
    }, [products, selectedCategory, searchQuery]);


    if (!details || details.roles !== "Admin") {
        return <p>Brak uprawnień</p>;
    }

    return (
        <div className={styles.main_container}>
            <div>
                <ServerAvailability>
                </ServerAvailability>
            </div>
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
                    <button className={styles.new_product_btn}
                        onClick={() => handleNavigation("/new-product")}>
                        Dodaj nowy produkt
                    </button>

                </div>
                <div className={styles.search_bar}>
                    <input
                        type="text"
                        placeholder="Szukaj produktów..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className={styles.content}>
                    <div className={styles.food_items}>
                        {filteredFoodData.map((product) => (
                            <div className={styles.food_item} key={product._id}>
                                <div className={styles.food_item_inner}>
                                    <img src={product.productImage} alt={product.productName} className={styles.food_item_image} />
                                    <h3>{product.productName}</h3>
                                    <p>Dostępny? {product.productStatus === "Dostępny" ? "Tak" : "Nie"}</p>
                                    {product.productDescription ? <p>{product.productDescription}</p> : ""}
                                    <p>{product.productPrice + " zł"}</p>
                                    <button className={styles.add_to_cart_btn}
                                        onClick={() => {
                                            setSelectedProduct(product)
                                            setData(product)
                                        }}>
                                        Edytuj
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Modal
                isOpen={selectedProduct !== null}
                onRequestClose={() => {
                    setSelectedProduct(null)
                }}
                contentLabel="Edycja produktu"
                className={styles.modal_content}
                overlayClassName={styles.modal_overlay}
            >
                <h2>Edytuj produkt {data.productName}</h2>
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
                    Opis produktu:
                    <input
                        type="text"
                        name="productDescription"
                        value={data.productDescription}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Cena:
                    <input
                        type="text"
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
                        <option value="Dania główne">Dania główne</option>
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
                <label>
                    Status:
                    <select name="productStatus" value={data.productStatus} onChange={handleChange} required>
                        <option value="">Wybierz status</option>
                        <option value="Dostępny">Dostępny</option>
                        <option value="Niedostępny">Niedostępny</option>
                    </select>
                </label>
                <button className={styles.btn_close} onClick={() => {
                    setSelectedProduct(null)
                }}>Zamknij</button>
                <button className={styles.btn_send} onClick={() => {
                    modifyProduct(data._id, data)
                    setSelectedProduct(null)
                }}>Prześlij</button>

            </Modal>

        </div>
    );
};

export default FoodPanel;