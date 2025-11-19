-- Migration: Create payments table for Stripe and PayPal integration
-- Description: Table to track all payment transactions from payment processors

-- Create ENUM types
CREATE TYPE payment_type_enum AS ENUM ('topup', 'transfer', 'bill', 'crypto');
CREATE TYPE processor_enum AS ENUM ('stripe', 'paypal', 'local');
CREATE TYPE payment_status_enum AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded');

-- Create payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- User and payment information
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  payment_type payment_type_enum NOT NULL,
  amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
  currency CHAR(3) NOT NULL DEFAULT 'USD',

  -- Processor information
  processor processor_enum NOT NULL DEFAULT 'stripe',
  status payment_status_enum NOT NULL DEFAULT 'pending',
  processor_transaction_id VARCHAR(255) UNIQUE,

  -- Payment method
  payment_method_id VARCHAR(255),
  payment_method_brand VARCHAR(50),
  payment_method_last4 VARCHAR(4),

  -- Additional details
  description TEXT,
  metadata JSONB DEFAULT '{}',
  failure_reason TEXT,

  -- Refund tracking
  refunded_amount NUMERIC(15, 2) DEFAULT 0 CHECK (refunded_amount >= 0),
  refund_ids JSONB DEFAULT '[]',

  -- Security and audit
  ip_address INET,
  user_agent TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create indexes for performance
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_processor ON payments(processor);
CREATE INDEX idx_payments_processor_transaction_id ON payments(processor_transaction_id);
CREATE INDEX idx_payments_created_at ON payments(created_at DESC);
CREATE INDEX idx_payments_user_created_at ON payments(user_id, created_at DESC);
CREATE INDEX idx_payments_user_status ON payments(user_id, status);

-- Create table comments
COMMENT ON TABLE payments IS 'Payment transactions from Stripe and PayPal';
COMMENT ON COLUMN payments.id IS 'Unique payment identifier';
COMMENT ON COLUMN payments.user_id IS 'Reference to user who made the payment';
COMMENT ON COLUMN payments.payment_type IS 'Type of payment: topup, transfer, bill, or crypto';
COMMENT ON COLUMN payments.amount IS 'Payment amount in the specified currency';
COMMENT ON COLUMN payments.currency IS 'ISO 4217 currency code';
COMMENT ON COLUMN payments.processor IS 'Payment processor used (Stripe, PayPal, or local)';
COMMENT ON COLUMN payments.status IS 'Current payment status';
COMMENT ON COLUMN payments.processor_transaction_id IS 'Payment intent ID (Stripe) or Order ID (PayPal)';
COMMENT ON COLUMN payments.payment_method_id IS 'Saved payment method ID for recurring payments';
COMMENT ON COLUMN payments.payment_method_brand IS 'Card brand (Visa, Mastercard) or payment method (PayPal)';
COMMENT ON COLUMN payments.payment_method_last4 IS 'Last 4 digits of card or account';
COMMENT ON COLUMN payments.description IS 'Payment description shown on statement';
COMMENT ON COLUMN payments.metadata IS 'Additional metadata (webhook data, user info, etc.)';
COMMENT ON COLUMN payments.failure_reason IS 'Reason for payment failure if applicable';
COMMENT ON COLUMN payments.refunded_amount IS 'Total amount refunded';
COMMENT ON COLUMN payments.refund_ids IS 'Array of refund transaction IDs';
COMMENT ON COLUMN payments.ip_address IS 'IP address of the requester for fraud detection';
COMMENT ON COLUMN payments.user_agent IS 'User agent string';

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_payments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER trigger_payments_updated_at
BEFORE UPDATE ON payments
FOR EACH ROW
EXECUTE FUNCTION update_payments_updated_at();
