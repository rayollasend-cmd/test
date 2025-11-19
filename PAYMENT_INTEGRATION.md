# CaribRemit Payment Processor Integration Guide

Complete guide for integrating Stripe and PayPal payment processors into CaribRemit.

## Overview

CaribRemit supports both **Stripe** and **PayPal** as payment processors for:
- User wallet top-ups
- Money transfer funding
- Bill payment funding
- Cryptocurrency purchase funding

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend App                             │
├─────────────────────────────────────────────────────────────────┤
│  Payment Modal / Form Component                                  │
│  - Select payment method (Card, PayPal)                          │
│  - Stripe.js Elements / PayPal SDK                               │
│  - Handle payment intents                                        │
└────────────┬──────────────────────────────┬──────────────────────┘
             │                              │
    ┌────────▼───────────┐      ┌──────────▼─────────────┐
    │  Backend Service   │      │  Payment Processor     │
    │  (/api/payments)   │      │  (Stripe/PayPal API)   │
    │                    │      │                        │
    │ - Process payment  │◄────►│ - Create intent/order  │
    │ - Verify payment   │      │ - Process transaction  │
    │ - Update wallet    │      │ - Handle webhooks      │
    │ - Record in DB     │      │                        │
    └────────┬───────────┘      └──────────┬─────────────┘
             │                              │
    ┌────────▼──────────────────────────────▼──────────┐
    │         Database (PostgreSQL)                     │
    │                                                   │
    │  Payment Table:                                   │
    │  - id, user_id, amount, currency                  │
    │  - processor (stripe/paypal)                      │
    │  - status (pending, completed, failed)            │
    │  - processor_transaction_id                       │
    │  - metadata (webhooks, reconciliation)            │
    └───────────────────────────────────────────────────┘
```

---

## 1. Stripe Integration

### 1.1 Setup

#### Create Stripe Account

```bash
# Sign up at https://dashboard.stripe.com/register
# Verify email and phone
# Complete onboarding
```

#### Get API Keys

```bash
# From Stripe Dashboard:
# 1. Navigate to Developers > API Keys
# 2. Copy Publishable Key (pk_live_...)
# 3. Copy Secret Key (sk_live_...)
# 4. Save in environment variables
```

#### Environment Variables

```bash
# Backend
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_PUBLIC_KEY=pk_live_xxxxx
STRIPE_API_VERSION=2023-10-16
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Frontend
VITE_STRIPE_PUBLIC_KEY=pk_live_xxxxx
```

### 1.2 Backend Implementation

#### Payment Service (src/services/stripeService.js)

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: process.env.STRIPE_API_VERSION,
  maxNetworkRetries: 3
});

class StripeService {
  // Create payment intent for card payments
  async createPaymentIntent(userId, amount, currency = 'USD', metadata = {}) {
    try {
      const intent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        payment_method_types: ['card'],
        metadata: {
          userId,
          ...metadata
        },
        statement_descriptor: 'CARIBREMIT TOP-UP'
      });

      return {
        success: true,
        clientSecret: intent.client_secret,
        intentId: intent.id,
        amount: intent.amount / 100,
        currency: intent.currency.toUpperCase(),
        status: intent.status
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Confirm payment intent
  async confirmPaymentIntent(intentId, paymentMethodId) {
    try {
      const intent = await stripe.paymentIntents.confirm(intentId, {
        payment_method: paymentMethodId
      });

      return {
        success: intent.status === 'succeeded',
        intentId: intent.id,
        status: intent.status,
        amount: intent.amount / 100,
        currency: intent.currency.toUpperCase()
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Retrieve payment intent
  async getPaymentIntent(intentId) {
    try {
      const intent = await stripe.paymentIntents.retrieve(intentId);
      return {
        success: true,
        intentId: intent.id,
        status: intent.status,
        amount: intent.amount / 100,
        currency: intent.currency.toUpperCase(),
        lastError: intent.last_payment_error
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Create customer for recurring payments
  async createCustomer(userId, email, metadata = {}) {
    try {
      const customer = await stripe.customers.create({
        email,
        metadata: {
          userId,
          ...metadata
        }
      });

      return {
        success: true,
        customerId: customer.id,
        email: customer.email
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Save card for future use
  async saveCard(customerId, paymentMethodId) {
    try {
      const paymentMethod = await stripe.paymentMethods.attach(
        paymentMethodId,
        { customer: customerId }
      );

      // Set as default
      await stripe.customers.update(customerId, {
        invoice_settings: { default_payment_method: paymentMethodId }
      });

      return {
        success: true,
        paymentMethodId: paymentMethod.id,
        brand: paymentMethod.card.brand,
        last4: paymentMethod.card.last4
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Refund payment
  async refundPayment(paymentIntentId, amount = null) {
    try {
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : null
      });

      return {
        success: refund.status === 'succeeded',
        refundId: refund.id,
        status: refund.status,
        amount: refund.amount / 100
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Setup subscription
  async createSubscription(customerId, priceId) {
    try {
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent']
      });

      return {
        success: true,
        subscriptionId: subscription.id,
        status: subscription.status
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Validate webhook signature
  validateWebhookSignature(body, signature) {
    try {
      const event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
      return { success: true, event };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // Get all payment methods for customer
  async getPaymentMethods(customerId) {
    try {
      const methods = await stripe.paymentMethods.list({
        customer: customerId,
        type: 'card'
      });

      return {
        success: true,
        paymentMethods: methods.data.map(method => ({
          id: method.id,
          brand: method.card.brand,
          last4: method.card.last4,
          expMonth: method.card.exp_month,
          expYear: method.card.exp_year
        }))
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Delete payment method
  async deletePaymentMethod(paymentMethodId) {
    try {
      await stripe.paymentMethods.detach(paymentMethodId);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

module.exports = new StripeService();
```

