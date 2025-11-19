// src/models/Transaction.js - Transaction model

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  senderUserId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  recipientId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  transactionType: {
    type: DataTypes.ENUM('send_money', 'request_money', 'topup'),
    defaultValue: 'send_money'
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed', 'cancelled'),
    defaultValue: 'pending'
  },
  amountSent: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  currencySent: {
    type: DataTypes.CHAR(3),
    allowNull: false
  },
  amountReceived: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true
  },
  currencyReceived: {
    type: DataTypes.CHAR(3),
    allowNull: false
  },
  exchangeRate: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: false
  },
  fee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  feeCurrency: {
    type: DataTypes.CHAR(3),
    defaultValue: 'USD'
  },
  paymentMethod: {
    type: DataTypes.ENUM('bank_transfer', 'card', 'wallet', 'crypto'),
    allowNull: false
  },
  deliveryMethod: {
    type: DataTypes.ENUM('bank_deposit', 'mobile_money', 'cash_pickup'),
    allowNull: false
  },
  referenceNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'transactions',
  timestamps: true
});

export default Transaction;
