// src/models/FeeStructure.js - Fee Structure model

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const FeeStructure = sequelize.define('FeeStructure', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  fromCountry: {
    type: DataTypes.CHAR(2),
    allowNull: false
  },
  toCountry: {
    type: DataTypes.CHAR(2),
    allowNull: false
  },
  transferMethod: {
    type: DataTypes.STRING,
    allowNull: false
  },
  recipientType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  amountMin: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true
  },
  amountMax: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true
  },
  fixedFee: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  percentageFee: {
    type: DataTypes.DECIMAL(5, 3),
    defaultValue: 0
  },
  processingTimeHours: {
    type: DataTypes.INTEGER,
    defaultValue: 24
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'fee_structures',
  timestamps: true
});

export default FeeStructure;
