import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import SearchBar from "../SearchBar";

describe("SearchBar", () => {
  it("renders input and search button", () => {
    render(<SearchBar />);
    expect(screen.getByPlaceholderText(/Search food name/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
  });

  it("shows result text with highlighted query after clicking search", () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText(/Search food name/i);
    const button = screen.getByRole("button", { name: /search/i });

    fireEvent.change(input, { target: { value: "Chicken" } });
    fireEvent.click(button);

    expect(screen.getByText(/Show result for:/i)).toBeInTheDocument();
    const highlighted = screen.getByText("Chicken");
    expect(highlighted).toBeInTheDocument();
    expect(highlighted).toHaveClass("bg-yellow-200");
  });
});

