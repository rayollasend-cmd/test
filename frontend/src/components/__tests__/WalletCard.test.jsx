// src/components/__tests__/WalletCard.test.jsx - WalletCard component tests

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WalletCard } from '../WalletCard';

describe('WalletCard', () => {
  it('should render wallet card with balance', () => {
    const mockOnTopUp = vi.fn();
    const mockOnConvert = vi.fn();

    render(
      <WalletCard
        currency="USD"
        balance={1250.50}
        onTopUp={mockOnTopUp}
        onConvert={mockOnConvert}
      />
    );

    expect(screen.getByText('Balance')).toBeInTheDocument();
    expect(screen.getByText(/USD/i)).toBeInTheDocument();
  });

  it('should display correct currency code', () => {
    const mockOnTopUp = vi.fn();
    const mockOnConvert = vi.fn();

    render(
      <WalletCard
        currency="JMD"
        balance={187500}
        onTopUp={mockOnTopUp}
        onConvert={mockOnConvert}
      />
    );

    expect(screen.getByText('JMD')).toBeInTheDocument();
  });

  it('should call onTopUp when top up button is clicked', () => {
    const mockOnTopUp = vi.fn();
    const mockOnConvert = vi.fn();

    render(
      <WalletCard
        currency="USD"
        balance={1000}
        onTopUp={mockOnTopUp}
        onConvert={mockOnConvert}
      />
    );

    const topUpButton = screen.getByText(/Top Up/i);
    fireEvent.click(topUpButton);

    expect(mockOnTopUp).toHaveBeenCalledWith('USD');
  });

  it('should call onConvert when convert button is clicked', () => {
    const mockOnTopUp = vi.fn();
    const mockOnConvert = vi.fn();

    render(
      <WalletCard
        currency="USD"
        balance={1000}
        onTopUp={mockOnTopUp}
        onConvert={mockOnConvert}
      />
    );

    const convertButton = screen.getByText(/Convert/i);
    fireEvent.click(convertButton);

    expect(mockOnConvert).toHaveBeenCalledWith('USD');
  });
});