#### PayPal Service (src/services/paypalService.js)

```javascript
const axios = require('axios');

class PayPalService {
  constructor() {
    this.clientId = process.env.PAYPAL_CLIENT_ID;
    this.clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    this.mode = process.env.PAYPAL_MODE || 'sandbox';
    this.baseURL = this.mode === 'live'
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com';
    this.webhookId = process.env.PAYPAL_WEBHOOK_ID;
  }

  // Get access token
  async getAccessToken() {
    try {
      const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
      const response = await axios.post(
        `${this.baseURL}/v1/oauth2/token`,
        'grant_type=client_credentials',
        {
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      return response.data.access_token;
    } catch (error) {
      throw new Error(`Failed to get PayPal access token: ${error.message}`);
    }
  }

  // Create order
  async createOrder(userId, amount, currency = 'USD', returnUrl, cancelUrl) {
    try {
      const token = await this.getAccessToken();

      const response = await axios.post(
        `${this.baseURL}/v2/checkout/orders`,
        {
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: currency,
                value: amount.toFixed(2)
              },
              description: 'CaribRemit wallet top-up',
              custom_id: userId
            }
          ],
          application_context: {
            return_url: returnUrl,
            cancel_url: cancelUrl,
            user_action: 'PAY_NOW',
            brand_name: 'CaribRemit'
          }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        orderId: response.data.id,
        status: response.data.status,
        links: response.data.links
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Capture order (finalize payment)
  async captureOrder(orderId) {
    try {
      const token = await this.getAccessToken();

      const response = await axios.post(
        `${this.baseURL}/v2/checkout/orders/${orderId}/capture`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const purchase = response.data.purchase_units[0];
      const payment = purchase.payments.captures[0];

      return {
        success: payment.status === 'COMPLETED',
        orderId: response.data.id,
        status: response.data.status,
        paymentStatus: payment.status,
        amount: parseFloat(purchase.amount.value),
        currency: purchase.amount.currency_code,
        transactionId: payment.id,
        payer: {
          email: response.data.payer.email_address,
          name: response.data.payer.name.given_name
        }
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Get order details
  async getOrderDetails(orderId) {
    try {
      const token = await this.getAccessToken();

      const response = await axios.get(
        `${this.baseURL}/v2/checkout/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const purchase = response.data.purchase_units[0];

      return {
        success: true,
        orderId: response.data.id,
        status: response.data.status,
        amount: parseFloat(purchase.amount.value),
        currency: purchase.amount.currency_code,
        payer: response.data.payer
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Refund captured payment
  async refundCapture(captureId, amount = null) {
    try {
      const token = await this.getAccessToken();

      const body = amount ? { amount: { value: amount.toFixed(2) } } : {};

      const response = await axios.post(
        `${this.baseURL}/v2/payments/captures/${captureId}/refund`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: response.data.status === 'COMPLETED',
        refundId: response.data.id,
        status: response.data.status
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Validate webhook
  async validateWebhook(body, headers) {
    try {
      const token = await this.getAccessToken();

      const response = await axios.post(
        `${this.baseURL}/v1/notifications/verify-webhook-signature`,
        {
          transmission_id: headers['paypal-transmission-id'],
          transmission_time: headers['paypal-transmission-time'],
          cert_url: headers['paypal-cert-url'],
          auth_algo: headers['paypal-auth-algo'],
          transmission_sig: headers['paypal-transmission-sig'],
          webhook_id: this.webhookId,
          webhook_event: body
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.verification_status === 'SUCCESS';
    } catch (error) {
      console.error('PayPal webhook validation error:', error.message);
      return false;
    }
  }
}

module.exports = new PayPalService();
```

#### Payment Model (src/models/Payment.js)

```javascript
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
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      paymentType: {
        type: DataTypes.ENUM('topup', 'transfer', 'bill', 'crypto'),
        allowNull: false
      },
      amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        validate: { min: 0 }
      },
      currency: {
        type: DataTypes.CHAR(3),
        allowNull: false,
        defaultValue: 'USD'
      },
      processor: {
        type: DataTypes.ENUM('stripe', 'paypal', 'local'),
        allowNull: false,
        defaultValue: 'stripe'
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
        defaultValue: 'pending'
      },
      processorTransactionId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
      },
      paymentMethodId: {
        type: DataTypes.STRING,
        allowNull: true
      },
      paymentMethodBrand: {
        type: DataTypes.STRING,
        allowNull: true
      },
      paymentMethodLast4: {
        type: DataTypes.STRING(4),
        allowNull: true
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      metadata: {
        type: DataTypes.JSONB,
        defaultValue: {}
      },
      failureReason: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      refundedAmount: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0
      },
      refundIds: {
        type: DataTypes.JSONB,
        defaultValue: []
      },
      ipAddress: {
        type: DataTypes.INET,
        allowNull: true
      },
      userAgent: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    },
    {
      tableName: 'payments',
      timestamps: true,
      indexes: [
        { fields: ['userId'] },
        { fields: ['status'] },
        { fields: ['processor'] },
        { fields: ['processorTransactionId'] },
        { fields: ['createdAt'] }
      ]
    }
  );

  Payment.associate = (models) => {
    Payment.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return Payment;
};
```

#### Payment API Routes (src/routes/payments.js)

```javascript
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const validateRequest = require('../middleware/validateRequest');
const stripeService = require('../services/stripeService');
const paypalService = require('../services/paypalService');
const { Payment, User, Wallet } = require('../models');
const Joi = require('joi');

// Create payment intent (Stripe)
router.post('/stripe/intent', authenticate, validateRequest({
  body: Joi.object({
    amount: Joi.number().required().positive(),
    currency: Joi.string().length(3).default('USD'),
    paymentType: Joi.string().required(),
    metadata: Joi.object().default({})
  })
}), async (req, res) => {
  try {
    const { amount, currency, paymentType, metadata } = req.body;

    // Create payment intent
    const result = await stripeService.createPaymentIntent(
      req.user.id,
      amount,
      currency,
      { paymentType, ...metadata }
    );

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message
      });
    }

    // Record in database
    const payment = await Payment.create({
      userId: req.user.id,
      paymentType,
      amount,
      currency,
      processor: 'stripe',
      status: 'pending',
      processorTransactionId: result.intentId,
      metadata,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.json({
      success: true,
      clientSecret: result.clientSecret,
      paymentId: payment.id
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ success: false, message: 'Failed to create payment' });
  }
});

