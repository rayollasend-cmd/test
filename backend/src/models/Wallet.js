// src/models/Wallet.js - Wallet model

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Wallet = sequelize.define('Wallet', {
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
  currencyCode: {
    type: DataTypes.CHAR(3),
    allowNull: false
  },
  balance: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  },
  availableBalance: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  }
}, {
  tableName: 'wallets',
  timestamps: true,
  indexes: [
    { fields: ['userId', 'currencyCode'], unique: true }
  ]
});

export default Wallet;
