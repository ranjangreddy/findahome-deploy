import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SignUp from '../components/SignUp';
import React from 'react';

test('renders and completes signup form including confirm password', () => {
  render(
    <MemoryRouter>
      <SignUp />
    </MemoryRouter>
  );

  const firstNameInput = screen.getByPlaceholderText('First Name') as HTMLInputElement;
  const lastNameInput = screen.getByPlaceholderText('Last Name') as HTMLInputElement;
  const emailInput = screen.getByPlaceholderText('Email ID') as HTMLInputElement;
  const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement;
  const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password') as HTMLInputElement;
  const signUpButton = screen.getByRole('button', { name: /sign up/i });

  fireEvent.change(firstNameInput, { target: { value: 'Alice' } });
  fireEvent.change(lastNameInput, { target: { value: 'Wonderland' } });
  fireEvent.change(emailInput, { target: { value: 'alice@example.com' } });
  fireEvent.change(passwordInput, { target: { value: 'alicepwd' } });
  fireEvent.change(confirmPasswordInput, { target: { value: 'alicepwd' } });
  fireEvent.click(signUpButton);

  expect(firstNameInput.value).toBe('Alice');
  expect(lastNameInput.value).toBe('Wonderland');
  expect(emailInput.value).toBe('alice@example.com');
  expect(passwordInput.value).toBe('alicepwd');
  expect(confirmPasswordInput.value).toBe('alicepwd');
});
