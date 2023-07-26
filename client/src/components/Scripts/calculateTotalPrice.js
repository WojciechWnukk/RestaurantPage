export const calculateTotalPrice = (cartItems) => {
  const totalPrice = cartItems.reduce(
    (total, item) => total + parseFloat(item.productPrice) * item.quantity,
    0
  );
  return totalPrice.toFixed(2);
};
