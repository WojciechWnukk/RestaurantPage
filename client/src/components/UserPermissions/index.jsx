import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import axios from "axios";
import NavigationForAdmin from "../NavigationForAdmin";
import CheckRoles from "../CheckRoles";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";


const UserPermissions = ({ handleLogout }) => {
  const [users, setUsers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showUsers, setShowUsers] = useState(true)
  const [selectedPerson, setSelectedPerson] = useState(null)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [dataPerson, setDataPerson] = useState({})
  const [dataEmployee, setDataEmployee] = useState({})
  const navigate = useNavigate()

  const handleNavigation = (path) => {
    navigate(path);
  }
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

  const handleGetEmployees = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const config = {
          method: "get",
          url: "http://localhost:8080/api/employees/",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        };
        const { data: res } = await axios(config);
        setEmployees(res.data);
      } catch (error) {
        if (
          error.response &&
          error.response.status >= 400 &&
          error.response.status <= 500
        ) {
          console.log("Error przy wyświetlaniu emplo")
        }
      }
    }
  };

  const deleteUser = async (userId) => {
    const confirmed = window.confirm("Czy na pewno chcesz usunąć konto?")

    if (confirmed) {

      if (userId) {
        try {
          const token = localStorage.getItem("token");

          const config = {
            method: 'delete',
            url: `http://localhost:8080/api/users/${userId}`,
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': token
            }
          }

          await axios(config)
          console.log("Usunieto konto")
        } catch (error) {

        }
      }
      window.location.reload()
    }

  }

  const deleteEmployee = async (employeeId) => {

  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataPerson((prevData) => ({
      ...prevData,
      [name]: value,
    }))
    setDataEmployee((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const modifyUser = async (userId, modifyUser) => {
    console.log(userId)
    try {
        await axios.put(
            `http://localhost:8080/api/users/${userId}`,
            { 
                firstName: modifyUser.firstName,
                lastName: modifyUser.lastName,
                email: modifyUser.email,
                password: modifyUser.password,
                roles: modifyUser.roles
            }
        )
        handleGetUsers()
    } catch (error) {
        console.error("Error updating product")
    }
}


  useEffect(() => {
    handleGetEmployees()
    handleGetUsers()
  }, []);

  return (
    <div className={styles.permissions_container}>
      <CheckRoles>
        {(details) => {
          if (details && details.roles === "Admin") {
            return (
              <div>
                <NavigationForAdmin handleLogout={handleLogout} />

                <button
                  className={styles.link_btn}
                  onClick={() => setShowUsers(!showUsers)}
                >
                  {showUsers ? "Pokaż pracowników" : "Pokaż użytkowników"}
                </button>
                {showUsers ? (
                  <div>
                    <h2>Lista użytkowników</h2>
                    <table className={styles.permissions_table}>
                      <thead>
                        <tr>
                          <th>Imię i nazwisko</th>
                          <th>Email</th>
                          <th>Uprawnienia</th>
                          <th>Edytuj</th>
                          <th>Usuń</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user._id}>
                            <td>{user.firstName} {user.lastName}</td>
                            <td>{user.email}</td>
                            <td>{user.roles}</td>
                            <td><button className={`${styles.edit_btn} link_btn`} onClick={() => 
                              {
                                setSelectedPerson(user._id)
                                setDataPerson(user)
                              }}>Edytuj</button></td>
                            <td><button className={`${styles.link_btn} link_btn`} onClick={() => deleteUser(user._id)}>Usuń konto</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div>
                    <h2>Lista pracowników</h2>
                    <button className={`${styles.link_btn} link_btn`} onClick={() => handleNavigation("/add-employee")}>
                      Dodaj pracownika
                    </button>
                    <table className={styles.permissions_table}>
                      <thead>
                        <tr>
                          <th>Imię i nazwisko</th>
                          <th>Email</th>
                          <th>Pensja</th>
                          <th>Edytuj</th>
                          <th>Usuń</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employees.map((employee) => (
                          <tr key={employee._id}>
                            <td>{employee.firstName} {employee.lastName}</td>
                            <td>{employee.email}</td>
                            <td>{employee.salary + " zł"}</td>
                            <td><button className={`${styles.edit_btn} link_btn`} onClick={() => 
                              {
                                setSelectedEmployee(employee._id)
                                setDataEmployee(employee)
                              }}>Edytuj</button></td>
                            <td><button className={`${styles.link_btn} link_btn`} onClick={() => deleteEmployee(employee._id)}>Usuń konto</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          } else {
            return "Brak uprawnień";
          }
        }}
      </CheckRoles>
      <Modal
        isOpen={selectedPerson !== null}
        onRequestClose={() => {
          setSelectedPerson(null)
        }}
        contentLabel="Edycja Klienta"
        className={styles.modal_content}
        overlayClassName={styles.modal_overlay}
      >
        <h2>Edytuj dane o kliencie!</h2>
        <label>
          Imie:
          <input
            type="text"
            name="firstName"
            value={dataPerson.firstName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Nazwisko:
          <input
            type="text"
            name="lastName"
            value={dataPerson.lastName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="text"
            name="email"
            value={dataPerson.email}
            onChange={handleChange}
            required
          />
        </label>
        {/*
        <label>
          Hasło:
          <input
            type="text"
            name="password"
            value={dataPerson.password}
            onChange={handleChange}
            required
          />
      </label>*/}
        <label>
          Roles - select
          <input
            type="text"
            name="Roles"
            value={dataPerson.roles}
            onChange={handleChange}
            required
          />
        </label>
        <button className={styles.btn_close} onClick={() => {
          setSelectedPerson(null)
        }}>Zamknij</button>
        <button className={styles.btn_send} onClick={() => {
          modifyUser(dataPerson._id, dataPerson)
          setSelectedPerson(null)
        }}>Prześlij</button>
      </Modal>

      <Modal
        isOpen={selectedEmployee !== null}
        onRequestClose={() => {
          setSelectedEmployee(null)
        }}
        contentLabel="Edycja Pracownika"
        className={styles.modal_content}
        overlayClassName={styles.modal_overlay}
      >
        <h2>Edytuj dane o pracowniku!</h2>
        <label>
          Imie:
          <input
            type="text"
            name="firstName"
            value={dataEmployee.firstName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Nazwisko:
          <input
            type="text"
            name="lastName"
            value={dataEmployee.lastName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="text"
            name="email"
            value={dataEmployee.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Data urodzenia:
          <input
            type="text"
            name="birthDate"
            value={dataEmployee.birthDate}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Pesel:
          <input
            type="text"
            name="pesel"
            value={dataEmployee.pesel}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Pensja:
          <input
            type="text"
            name="salary"
            value={dataEmployee.salary}
            onChange={handleChange}
            required
          />
        </label>
        <button className={styles.btn_close} onClick={() => {
          setSelectedEmployee(null)
        }}>Zamknij</button>
        <button className={styles.btn_send} onClick={() => {
          setSelectedEmployee(null)
        }}>Prześlij</button>
      </Modal>
    </div>
  );
};

export default UserPermissions;