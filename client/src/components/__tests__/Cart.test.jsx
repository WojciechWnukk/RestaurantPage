import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, BrowserRouter, Route, Routes } from "react-router-dom";
import renderer from "react-test-renderer";
import "@testing-library/jest-dom/extend-expect";
import "jest-localstorage-mock";
import Cart from "../Cart";

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
  

describe(Cart, () => {
    it("renders correctly", () => {
        const tree = renderer
            .create(
                <MemoryRouter>
                    <Cart />
                </MemoryRouter>
            )
            .toJSON();
        //expect(tree).toMatchSnapshot();
    });

    it("renders without errors", () => {
        render(
            <MemoryRouter>
                <Cart />
            </MemoryRouter>
        );
        // Sprawdź, czy komponent renderuje się poprawnie
        expect(screen.getByText("Koszyk")).toBeInTheDocument();
    }
    );

    it("renders text for empty cart", () => {
        render(
            <MemoryRouter>
                <Cart />
            </MemoryRouter>
        );
        // Sprawdź, czy komponent renderuje się poprawnie
        expect(screen.getByText("Najpierw coś dodaj do koszyka! :D")).toBeInTheDocument();
    }
    );

    it("renders cartItems from localStorage", () => {
        localStorage.setItem("cartItems", JSON.stringify([{productCategory: "Przystawki", productDescription: "Dobre", productImage: "https://i.imgur.com/WuY0TiL.jpg", productName: "Sałatka testowa", productPrice: "13.99", productStatus: "Dostępny", quantity: 1, _id: "64c10ee97b20e9fd1007f4c9", __v: 0}]));
        render(
            <MemoryRouter>
                <Cart />
            </MemoryRouter>
        );
        // Sprawdź, czy komponent renderuje się poprawnie
        expect(screen.getByText("Sałatka testowa")).toBeInTheDocument();
    }
    );

    it("increases and decreases quantity of product", () => {
        localStorage.setItem("cartItems", JSON.stringify([{productCategory: "Przystawki", productDescription: "Dobre", productImage: "https://i.imgur.com/WuY0TiL.jpg", productName: "Sałatka testowa", productPrice: "13.99", productStatus: "Dostępny", quantity: 1, _id: "64c10ee97b20e9fd1007f4c9", __v: 0}]));
        render(
            <MemoryRouter>
                <Cart />
            </MemoryRouter>
        );
        const increaseButton = screen.getByText("+");
        const decreaseButton = screen.getByText("-");
        expect(screen.getByText("Ilość: 1")).toBeInTheDocument();
        expect(screen.getByText("Całkowita cena: 13.99zł")).toBeInTheDocument()
        fireEvent.click(increaseButton);
        expect(screen.getByText("Ilość: 2")).toBeInTheDocument();
        expect(screen.getByText("Całkowita cena: 27.98zł")).toBeInTheDocument()
        fireEvent.click(decreaseButton);
        expect(screen.getByText("Ilość: 1")).toBeInTheDocument();
        expect(screen.getByText("Całkowita cena: 13.99zł")).toBeInTheDocument()
    }
    );

    it("removes product from cart", () => {
        localStorage.setItem("cartItems", JSON.stringify([{productCategory: "Przystawki", productDescription: "Dobre", productImage: "https://i.imgur.com/WuY0TiL.jpg", productName: "Sałatka testowa", productPrice: "13.99", productStatus: "Dostępny", quantity: 1, _id: "64c10ee97b20e9fd1007f4c9", __v: 0}]));
        render(
            <MemoryRouter>
                <Cart />
            </MemoryRouter>
        );
        // Sprawdź, czy komponent renderuje się poprawnie
        const removeButton = screen.getByText("Usuń z koszyka");
        expect(screen.getByText("Sałatka testowa")).toBeInTheDocument();
        fireEvent.click(removeButton);
        expect(screen.queryByText("Sałatka testowa")).not.toBeInTheDocument();
    })

    it("renders empty cart after removing last product", () => {
        localStorage.setItem("cartItems", JSON.stringify([{productCategory: "Przystawki", productDescription: "Dobre", productImage: "https://i.imgur.com/WuY0TiL.jpg", productName: "Sałatka testowa", productPrice: "13.99", productStatus: "Dostępny", quantity: 1, _id: "64c10ee97b20e9fd1007f4c9", __v: 0}]));
        render(
            <MemoryRouter>
                <Cart />
            </MemoryRouter>
        );
        // Sprawdź, czy komponent renderuje się poprawnie
        const removeButton = screen.getByText("Usuń z koszyka");
        expect(screen.getByText("Sałatka testowa")).toBeInTheDocument();
        fireEvent.click(removeButton);
        expect(screen.queryByText("Sałatka testowa")).not.toBeInTheDocument();
        expect(screen.getByText("Najpierw coś dodaj do koszyka! :D")).toBeInTheDocument();
    })



})