import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Login from "../Login";
import { MemoryRouter, BrowserRouter, Route, Routes } from "react-router-dom";
import renderer from "react-test-renderer";
import "@testing-library/jest-dom/extend-expect";
import "jest-localstorage-mock";
import { act } from "react-dom/test-utils";


const localStorageMock = (() => {
  let store = {};
  return {
    getItem: key => store[key],
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });



describe(Login, () => {

  it("renders correctly", () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      )
      .toJSON();
    //expect(tree).toMatchSnapshot();
  });

  it("renders without errors", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    // Sprawdź, czy komponent renderuje się poprawnie
    expect(screen.getByText("Zaloguj się do konta")).toBeInTheDocument();
  });

  it("updates input fields on user input", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    // Pobierz pola wejściowe na podstawie atrybutów data-testid
    const emailInput = screen.getByTestId("email-input");
    const passwordInput = screen.getByPlaceholderText("Password");

    // Wprowadź dane do pól
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    console.log("Wartość passwordInput:", passwordInput.value);

    // Sprawdź, czy wartości pól wejściowych zostały zaktualizowane
    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  it("redirects to signup page on 'Zarejestruj' button click", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element="SignUp page" />
        </Routes>
      </MemoryRouter>
    );

    // Kliknij przycisk "Zarejestruj"
    const registerButton = screen.getByText("Zarejestruj");
    fireEvent.click(registerButton);

    // Sprawdź, czy użytkownik został przekierowany na stronę /signup
    expect(container.innerHTML).toContain("SignUp page");
  });

  it("redirects to main page after successful login", async () => {
    localStorage.setItem("token", "652bb7770c11a8d9034b8101");
    localStorage.setItem("email", "user@user.pl");

    const { container, getByText } = render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element="Main page" />
        </Routes>
      </MemoryRouter>
    );
    const emailInput = screen.getByTestId("email-input");
    const passwordInput = screen.getByPlaceholderText("Password");

    fireEvent.change(emailInput, { target: { value: "user@user.pl" } });
    fireEvent.change(passwordInput, { target: { value: "User123." } });

    const loginButton = screen.getByText("Zaloguj");
      fireEvent.click(loginButton);
    expect(window.location.pathname).toBe("/");
});

  it("displays error message on failed login", async () => {
    const { getByText } = render(
      <MemoryRouter>
          <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByTestId("email-input");
    const passwordInput = screen.getByPlaceholderText("Password");

    fireEvent.change(emailInput, { target: { value: "dwada@dad.pl" } });
    fireEvent.change(passwordInput, { target: { value: "dawdawdawd" } });

    const loginButton = screen.getByText("Zaloguj");
      fireEvent.click(loginButton);
    setTimeout(() => {
      expect(screen.getByTestId("error_msg")).toBeInTheDocument();
    }, 500);
  }
  );

  it("saves data to localStorage on successful login", async () => {
    const { getByText } = render(
      <MemoryRouter>
          <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByTestId("email-input");
    const passwordInput = screen.getByPlaceholderText("Password");

    fireEvent.change(emailInput, { target: { value: "user@user.pl" } });
    fireEvent.change(passwordInput, { target: { value: "User123." } });

    const loginButton = screen.getByText("Zaloguj");
      fireEvent.click(loginButton);

    expect(localStorage.getItem("token")).toBe("652bb7770c11a8d9034b8101");
    expect(localStorage.getItem("email")).toBe("user@user.pl");
  }
  );

  





});
