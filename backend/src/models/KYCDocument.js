// src/models/KYCDocument.js - KYC Document model

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const KYCDocument = sequelize.define('KYCDocument', {
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
  documentType: {
    type: DataTypes.ENUM('passport', 'national_id', 'drivers_license', 'utility_bill'),
    allowNull: false
  },
  documentUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  documentNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  expirationDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  verifiedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  verificationNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'kyc_documents',
  timestamps: true
});

export default KYCDocument;
