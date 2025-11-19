// src/models/index.js - Model index and associations

import User from './User.js';
import Recipient from './Recipient.js';
import Transaction from './Transaction.js';
import Wallet from './Wallet.js';
import ExchangeRate from './ExchangeRate.js';
import FeeStructure from './FeeStructure.js';
import KYCDocument from './KYCDocument.js';

// Define associations
User.hasMany(Wallet, { foreignKey: 'userId', as: 'wallets' });
Wallet.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Recipient, { foreignKey: 'senderUserId', as: 'recipients' });
Recipient.belongsTo(User, { foreignKey: 'senderUserId', as: 'sender' });

User.hasMany(Transaction, { foreignKey: 'senderUserId', as: 'sentTransactions' });
Transaction.belongsTo(User, { foreignKey: 'senderUserId', as: 'sender' });

User.hasMany(KYCDocument, { foreignKey: 'userId', as: 'kycDocuments' });
KYCDocument.belongsTo(User, { foreignKey: 'userId' });

export {
  User,
  Recipient,
  Transaction,
  Wallet,
  ExchangeRate,
  FeeStructure,
  KYCDocument
};
