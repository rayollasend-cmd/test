-- Migration 001: Initialize database schema

-- Create UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  date_of_birth DATE,
  nationality VARCHAR(100),
  kyc_status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
  kyc_verified_at TIMESTAMP,
  profile_photo_url VARCHAR(500),
  last_login_at TIMESTAMP,
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  two_factor_secret VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_kyc_status ON users(kyc_status);

-- Recipients table
CREATE TABLE IF NOT EXISTS recipients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_user_id UUID NOT NULL REFERENCES users(id),
  recipient_type ENUM('bank_account', 'mobile_wallet', 'cash_pickup') NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  country_code CHAR(2) NOT NULL,
  relationship VARCHAR(50),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_recipients_sender_user_id ON recipients(sender_user_id);
CREATE INDEX idx_recipients_country_code ON recipients(country_code);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_user_id UUID NOT NULL REFERENCES users(id),
  recipient_id UUID NOT NULL REFERENCES recipients(id),
  transaction_type ENUM('send_money', 'request_money', 'topup') DEFAULT 'send_money',
  status ENUM('pending', 'processing', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
  amount_sent DECIMAL(15, 2) NOT NULL,
  currency_sent CHAR(3) NOT NULL,
  amount_received DECIMAL(15, 2),
  currency_received CHAR(3) NOT NULL,
  exchange_rate DECIMAL(10, 6) NOT NULL,
  fee DECIMAL(10, 2) NOT NULL,
  fee_currency CHAR(3) DEFAULT 'USD',
  payment_method ENUM('bank_transfer', 'card', 'wallet', 'crypto') NOT NULL,
  delivery_method ENUM('bank_deposit', 'mobile_money', 'cash_pickup') NOT NULL,
  reference_number VARCHAR(50),
  notes TEXT,
  completed_at TIMESTAMP,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_sender_user_id ON transactions(sender_user_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);

-- Wallets table
CREATE TABLE IF NOT EXISTS wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  currency_code CHAR(3) NOT NULL,
  balance DECIMAL(15, 2) DEFAULT 0,
  available_balance DECIMAL(15, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, currency_code)
);

CREATE INDEX idx_wallets_user_id ON wallets(user_id);

-- Exchange Rates table
CREATE TABLE IF NOT EXISTS exchange_rates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_currency CHAR(3) NOT NULL,
  to_currency CHAR(3) NOT NULL,
  rate DECIMAL(10, 6) NOT NULL,
  source VARCHAR(100) DEFAULT 'xe.com',
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_exchange_rates_currencies ON exchange_rates(from_currency, to_currency);

-- Fee Structure table
CREATE TABLE IF NOT EXISTS fee_structures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_country CHAR(2) NOT NULL,
  to_country CHAR(2) NOT NULL,
  transfer_method VARCHAR(50) NOT NULL,
  recipient_type VARCHAR(50) NOT NULL,
  amount_min DECIMAL(15, 2),
  amount_max DECIMAL(15, 2),
  fixed_fee DECIMAL(10, 2) DEFAULT 0,
  percentage_fee DECIMAL(5, 3) DEFAULT 0,
  processing_time_hours INTEGER DEFAULT 24,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_fee_structures_countries ON fee_structures(from_country, to_country);

-- KYC Documents table
CREATE TABLE IF NOT EXISTS kyc_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  document_type ENUM('passport', 'national_id', 'drivers_license', 'utility_bill') NOT NULL,
  document_url VARCHAR(500),
  document_number VARCHAR(100),
  expiration_date DATE,
  verified_at TIMESTAMP,
  verification_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_kyc_documents_user_id ON kyc_documents(user_id);

-- Create ENUM types (PostgreSQL specific)
CREATE TYPE kyc_status_enum AS ENUM('pending', 'verified', 'rejected');
CREATE TYPE transaction_status_enum AS ENUM('pending', 'processing', 'completed', 'failed', 'cancelled');
CREATE TYPE recipient_type_enum AS ENUM('bank_account', 'mobile_wallet', 'cash_pickup');
