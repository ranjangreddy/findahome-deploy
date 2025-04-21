import React from 'react';
import { render, screen } from '@testing-library/react';
import PostProperty from '../components/PostProperty';
import { BrowserRouter } from 'react-router-dom';

describe('PostProperty Component', () => {
  test('renders the initial step with "Property Details" and disables Next button when fields are empty', () => {
    render(
      <BrowserRouter>
        <PostProperty />
      </BrowserRouter>
    );

    // Check the first step header
    expect(screen.getByText(/Property Details/i)).toBeInTheDocument();

    // Ensure required inputs are present
    expect(screen.getByPlaceholderText(/Enter property name/i)).toBeInTheDocument();

    // Next button should be disabled initially
    expect(screen.getByRole('button', { name: /Next Step/i })).toBeDisabled();
  });
});