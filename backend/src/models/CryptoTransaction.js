// src/models/CryptoTransaction.js - Crypto transaction model

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const CryptoTransaction = sequelize.define('CryptoTransaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  transactionType: {
    type: DataTypes.ENUM('send', 'receive', 'buy', 'sell'),
    allowNull: false
  },
  cryptocurrency: {
    type: DataTypes.STRING,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(18, 8),
    allowNull: false
  },
  fiatAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  fiatCurrency: {
    type: DataTypes.CHAR(3),
    defaultValue: 'USD'
  },
  exchangeRate: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  fee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  walletAddress: {
    type: DataTypes.STRING,
    allowNull: true
  },
  transactionHash: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'confirmed', 'failed', 'cancelled'),
    defaultValue: 'pending'
  },
  confirmations: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  network: {
    type: DataTypes.STRING,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'crypto_transactions',
  timestamps: true
});

export default CryptoTransaction;
