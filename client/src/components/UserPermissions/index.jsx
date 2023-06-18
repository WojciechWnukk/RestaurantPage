import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import Navigation from "../Navigation";
import axios from "axios";
import NavigationForAdmin from "../NavigationForAdmin";
import CheckRoles from "../CheckRoles";

const UserPermissions = ({ handleLogout }) => {
  const [users, setUsers] = useState([]);

  const handleGetUsers = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const config = {
          method: "get",
          url: "http://localhost:8080/api/users/",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        };
        const { data: res } = await axios(config);
        setUsers(res.data);
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
    handleGetUsers();
  }, []);

  return (
    <div className={styles.permissions_container}>
      <CheckRoles>
        {(details) => {
          if (details && details.roles === "Admin") {
            return (
              <div>
                <NavigationForAdmin handleLogout={handleLogout} />
                <h2>User List</h2>
                <table className={styles.permissions_table}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Roles</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td>{user.firstName} {user.lastName}</td>
                        <td>{user.email}</td>
                        <td>{user.roles}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          } else {
            return "Brak uprawnień";
          }
        }}
      </CheckRoles>
    </div>
  );
};

export default UserPermissions;