// Confirm payment (Stripe)
router.post('/stripe/confirm', authenticate, validateRequest({
  body: Joi.object({
    intentId: Joi.string().required(),
    paymentId: Joi.string().uuid().required()
  })
}), async (req, res) => {
  try {
    const { intentId, paymentId } = req.body;

    // Verify payment exists and belongs to user
    const payment = await Payment.findOne({
      where: {
        id: paymentId,
        userId: req.user.id,
        processor: 'stripe'
      }
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Get intent status from Stripe
    const result = await stripeService.getPaymentIntent(intentId);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message
      });
    }

    // Update payment status
    if (result.status === 'succeeded') {
      payment.status = 'completed';
      await payment.save();

      // Credit wallet (if topup)
      if (payment.paymentType === 'topup') {
        let wallet = await Wallet.findOne({
          where: {
            userId: req.user.id,
            currency: payment.currency
          }
        });

        if (!wallet) {
          wallet = await Wallet.create({
            userId: req.user.id,
            currency: payment.currency,
            balance: 0,
            availableBalance: 0
          });
        }

        wallet.balance += payment.amount;
        wallet.availableBalance += payment.amount;
        await wallet.save();
      }

      return res.json({
        success: true,
        message: 'Payment completed',
        payment: payment.toJSON()
      });
    }

    res.json({
      success: false,
      message: `Payment status: ${result.status}`,
      payment: payment.toJSON()
    });
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ success: false, message: 'Failed to confirm payment' });
  }
});

