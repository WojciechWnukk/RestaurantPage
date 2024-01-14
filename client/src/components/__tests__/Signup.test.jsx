import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, BrowserRouter, Route, Routes } from "react-router-dom";
import renderer from "react-test-renderer";
import "@testing-library/jest-dom/extend-expect";
import "jest-localstorage-mock";
import { act } from "react-dom/test-utils";
import Signup from "../Signup";

describe(Signup, () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <Signup />
        </MemoryRouter>
      )
      .toJSON();
    //expect(tree).toMatchSnapshot();
  });

  it("renders without errors", () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );
    // Sprawdź, czy komponent renderuje się poprawnie
    expect(screen.getByText("Witamy ponownie")).toBeInTheDocument();
  });

  it("updates input fields on user input", () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );
    const firstNameInput = screen.getByPlaceholderText("Imię");
    const lastNameInput = screen.getByPlaceholderText("Nazwisko");
    const phoneNumberInput = screen.getByPlaceholderText("Numer telefonu");
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Hasło");

    fireEvent.change(firstNameInput, { target: { value: "Jan" } });
    fireEvent.change(lastNameInput, { target: { value: "Kowalski" } });
    fireEvent.change(phoneNumberInput, { target: { value: "123456789" } });
    fireEvent.change(emailInput, { target: { value: "kowal@wp.pl" } });
    fireEvent.change(passwordInput, { target: { value: "kowal123" } });

    expect(firstNameInput.value).toBe("Jan");
    expect(lastNameInput.value).toBe("Kowalski");
    expect(phoneNumberInput.value).toBe("123456789");
    expect(emailInput.value).toBe("kowal@wp.pl");
    expect(passwordInput.value).toBe("kowal123");
  });

  it("renders error message if user input is invalid", () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );
    const firstNameInput = screen.getByPlaceholderText("Imię");
    const lastNameInput = screen.getByPlaceholderText("Nazwisko");
    const phoneNumberInput = screen.getByPlaceholderText("Numer telefonu");
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Hasło");

    fireEvent.change(firstNameInput, { target: { value: "Jan" } });
    fireEvent.change(lastNameInput, { target: { value: "Kowalski" } });
    fireEvent.change(phoneNumberInput, { target: { value: "123456789" } });
    fireEvent.change(emailInput, { target: { value: "kowal@kowal.pl" } });
    fireEvent.change(passwordInput, { target: { value: "kowal123" } });

    fireEvent.click(screen.getByTestId("submit-btn"));

    setTimeout(() => {
      expect(screen.getByTestId("error_msg")).toBeInTheDocument();
    }, 500);
  });

    it("redirects to login page if user input is valid", () => {
        render(
        <MemoryRouter>
            <Signup />
        </MemoryRouter>
        );
        const firstNameInput = screen.getByPlaceholderText("Imię");
        const lastNameInput = screen.getByPlaceholderText("Nazwisko");
        const phoneNumberInput = screen.getByPlaceholderText("Numer telefonu");
        const emailInput = screen.getByPlaceholderText("Email");
        const passwordInput = screen.getByPlaceholderText("Hasło");
    
        fireEvent.change(firstNameInput, { target: { value: "Jan" } });
        fireEvent.change(lastNameInput, { target: { value: "Kowalski" } });
        fireEvent.change(phoneNumberInput, { target: { value: "123456789" } });
        fireEvent.change(emailInput, { target: { value: "Kowalski@kowalskki.pl" } });
        fireEvent.change(passwordInput, { target: { value: "Kowal123" } });

        fireEvent.click(screen.getByTestId("submit-btn"));

        setTimeout(() => {
            expect(screen.getByTestId("login")).toBeInTheDocument();
        }, 500);

    }
    );



});
