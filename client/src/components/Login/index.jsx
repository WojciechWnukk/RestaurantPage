import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import ServerAvailability from "../Scripts/ServerAvailability";

const Login = () => {
  const navigate = useNavigate()
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `${process.env.REACT_APP_DEV_SERVER}/api/auth`;
      const { data: res } = await axios.post(url, data);
      localStorage.setItem("token", res.data);
      localStorage.setItem("email", data.email);
      navigate("/")
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
  };
  return (
    <div className={styles.login_container}>
      <div>
        <ServerAvailability></ServerAvailability>
      </div>
      <div className={styles.login_form_container}>
        <div className={styles.left}>
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <h1>Zaloguj się do konta</h1>
            <input
              type="email"
              data-testid="email-input"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={data.email}
              required
              className={styles.input}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={data.password}
              required
              className={styles.input}
            />
            {error && <div data-testid="error_msg" className={styles.error_msg}>{error}</div>}
            <button
              data-testid="login-button"
              type="submit"
              className={styles.green_btn}
              >
              Zaloguj
            </button>
            Dane logowania do kont testowych: Admin@admin.pl Admin123.
            user@user.pl User123.
          </form>
        </div>
        <div className={styles.right}>
          <h1>Nie masz konta?</h1>
          <Link to="/signup">
            <button type="button" className={styles.white_btn}>
              Zarejestruj
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Login;