// Create PayPal order
router.post('/paypal/order', authenticate, validateRequest({
  body: Joi.object({
    amount: Joi.number().required().positive(),
    currency: Joi.string().length(3).default('USD'),
    paymentType: Joi.string().required(),
    returnUrl: Joi.string().uri().required(),
    cancelUrl: Joi.string().uri().required()
  })
}), async (req, res) => {
  try {
    const { amount, currency, paymentType, returnUrl, cancelUrl } = req.body;

    // Create PayPal order
    const result = await paypalService.createOrder(
      req.user.id,
      amount,
      currency,
      returnUrl,
      cancelUrl
    );

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message
      });
    }

    // Record in database
    const payment = await Payment.create({
      userId: req.user.id,
      paymentType,
      amount,
      currency,
      processor: 'paypal',
      status: 'pending',
      processorTransactionId: result.orderId,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.json({
      success: true,
      orderId: result.orderId,
      paymentId: payment.id,
      approvalLink: result.links.find(l => l.rel === 'approve')?.href
    });
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    res.status(500).json({ success: false, message: 'Failed to create order' });
  }
});

// Capture PayPal order
router.post('/paypal/capture', authenticate, validateRequest({
  body: Joi.object({
    orderId: Joi.string().required(),
    paymentId: Joi.string().uuid().required()
  })
}), async (req, res) => {
  try {
    const { orderId, paymentId } = req.body;

    // Verify payment exists
    const payment = await Payment.findOne({
      where: {
        id: paymentId,
        userId: req.user.id,
        processor: 'paypal'
      }
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Capture PayPal order
    const result = await paypalService.captureOrder(orderId);

    if (!result.success) {
      payment.status = 'failed';
      payment.failureReason = result.message;
      await payment.save();

      return res.status(400).json({
        success: false,
        message: result.message
      });
    }

    // Update payment
    payment.status = 'completed';
    payment.paymentMethodBrand = 'paypal';
    payment.metadata = { payer: result.payer };
    await payment.save();

    // Credit wallet
    if (payment.paymentType === 'topup') {
      let wallet = await Wallet.findOne({
        where: {
          userId: req.user.id,
          currency: payment.currency
        }
      });

      if (!wallet) {
        wallet = await Wallet.create({
          userId: req.user.id,
          currency: payment.currency,
          balance: 0,
          availableBalance: 0
        });
      }

      wallet.balance += payment.amount;
      wallet.availableBalance += payment.amount;
      await wallet.save();
    }

    res.json({
      success: true,
      message: 'Payment completed',
      payment: payment.toJSON()
    });
  } catch (error) {
    console.error('Error capturing PayPal order:', error);
    res.status(500).json({ success: false, message: 'Failed to capture payment' });
  }
});

// Stripe webhook handler
router.post('/webhook/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['stripe-signature'];

  const { success, event } = stripeService.validateWebhookSignature(
    req.body,
    signature
  );

  if (!success) {
    return res.status(400).json({ received: false });
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        const payment = await Payment.findOne({
          where: { processorTransactionId: paymentIntent.id }
        });

        if (payment) {
          payment.status = 'completed';
          await payment.save();
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        const payment = await Payment.findOne({
          where: { processorTransactionId: paymentIntent.id }
        });

        if (payment) {
          payment.status = 'failed';
          payment.failureReason = paymentIntent.last_payment_error?.message;
          await payment.save();
        }
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object;
        const payment = await Payment.findOne({
          where: { processorTransactionId: charge.payment_intent }
        });

        if (payment) {
          payment.status = 'refunded';
          payment.refundedAmount = charge.amount_refunded / 100;
          await payment.save();
        }
        break;
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error processing Stripe webhook:', error);
    res.status(500).json({ received: false });
  }
});

// PayPal webhook handler
router.post('/webhook/paypal', express.json(), async (req, res) => {
  try {
    // Validate webhook
    const isValid = await paypalService.validateWebhook(req.body, req.headers);

    if (!isValid) {
      return res.status(401).json({ success: false });
    }

    const event = req.body;

    switch (event.event_type) {
      case 'CHECKOUT.ORDER.COMPLETED': {
        const orderId = event.resource.id;
        const payment = await Payment.findOne({
          where: { processorTransactionId: orderId }
        });

        if (payment) {
          payment.status = 'completed';
          await payment.save();
        }
        break;
      }

      case 'CHECKOUT.ORDER.APPROVED': {
        const orderId = event.resource.id;
        const payment = await Payment.findOne({
          where: { processorTransactionId: orderId }
        });

        if (payment) {
          payment.status = 'processing';
          await payment.save();
        }
        break;
      }

      case 'PAYMENT.CAPTURE.REFUNDED': {
        const payment = await Payment.findOne({
          where: { processorTransactionId: event.resource.supplementary_data?.related_ids?.order_id }
        });

        if (payment) {
          payment.status = 'refunded';
          payment.refundedAmount = parseFloat(event.resource.amount.value);
          await payment.save();
        }
        break;
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error processing PayPal webhook:', error);
    res.status(500).json({ success: false });
  }
});

// Get payment history
router.get('/history', authenticate, async (req, res) => {
  try {
    const { limit = 20, offset = 0, status, processor } = req.query;

    const where = { userId: req.user.id };
    if (status) where.status = status;
    if (processor) where.processor = processor;

    const payments = await Payment.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: payments.rows,
      total: payments.count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch payment history' });
  }
});

// Refund payment
router.post('/:paymentId/refund', authenticate, validateRequest({
  body: Joi.object({
    amount: Joi.number().positive().optional()
  })
}), async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { amount } = req.body;

    const payment = await Payment.findOne({
      where: {
        id: paymentId,
        userId: req.user.id,
        status: 'completed'
      }
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found or cannot be refunded'
      });
    }

    let result;
    if (payment.processor === 'stripe') {
      result = await stripeService.refundPayment(
        payment.processorTransactionId,
        amount || payment.amount
      );
    } else if (payment.processor === 'paypal') {
      result = await paypalService.refundCapture(
        payment.processorTransactionId,
        amount || payment.amount
      );
    }

    if (result.success) {
      payment.status = 'refunded';
      payment.refundedAmount = amount || payment.amount;
      payment.refundIds = [...(payment.refundIds || []), result.refundId];
      await payment.save();

      return res.json({
        success: true,
        message: 'Payment refunded successfully',
        refundId: result.refundId
      });
    }

    res.status(400).json({
      success: false,
      message: result.message
    });
  } catch (error) {
    console.error('Error refunding payment:', error);
    res.status(500).json({ success: false, message: 'Failed to refund payment' });
  }
});

module.exports = router;
```

### 1.3 Frontend Implementation

#### Payment Component (frontend/src/components/PaymentForm.jsx)

```jsx
import React, { useState } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import './PaymentForm.css';

export const PaymentForm = ({
  amount,
  currency = 'USD',
  paymentType = 'topup',
  onSuccess,
  onError
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [processor, setProcessor] = useState('stripe');

  const handleStripePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!stripe || !elements) {
        throw new Error('Stripe is not initialized');
      }

      // Create payment intent
      const intentResponse = await api.post('/payments/stripe/intent', {
        amount,
        currency,
        paymentType,
        metadata: { userId: user.id }
      });

      if (!intentResponse.data.success) {
        throw new Error(intentResponse.data.message);
      }

      const { clientSecret, paymentId } = intentResponse.data;

      // Confirm payment
      const confirmResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user.firstName + ' ' + user.lastName,
            email: user.email
          }
        }
      });

      if (confirmResult.error) {
        throw new Error(confirmResult.error.message);
      }

      // Confirm with backend
      const confirmResponse = await api.post('/payments/stripe/confirm', {
        intentId: confirmResult.paymentIntent.id,
        paymentId
      });

      if (confirmResponse.data.success) {
        onSuccess(confirmResponse.data.payment);
      } else {
        throw new Error(confirmResponse.data.message);
      }
    } catch (err) {
      const errorMessage = err.message || 'Payment failed';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePayPalPayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const returnUrl = `${window.location.origin}/payment/success`;
      const cancelUrl = `${window.location.origin}/payment/cancel`;

      const orderResponse = await api.post('/payments/paypal/order', {
        amount,
        currency,
        paymentType,
        returnUrl,
        cancelUrl
      });

      if (orderResponse.data.success) {
        // Redirect to PayPal approval link
        window.location.href = orderResponse.data.approvalLink;
      } else {
        throw new Error(orderResponse.data.message);
      }
    } catch (err) {
      const errorMessage = err.message || 'Order creation failed';
      setError(errorMessage);
      onError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="payment-form">
      <h2>Payment Information</h2>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Processor Selection */}
      <div className="processor-selection">
        <label>
          <input
            type="radio"
            value="stripe"
            checked={processor === 'stripe'}
            onChange={(e) => setProcessor(e.target.value)}
            disabled={loading}
          />
          Credit / Debit Card (Stripe)
        </label>
        <label>
          <input
            type="radio"
            value="paypal"
            checked={processor === 'paypal'}
            onChange={(e) => setProcessor(e.target.value)}
            disabled={loading}
          />
          PayPal
        </label>
      </div>

      {/* Stripe Form */}
      {processor === 'stripe' && (
        <form onSubmit={handleStripePayment}>
          <div className="card-element">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4'
                    }
                  },
                  invalid: {
                    color: '#fa755a'
                  }
                }
              }}
            />
          </div>

          <div className="payment-summary">
            <div>Amount: {amount} {currency}</div>
            <div>Fee: ~{(amount * 0.029 + 0.30).toFixed(2)}</div>
            <div className="total">
              Total: {(amount + amount * 0.029 + 0.30).toFixed(2)} {currency}
            </div>
          </div>

          <button type="submit" disabled={!stripe || loading} className="btn-primary">
            {loading ? 'Processing...' : `Pay ${amount} ${currency}`}
          </button>
        </form>
      )}

      {/* PayPal Form */}
      {processor === 'paypal' && (
        <form onSubmit={handlePayPalPayment}>
          <div className="payment-summary">
            <div>Amount: {amount} {currency}</div>
            <div>Fee: ~{(amount * 0.034 + 0.30).toFixed(2)}</div>
            <div className="total">
              Total: {(amount + amount * 0.034 + 0.30).toFixed(2)} {currency}
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-paypal">
            {loading ? 'Processing...' : 'Pay with PayPal'}
          </button>
        </form>
      )}
    </div>
  );
};
```

---

## 2. PayPal Integration

### 2.1 Setup

(See PayPal service implementation above - integration is similar to Stripe but with different API endpoints)

### 2.2 Environment Variables

```bash
PAYPAL_MODE=live
PAYPAL_CLIENT_ID=xxx
PAYPAL_CLIENT_SECRET=xxx
PAYPAL_WEBHOOK_ID=xxx
```

---

## 3. Database Migration

Create migration for Payment table:

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  payment_type VARCHAR(50) NOT NULL,
  amount NUMERIC(15,2) NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'USD',
  processor VARCHAR(20) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  processor_transaction_id VARCHAR(255) UNIQUE,
  payment_method_id VARCHAR(255),
  payment_method_brand VARCHAR(50),
  payment_method_last4 CHAR(4),
  description TEXT,
  metadata JSONB DEFAULT '{}',
  failure_reason TEXT,
  refunded_amount NUMERIC(15,2) DEFAULT 0,
  refund_ids JSONB DEFAULT '[]',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_processor ON payments(processor);
CREATE INDEX idx_payments_created_at ON payments(created_at);
```

