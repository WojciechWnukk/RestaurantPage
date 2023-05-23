export const calculateTotalPrice = (cartItems) => {
    const totalPrice = cartItems.reduce(
      (total, item) => total + parseFloat(item.price) * item.quantity,
      0
    );
    return totalPrice.toFixed(2);
  };
  