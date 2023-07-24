import React from "react";
import Navigation from "../Navigation";
import NavigationForAdmin from "../NavigationForAdmin";
import NavigationNoAcc from "../NavigationNoAcc";

const NavigationSelector = ({ details, cartItems, handleLogout, token }) => {
  if (details && details.roles === "Admin") {
    return <NavigationForAdmin handleLogout={handleLogout} />;
  } else if (details) {
    return <Navigation cartItemCount={cartItems ? cartItems.length : 0} handleLogout={handleLogout} />;
  } else if (!token) {
    return <NavigationNoAcc cartItemCount={cartItems ? cartItems.length : 0} />;
  }
  return null;
};


export default NavigationSelector;
