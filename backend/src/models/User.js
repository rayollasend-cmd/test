// src/models/User.js - User model

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  dateOfBirth: {
    type: DataTypes.DATE,
    allowNull: true
  },
  nationality: {
    type: DataTypes.STRING,
    allowNull: true
  },
  kycStatus: {
    type: DataTypes.ENUM('pending', 'verified', 'rejected'),
    defaultValue: 'pending'
  },
  kycVerifiedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  profilePhotoUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  lastLoginAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  twoFactorEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  twoFactorSecret: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true,
  paranoid: true
});

export default User;
