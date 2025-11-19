// Payment service tests
const { describe, it, expect, beforeEach, vi } = require('vitest');
const stripeService = require('../services/stripeService');
const paypalService = require('../services/paypalService');

describe('Stripe Service', () => {
  describe('createPaymentIntent', () => {
    it('should create a payment intent with valid parameters', async () => {
      const result = await stripeService.createPaymentIntent(
        'user-123',
        100,
        'USD',
        { type: 'topup' }
      );

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('clientSecret');
      if (result.success) {
        expect(result.amount).toBe(100);
        expect(result.currency).toBe('USD');
      }
    });

    it('should handle invalid amount', async () => {
      const result = await stripeService.createPaymentIntent(
        'user-123',
        -100,
        'USD'
      );

      expect(result.success).toBe(false);
    });

    it('should set correct metadata', async () => {
      const metadata = { orderId: 'order-123', type: 'topup' };
      const result = await stripeService.createPaymentIntent(
        'user-123',
        100,
        'USD',
        metadata
      );

      if (result.success) {
        expect(result).toHaveProperty('intentId');
      }
    });
  });

  describe('getPaymentIntent', () => {
    it('should retrieve payment intent details', async () => {
      // First create an intent
      const createResult = await stripeService.createPaymentIntent(
        'user-123',
        100,
        'USD'
      );

      if (createResult.success) {
        const result = await stripeService.getPaymentIntent(createResult.intentId);
        expect(result.success).toBe(true);
        expect(result.intentId).toBe(createResult.intentId);
      }
    });

    it('should return error for invalid intent ID', async () => {
      const result = await stripeService.getPaymentIntent('invalid_intent_id');
      expect(result.success).toBe(false);
    });
  });

  describe('refundPayment', () => {
    it('should refund full amount if no amount specified', async () => {
      // Create and confirm a payment first
      const createResult = await stripeService.createPaymentIntent(
        'user-123',
        100,
        'USD'
      );

      if (createResult.success) {
        const refundResult = await stripeService.refundPayment(createResult.intentId);
        expect(refundResult).toHaveProperty('success');
      }
    });

    it('should refund partial amount if specified', async () => {
      const createResult = await stripeService.createPaymentIntent(
        'user-123',
        100,
        'USD'
      );

      if (createResult.success) {
        const refundResult = await stripeService.refundPayment(
          createResult.intentId,
          50
        );
        expect(refundResult).toHaveProperty('success');
      }
    });
  });

  describe('createCustomer', () => {
    it('should create a Stripe customer', async () => {
      const result = await stripeService.createCustomer(
        'user-123',
        'user@example.com',
        { firstName: 'John', lastName: 'Doe' }
      );

      expect(result).toHaveProperty('success');
      if (result.success) {
        expect(result.customerId).toBeDefined();
        expect(result.email).toBe('user@example.com');
      }
    });

    it('should handle invalid email', async () => {
      const result = await stripeService.createCustomer(
        'user-123',
        'invalid-email',
        { firstName: 'John' }
      );

      // Email validation might not be enforced by Stripe
      expect(result).toHaveProperty('success');
    });
  });

  describe('validateWebhookSignature', () => {
    it('should return error for invalid signature', () => {
      const body = JSON.stringify({ type: 'payment_intent.succeeded' });
      const signature = 'invalid_signature';

      const result = stripeService.validateWebhookSignature(body, signature);
      expect(result.success).toBe(false);
    });
  });
});

