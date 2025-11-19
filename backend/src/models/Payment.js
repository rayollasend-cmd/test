// Payment model - tracks all payment transactions
'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Payment = sequelize.define(
    'Payment',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      paymentType: {
        type: DataTypes.ENUM('topup', 'transfer', 'bill', 'crypto'),
        allowNull: false,
        comment: 'Type of payment: wallet top-up, transfer, bill, or crypto'
      },
      amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        validate: { min: 0 },
        comment: 'Payment amount in the specified currency'
      },
      currency: {
        type: DataTypes.CHAR(3),
        allowNull: false,
        defaultValue: 'USD',
        comment: 'ISO 4217 currency code'
      },
      processor: {
        type: DataTypes.ENUM('stripe', 'paypal', 'local'),
        allowNull: false,
        defaultValue: 'stripe',
        comment: 'Payment processor used (Stripe, PayPal, or local)'
      },
      status: {
        type: DataTypes.ENUM(
          'pending',
          'processing',
          'completed',
          'failed',
          'cancelled',
          'refunded'
        ),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Current payment status'
      },
      processorTransactionId: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
        comment: 'Payment intent ID (Stripe) or Order ID (PayPal)'
      },
      paymentMethodId: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Saved payment method ID for recurring payments'
      },
      paymentMethodBrand: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Card brand (Visa, Mastercard) or payment method (PayPal)'
      },
      paymentMethodLast4: {
        type: DataTypes.STRING(4),
        allowNull: true,
        comment: 'Last 4 digits of card or account'
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Payment description shown on statement'
      },
      metadata: {
        type: DataTypes.JSONB,
        defaultValue: {},
        comment: 'Additional metadata (webhook data, user info, etc.)'
      },
      failureReason: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Reason for payment failure if applicable'
      },
      refundedAmount: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0,
        comment: 'Total amount refunded'
      },
      refundIds: {
        type: DataTypes.JSONB,
        defaultValue: [],
        comment: 'Array of refund transaction IDs'
      },
      ipAddress: {
        type: DataTypes.INET,
        allowNull: true,
        comment: 'IP address of the requester for fraud detection'
      },
      userAgent: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'User agent string'
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
      }
    },
    {
      tableName: 'payments',
      timestamps: true,
      underscored: false,
      comment: 'Payment transactions from Stripe and PayPal',
      indexes: [
        {
          fields: ['userId'],
          name: 'idx_payments_user_id'
        },
        {
          fields: ['status'],
          name: 'idx_payments_status'
        },
        {
          fields: ['processor'],
          name: 'idx_payments_processor'
        },
        {
          fields: ['processorTransactionId'],
          name: 'idx_payments_processor_transaction_id'
        },
        {
          fields: ['createdAt'],
          name: 'idx_payments_created_at'
        },
        {
          fields: ['userId', 'createdAt'],
          name: 'idx_payments_user_created_at'
        }
      ]
    }
  );

  // Associations
  Payment.associate = (models) => {
    Payment.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
      onDelete: 'CASCADE'
    });
  };

  // Instance methods
  Payment.prototype.isRefundable = function () {
    return this.status === 'completed' && this.refundedAmount < this.amount;
  };

  Payment.prototype.getRemainingRefundAmount = function () {
    return this.amount - this.refundedAmount;
  };

  Payment.prototype.canBeCancelled = function () {
    return ['pending', 'processing'].includes(this.status);
  };

  // Scopes
  Payment.addScope('successful', {
    where: { status: 'completed' }
  });

  Payment.addScope('failed', {
    where: { status: 'failed' }
  });

  Payment.addScope('refunded', {
    where: { status: 'refunded' }
  });

  Payment.addScope('pending', {
    where: { status: ['pending', 'processing'] }
  });

  Payment.addScope('byUser', (userId) => ({
    where: { userId }
  }));

  Payment.addScope('byProcessor', (processor) => ({
    where: { processor }
  }));

  Payment.addScope('recent', {
    order: [['createdAt', 'DESC']]
  });

  return Payment;
};
