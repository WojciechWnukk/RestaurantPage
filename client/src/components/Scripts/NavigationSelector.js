import React from "react";
import Navigation from "../Navigation";
import NavigationForAdmin from "../NavigationForAdmin";
import NavigationNoAcc from "../NavigationNoAcc";

const NavigationSelector = ({
  details,
  cartItems,
  quantity,
  handleLogout,
  token,
}) => {
  if (details && details.roles === "Admin") {
    return (
      <NavigationForAdmin handleLogout={handleLogout} quantity={quantity} />
    );
  } else if (details) {
    return (
      <Navigation
        cartItemCount={cartItems ? cartItems.length : 0}
        handleLogout={handleLogout}
        quantity={quantity}
      />
    );
  } else if (!token) {
    return (
      <NavigationNoAcc
        cartItemCount={cartItems ? cartItems.length : 0}
        quantity={quantity}
      />
    );
  }
  return null;
};

export default NavigationSelector;
