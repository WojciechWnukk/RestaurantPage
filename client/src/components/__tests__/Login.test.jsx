import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Login from "../Login";
import { MemoryRouter, BrowserRouter, Route, Routes } from "react-router-dom";
import renderer from "react-test-renderer";
import "@testing-library/jest-dom/extend-expect";
import "jest-localstorage-mock";
import { act } from "react-dom/test-utils";


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
    const { container, getByText } = render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element="SignUp page" />
        </Routes>
      </MemoryRouter>
    );

    // Kliknij przycisk "Zarejestruj"
    const registerButton = getByText("Zarejestruj");
    fireEvent.click(registerButton);

    // Sprawdź, czy użytkownik został przekierowany na stronę /signup
    expect(container.innerHTML).toContain("SignUp page");
  });

  it("redirects to main page after successful", async () => {
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

    const loginButton = getByText("Zaloguj");
    await act(async () => {
      fireEvent.click(loginButton);
    });
    expect(window.location.pathname).toBe("/");
});
});