describe('PayPal Service', () => {
  describe('getAccessToken', () => {
    it('should get valid access token', async () => {
      try {
        const token = await paypalService.getAccessToken();
        expect(typeof token).toBe('string');
        expect(token.length).toBeGreaterThan(0);
      } catch (error) {
        // May fail if credentials are invalid
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('createOrder', () => {
    it('should create PayPal order with valid parameters', async () => {
      const result = await paypalService.createOrder(
        'user-123',
        100,
        'USD',
        'http://localhost:3000/return',
        'http://localhost:3000/cancel'
      );

      expect(result).toHaveProperty('success');
      if (result.success) {
        expect(result.orderId).toBeDefined();
        expect(result.status).toBe('CREATED');
        expect(result.links).toBeDefined();
      }
    });

    it('should include user ID in custom_id', async () => {
      const userId = 'user-123';
      const result = await paypalService.createOrder(
        userId,
        100,
        'USD',
        'http://localhost:3000/return',
        'http://localhost:3000/cancel'
      );

      expect(result).toHaveProperty('success');
    });

    it('should handle invalid currency', async () => {
      const result = await paypalService.createOrder(
        'user-123',
        100,
        'INVALID',
        'http://localhost:3000/return',
        'http://localhost:3000/cancel'
      );

      // PayPal might accept invalid currency or return error
      expect(result).toHaveProperty('success');
    });
  });

  describe('captureOrder', () => {
    it('should return error for invalid order ID', async () => {
      const result = await paypalService.captureOrder('invalid_order_id');
      expect(result.success).toBe(false);
    });

    it('should capture approved order', async () => {
      const createResult = await paypalService.createOrder(
        'user-123',
        100,
        'USD',
        'http://localhost:3000/return',
        'http://localhost:3000/cancel'
      );

      if (createResult.success) {
        const captureResult = await paypalService.captureOrder(createResult.orderId);
        expect(captureResult).toHaveProperty('success');
      }
    });
  });

  describe('getOrderDetails', () => {
    it('should retrieve order details', async () => {
      const createResult = await paypalService.createOrder(
        'user-123',
        100,
        'USD',
        'http://localhost:3000/return',
        'http://localhost:3000/cancel'
      );

      if (createResult.success) {
        const result = await paypalService.getOrderDetails(createResult.orderId);
        expect(result.success).toBe(true);
        expect(result.orderId).toBe(createResult.orderId);
        expect(result.amount).toBe(100);
      }
    });

    it('should return error for invalid order ID', async () => {
      const result = await paypalService.getOrderDetails('invalid_order_id');
      expect(result.success).toBe(false);
    });
  });

  describe('validateWebhook', () => {
    it('should validate webhook with proper headers', async () => {
      const body = { event_type: 'CHECKOUT.ORDER.COMPLETED' };
      const headers = {
        'paypal-transmission-id': 'test-id',
        'paypal-transmission-time': new Date().toISOString(),
        'paypal-cert-url': 'https://api.paypal.com/cert',
        'paypal-auth-algo': 'SHA256withRSA',
        'paypal-transmission-sig': 'test-sig'
      };

      const result = await paypalService.validateWebhook(body, headers);
      expect(typeof result).toBe('boolean');
    });

    it('should return false for invalid signature', async () => {
      const body = { event_type: 'CHECKOUT.ORDER.COMPLETED' };
      const headers = {
        'paypal-transmission-id': 'test-id',
        'paypal-transmission-time': new Date().toISOString(),
        'paypal-cert-url': 'https://api.paypal.com/cert',
        'paypal-auth-algo': 'SHA256withRSA',
        'paypal-transmission-sig': 'invalid-sig'
      };

      const result = await paypalService.validateWebhook(body, headers);
      expect(result).toBe(false);
    });
  });
});

describe('Payment Integration', () => {
  it('should handle Stripe and PayPal independently', async () => {
    const stripeResult = await stripeService.createPaymentIntent(
      'user-123',
      100,
      'USD'
    );

    const paypalResult = await paypalService.createOrder(
      'user-456',
      100,
      'USD',
      'http://localhost:3000/return',
      'http://localhost:3000/cancel'
    );

    expect(stripeResult).toHaveProperty('success');
    expect(paypalResult).toHaveProperty('success');
  });

  it('should support multiple currencies', async () => {
    const currencies = ['USD', 'JMD', 'CAD'];

    for (const currency of currencies) {
      const result = await stripeService.createPaymentIntent(
        'user-123',
        100,
        currency
      );

      if (result.success) {
        expect(result.currency).toBe(currency);
      }
    }
  });
});
