// src/components/__tests__/LoginForm.test.jsx - LoginForm component tests

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '../LoginForm';

describe('LoginForm', () => {
  it('should render login form', () => {
    const mockOnSuccess = vi.fn();
    render(<LoginForm onSuccess={mockOnSuccess} />);

    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
  });

  it('should validate email field', async () => {
    const mockOnSuccess = vi.fn();
    render(<LoginForm onSuccess={mockOnSuccess} />);

    const form = screen.getByText('Sign In').closest('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument();
    });
  });

  it('should validate password field', async () => {
    const mockOnSuccess = vi.fn();
    render(<LoginForm onSuccess={mockOnSuccess} />);

    const emailInput = screen.getByPlaceholderText('your@email.com');
    await userEvent.type(emailInput, 'test@example.com');

    const form = screen.getByText('Sign In').closest('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText(/Password must be at least 8 characters/i)).toBeInTheDocument();
    });
  });

  it('should call onSuccess when form is submitted with valid data', async () => {
    const mockOnSuccess = vi.fn();
    render(<LoginForm onSuccess={mockOnSuccess} />);

    const emailInput = screen.getByPlaceholderText('your@email.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');

    const submitButton = screen.getByText('Sign In');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('should display remember me checkbox', () => {
    const mockOnSuccess = vi.fn();
    render(<LoginForm onSuccess={mockOnSuccess} />);

    expect(screen.getByLabelText(/Remember me/i)).toBeInTheDocument();
  });

  it('should have links for signup and forgot password', () => {
    const mockOnSuccess = vi.fn();
    render(<LoginForm onSuccess={mockOnSuccess} />);

    expect(screen.getByText(/Sign up/i)).toBeInTheDocument();
    expect(screen.getByText(/Forgot password/i)).toBeInTheDocument();
  });
});
