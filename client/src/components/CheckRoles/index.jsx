import { useState, useEffect } from "react";
import axios from "axios";

const CheckRoles = ({ children }) => {
  const [details, setDetails] = useState(null);

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

  useEffect(() => {
    handleGetUserDetails();
  }, []);
/*
  if (!details || details.roles !== "Admin") {
    return null;
  }*/

  // Render the child component with the details as a prop
  return children(details);
};

export default CheckRoles;
