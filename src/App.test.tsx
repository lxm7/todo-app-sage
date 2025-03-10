import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

// Mock the Carbon Typography component so that it just renders an <h1>
jest.mock("carbon-react/lib/components/typography", () => {
  return (props: { variant: string; children: React.ReactNode }) => (
    <h1>{props.children}</h1>
  );
});

// Mock the TodoList component to ensure focus on App's render logic
jest.mock("./components/TodoList", () => {
  return () => <div>Mock TodoList Component</div>;
});

describe("App component", () => {
  test("renders the header with 'Todo app' title", () => {
    render(<App />);
    // Look for a heading element (h1) with the text "Todo app"
    const header = screen.getByRole("heading", { level: 1 });
    expect(header).toHaveTextContent(/todo app/i);
  });

  test("renders the TodoList component", () => {
    render(<App />);
    // Our mocked TodoList renders the text "Mock TodoList Component"
    const todoListEl = screen.getByText("Mock TodoList Component");
    expect(todoListEl).toBeInTheDocument();
  });
});
