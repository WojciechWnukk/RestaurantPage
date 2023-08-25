import React, { useState, useEffect } from "react";
import styles from "./styles.module.css"
import axios from "axios";
import NavigationForAdmin from "../NavigationForAdmin";
import CheckRoles from "../CheckRoles";

const AddEmployee = ({ handleLogout }) => {

  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    birthDate: "",
    pesel: "",
    gender: "",
    salary: "",
    hireDate: new Date().toISOString(),
  });
  const [dataUser, setDataUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    roles: "Employee",
  })
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (name === 'firstName' || name === 'lastName' || name === 'email') {
      setDataUser((prevDataUser) => ({
        ...prevDataUser,
        [name]: value,
      }));
    }
  };

  const addUser = async () => {
    try {
      const userUrl = `${process.env.REACT_APP_DEV_SERVER}/api/users`;
      console.log(dataUser)
      await axios.post(userUrl, dataUser);
      console.log("Użytkownik został dodany");
    } catch (error) {
      console.error("Błąd podczas dodawania użytkownika:", error.response.data);
      throw new Error("Błąd podczas dodawania użytkownika");
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `${process.env.REACT_APP_DEV_SERVER}/api/employees`
      const { data: res } = await axios.post(url, data)
      console.log(res.message)
      console.log(data)
      setSuccessMessage("Pracownik " + data.firstName + " został dodany")
      await addUser()

      setTimeout(() => {
        window.location.reload();
      }, 5000)

    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message)
      }
    }
    console.log(data);
  };

  return (
    <div className={styles.AddEmployee_container}>
      <CheckRoles>
        {(details) => {
          if (details && details.roles === "Admin") {
            return (
              <div>
                <NavigationForAdmin handleLogout={handleLogout} />
                <div>
                  <h2>Dodaj pracownika</h2>
                  <form onSubmit={handleSubmit}>
                    <label>
                      Imię:
                      <input
                        type="text"
                        name="firstName"
                        value={data.firstName}
                        onChange={handleChange}
                        required
                      />
                    </label>
                    <label>
                      Nazwisko:
                      <input
                        type="text"
                        name="lastName"
                        value={data.lastName}
                        onChange={handleChange}
                        required
                      />
                    </label>
                    <label>
                      Email:
                      <input
                        type="email"
                        name="email"
                        value={data.email}
                        onChange={handleChange}
                        required
                      />
                    </label>
                    <label>
                      Data urodzenia:
                      <input
                        type="date"
                        name="birthDate"
                        value={data.birthDate}
                        onChange={handleChange}
                        required
                      />
                    </label>
                    <label>
                      PESEL:
                      <input
                        type="text"
                        name="pesel"
                        value={data.pesel}
                        onChange={handleChange}
                        required
                      />
                    </label>
                    <label>
                      Płeć:
                      <select name="gender" value={data.gender} onChange={handleChange} required>
                        <option value="">Wybierz płeć</option>
                        <option value="Mężczyzna">Mężczyzna</option>
                        <option value="Kobieta">Kobieta</option>
                      </select>
                    </label>
                    <label>
                      Pensja:
                      <input
                        type="number"
                        name="salary"
                        value={data.salary}
                        onChange={handleChange}
                        required
                      />
                    </label>
                    <button type="submit">Dodaj pracownika</button>
                  </form>
                  {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
                </div>
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

export default AddEmployee;