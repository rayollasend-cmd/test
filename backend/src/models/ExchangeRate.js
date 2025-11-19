// src/models/ExchangeRate.js - Exchange Rate model

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ExchangeRate = sequelize.define('ExchangeRate', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  fromCurrency: {
    type: DataTypes.CHAR(3),
    allowNull: false
  },
  toCurrency: {
    type: DataTypes.CHAR(3),
    allowNull: false
  },
  rate: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: false
  },
  source: {
    type: DataTypes.STRING,
    defaultValue: 'xe.com'
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'exchange_rates',
  timestamps: true,
  indexes: [
    { fields: ['fromCurrency', 'toCurrency'] }
  ]
});

export default ExchangeRate;
