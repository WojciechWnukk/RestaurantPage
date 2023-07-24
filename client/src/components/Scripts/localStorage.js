export const loadCartItemsFromLocalStorage = (setCartItems) => {
  const storedCartItems = localStorage.getItem("cartItems");
  if (storedCartItems) {
    setCartItems(JSON.parse(storedCartItems));
  }
};

export const saveCartItemsToLocalStorage = (cartItems) => {
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
};
