// src/models/Bill.js - Bill model for bills payment feature

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Bill = sequelize.define('Bill', {
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
  billType: {
    type: DataTypes.ENUM('electricity', 'water', 'internet', 'mobile', 'insurance', 'tuition', 'other'),
    allowNull: false
  },
  provider: {
    type: DataTypes.STRING,
    allowNull: false
  },
  accountNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  currency: {
    type: DataTypes.CHAR(3),
    defaultValue: 'USD'
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'scheduled', 'paid', 'overdue', 'cancelled'),
    defaultValue: 'pending'
  },
  isRecurring: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  recurringFrequency: {
    type: DataTypes.ENUM('weekly', 'biweekly', 'monthly', 'quarterly', 'annually'),
    allowNull: true
  },
  nextBillDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'bills',
  timestamps: true
});

export default Bill;
