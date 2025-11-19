// src/models/Recipient.js - Recipient model

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Recipient = sequelize.define('Recipient', {
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
  recipientType: {
    type: DataTypes.ENUM('bank_account', 'mobile_wallet', 'cash_pickup'),
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: { isEmail: true }
  },
  countryCode: {
    type: DataTypes.CHAR(2),
    allowNull: false
  },
  relationship: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'recipients',
  timestamps: true,
  paranoid: true
});

export default Recipient;
