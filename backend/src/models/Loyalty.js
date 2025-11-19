// src/models/Loyalty.js - Loyalty program model

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Loyalty = sequelize.define('Loyalty', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: { model: 'users', key: 'id' }
  },
  tier: {
    type: DataTypes.ENUM('bronze', 'silver', 'gold', 'platinum'),
    defaultValue: 'bronze'
  },
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalPoints: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  referralCode: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true
  },
  referralBonus: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  totalReferrals: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  cashbackRate: {
    type: DataTypes.DECIMAL(5, 3),
    defaultValue: 0.5,
    comment: 'Percentage cashback on transactions'
  },
  monthlyLimit: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true
  },
  monthlyUsed: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  },
  lastTierUpgrade: {
    type: DataTypes.DATE,
    allowNull: true
  },
  nextTierProgress: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0,
    comment: 'Progress to next tier as percentage'
  }
}, {
  tableName: 'loyalty_programs',
  timestamps: true
});

export default Loyalty;
