import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchBar from '../SearchBar';

describe('SearchBar', () => {
  it('renders the search form with input and button', () => {
    render(<SearchBar />);

    expect(screen.getByRole('searchbox', { name: /search meal plans by food name/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('shows result text after searching a matching meal', () => {
    render(<SearchBar />);

    const input = screen.getByRole('searchbox', { name: /search meal plans by food name/i });
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'Chicken' } });
    fireEvent.click(button);

    expect(screen.getByText(/show result for:/i)).toBeInTheDocument();
    expect(screen.getByText('Chicken')).toBeInTheDocument();
  });

  it('shows not found text when there is no matching meal', () => {
    render(<SearchBar />);

    fireEvent.change(screen.getByRole('searchbox', { name: /search meal plans by food name/i }), {
      target: { value: 'Unicorn' },
    });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(screen.getByText(/no results found for:/i)).toBeInTheDocument();
    expect(screen.getByText('Unicorn')).toBeInTheDocument();
  });

  it('shows an error message when the input is empty', () => {
    render(<SearchBar />);

    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(screen.getByText(/please enter a food name to search./i)).toBeInTheDocument();
  });
});
