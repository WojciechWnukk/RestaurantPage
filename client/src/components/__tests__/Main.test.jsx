import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Main from "../Main";
import { MemoryRouter, BrowserRouter, Route, Routes } from "react-router-dom";
import renderer from "react-test-renderer";
import "@testing-library/jest-dom/extend-expect";
import "jest-localstorage-mock";

describe(Main, () => {
    it("renders correctly", () => {
        const tree = renderer
            .create(
                <MemoryRouter>
                    <Main />
                </MemoryRouter>
            )
            .toJSON();
        //expect(tree).toMatchSnapshot();
    });

    it("renders without errors", () => {
        render(
            <MemoryRouter>
                <Main />
            </MemoryRouter>
        );
        // Sprawdź, czy komponent renderuje się poprawnie
        expect(screen.getByText("Napoje")).toBeInTheDocument();
        expect(screen.getByText("Rezerwacje")).toBeInTheDocument();
    });

    /*
    it("adds item to cart", () => {
        render(
            <MemoryRouter>
                <Main />
            </MemoryRouter>
        );
        // Pobierz przycisk "Biorę!"
        const productName = "Sałatka"; // Zastąp to nazwą produktu, który chcesz dodać
        const addToCartBtn = screen.getByText(`Biorę!`, { exact: false, selector: 'button' });
      
        // Kliknij przycisk "Biorę!"
        fireEvent.click(addToCartBtn);
      

        // Sprawdź, czy komponent renderuje się poprawnie
        expect(screen.getByText("Koszyk (\n1\n)")).toBeInTheDocument();
    }
    );
*/

})