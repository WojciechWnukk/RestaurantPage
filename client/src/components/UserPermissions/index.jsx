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
  const [isEmployee, setIsEmployee] = useState(null)
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
          url: `${process.env.REACT_APP_DEV_SERVER}/api/users/`,
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
          url: `${process.env.REACT_APP_DEV_SERVER}/api/employees/`,
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        };
        const { data: res } = await axios(config);

        // Convert birthDate format before setting in state
        const employeesWithFormattedDate = res.data.map((employee) => ({
          ...employee,
          birthDate: new Date(employee.birthDate).toISOString().split("T")[0],
        }));

        setEmployees(employeesWithFormattedDate);
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

  const deleteUser = async (userId, userEmail, userRole) => {
    let confirmed = false
    if (userRole === "Employee") {
      setIsEmployee(true)
      confirmed = window.confirm("Czy na pewno chcesz usunąć konto? Uwaga usuwasz też pracownika")
    } else {
      confirmed = window.confirm("Czy na pewno chcesz usunąć konto?")
    }
    if (confirmed) {
      if (userId) {
        try {
          const token = localStorage.getItem("token");

          const config = {
            method: 'delete',
            url: `${process.env.REACT_APP_DEV_SERVER}/api/users/${userId}`,
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': token
            }
          }
          await axios(config)
          console.log("Usunieto konto usera")
          if (userRole === "Employee") { //delete user with role empl -> delete user & empl
            setIsEmployee(true)
            const findEmployee = employees.find((employee) => employee.email === userEmail)
            await deleteEmployee(findEmployee._id)
            console.log("Usunieto empl")
          }
          handleGetUsers()
          handleGetEmployees()
        } catch (error) {

        }
      }
    }

  }

  const deleteEmployee = async (employeeId, employeeEmail, control) => {
    let confirmed = false
    if (!isEmployee || control) {
      confirmed = window.confirm("Czy na pewno chcesz zwolnić pracownika?")
    } else {
      confirmed = true
    }
    if (confirmed) {
      if (employeeId) {
        try {
          const response = await axios.delete(`${process.env.REACT_APP_DEV_SERVER}/api/employees/${employeeId}`)
          if (control === true) { //delete empl -> change roles empl->user
            const findUser = users.find((user) => user.email === employeeEmail)
            const newRoles = { ...findUser, roles: "User" }
            modifyUser(findUser._id, newRoles)
          }
          handleGetEmployees()
          handleGetUsers()
        } catch (error) {

        } finally {
          setIsEmployee(false)
        }
      }
    }
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

      if (modifyUser.roles === "User") { //if roles empl->user = delete from empl
        const orginalUser = users.find((user) => user._id === userId)
        if (orginalUser && orginalUser.roles === "Employee") {
          const findEmployee = employees.find((employee) => employee.email === orginalUser.email)
          deleteEmployee(findEmployee._id)
        }
      } else if (modifyUser.roles === "Employee") { //from user role to empl
        const orginalUser = users.find((user) => user._id === userId)
        if (orginalUser && orginalUser.roles === "User") {
          const confirmed = window.confirm("Czy na pewno chcesz dodać pracownika?")
          if (confirmed) {
            addEmployee(dataPerson)
          }
        }
      }


      await axios.put(
        `${process.env.REACT_APP_DEV_SERVER}/api/users/${userId}`,
        {
          firstName: modifyUser.firstName,
          lastName: modifyUser.lastName,
          phoneNumber: modifyUser.phoneNumber,
          email: modifyUser.email,
          password: modifyUser.password,
          roles: modifyUser.roles
        }
      )
      handleGetUsers()
      handleGetEmployees()
    } catch (error) {
      console.error("Error updating user")
    }
  }

  const modifyEmployee = async (employeeId, modifyEmployee) => {
    console.log(employeeId)
    try {
      await axios.put(
        `${process.env.REACT_APP_DEV_SERVER}/api/employees/${employeeId}`,
        {
          firstName: modifyEmployee.firstName,
          lastName: modifyEmployee.lastName,
          phoneNumber: modifyEmployee.phoneNumber,
          email: modifyEmployee.email,
          birthDate: modifyEmployee.birthDate,
          pesel: modifyEmployee.pesel,
          salary: modifyEmployee.salary
        }
      )
      handleGetEmployees()
    } catch (error) {
      console.error("Error updating employee")
    }
  }

  const addEmployee = async (dataPerson) => {
    try {
      const { password, roles, _id, __v, points, ...dataWithoutPassword } = dataPerson; //usuwanie danych używanych dla kolekcji user które nie mają zastosowania w empl

      const newDataPerson = {
        ...dataWithoutPassword,
        hireDate: new Date().toISOString()
      };
      console.log("new ", newDataPerson)
      const url = `${process.env.REACT_APP_DEV_SERVER}/api/employees`
      const { newDataPerson: res } = await axios.post(url, newDataPerson)
      console.log(res.message)

    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {

      }
    }
  };

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
                            <td><button className={`${styles.edit_btn} link_btn`} onClick={() => {
                              setSelectedPerson(user._id)
                              setDataPerson(user)
                            }}>Edytuj</button></td>
                            <td><button className={`${styles.link_btn} link_btn`} onClick={() => deleteUser(user._id, user.email, user.roles)}>Usuń konto</button></td>
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
                            <td><button className={`${styles.edit_btn} link_btn`} onClick={() => {
                              setSelectedEmployee(employee._id)
                              setDataEmployee(employee)
                            }}>Edytuj</button></td>
                            <td><button className={`${styles.link_btn} link_btn`} onClick={() => deleteEmployee(employee._id, employee.email, true)}>Usuń konto</button></td>
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
          Numer telefonu:
          <input
            type="text"
            name="phoneNumber"
            value={dataPerson.phoneNumber}
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
        <label>
          Roles: <br></br>
          <select name="roles" value={dataPerson.roles} onChange={handleChange} required>
            <option value="">Wybierz uprawnienia</option>
            <option value="User">Użytkownik</option>
            <option value="Employee">Pracownik</option>
            <option value="Admin">Admin</option>
          </select>
        </label>
        {dataPerson.roles === "Employee" && (
          <>
            <label>
              Data urodzenia:<br></br>
              <input
                type="date"
                name="birthDate"
                value={dataPerson.birthDate || ''}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              PESEL:
              <input
                type="text"
                name="pesel"
                value={dataPerson.pesel || ''}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Płeć:<br></br>
              <select name="gender" value={dataPerson.gender} onChange={handleChange} required>
                <option value="">Wybierz płeć</option>
                <option value="Mężczyzna">Mężczyzna</option>
                <option value="Kobieta">Kobieta</option>
              </select>
            </label>
            <label>
              Pensja:<br></br>
              <input
                type="number"
                name="salary"
                value={dataPerson.salary || ''}
                onChange={handleChange}
                required
              />
            </label>

          </>
        )}
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
          Numer telefonu:
          <input
            type="text"
            name="phoneNumber"
            value={dataEmployee.phoneNumber}
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
          Data urodzenia: <br></br>
          <input
            type="date"
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
          modifyEmployee(dataEmployee._id, dataEmployee)
          setSelectedEmployee(null)
        }}>Prześlij</button>
      </Modal>
    </div>
  );
};

export default UserPermissions;