---

## 4. Integration Checklist

- [ ] Stripe account created and API keys obtained
- [ ] PayPal account created and API keys obtained
- [ ] Backend services implemented (Stripe + PayPal)
- [ ] Payment model and migration created
- [ ] API routes for payment processing created
- [ ] Webhook handlers implemented
- [ ] Frontend payment forms created
- [ ] Testing with test credentials completed
- [ ] PCI compliance verified
- [ ] Webhook endpoints exposed and tested
- [ ] Error handling and logging implemented
- [ ] Monitoring and alerts set up
- [ ] Documentation updated

---

## 5. Testing

### Test Cards (Stripe)

```
4242 4242 4242 4242 - Success
4000 0000 0000 0002 - Declined
4000 0025 0000 3155 - Requires 3D Secure
4000 0027 6000 3184 - Requires 3D Secure (2.1.0)
```

### PayPal Sandbox

```
Buyer Email: sb-xxxxx@personal.example.com
Password: sandbox_password
```

---

## 6. Security Considerations

- **PCI Compliance**: Never store raw card data; use tokenization
- **HTTPS Only**: All payment communications must be encrypted
- **Webhook Validation**: Always validate webhook signatures
- **Rate Limiting**: Implement rate limiting on payment endpoints
- **Fraud Detection**: Monitor for suspicious patterns
- **Data Encryption**: Encrypt sensitive payment data in database
- **Audit Logging**: Log all payment transactions
- **3D Secure**: Enable for high-risk transactions

---

**Payment integration complete! 🚀**
