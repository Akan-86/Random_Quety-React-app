import { render, screen } from "@testing-library/react";
import App from "./App";
import { QuoteProvider } from "./QuoteContext";

test("renders Next quote button", () => {
  render(
    <QuoteProvider>
      <App />
    </QuoteProvider>
  );
  const buttonElement = screen.getByText(/Next quote/i);
  expect(buttonElement).toBeInTheDocument();
});
