import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";


test("App test", () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
});