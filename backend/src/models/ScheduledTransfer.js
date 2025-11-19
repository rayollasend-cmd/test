// src/models/ScheduledTransfer.js - Scheduled/recurring transfer model

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ScheduledTransfer = sequelize.define('ScheduledTransfer', {
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
  recipientId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  currency: {
    type: DataTypes.CHAR(3),
    allowNull: false
  },
  frequency: {
    type: DataTypes.ENUM('once', 'weekly', 'biweekly', 'monthly', 'quarterly', 'annually'),
    defaultValue: 'once'
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  nextExecutionDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'paused', 'completed', 'cancelled'),
    defaultValue: 'active'
  },
  executionCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  lastExecutionDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  remainingExecutions: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  notifyBefore: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    comment: 'Days before execution to notify'
  }
}, {
  tableName: 'scheduled_transfers',
  timestamps: true
});

export default ScheduledTransfer;
