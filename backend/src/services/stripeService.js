// Stripe payment service - handles all Stripe-related operations
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: process.env.STRIPE_API_VERSION || '2023-10-16',
  maxNetworkRetries: 3
});

class StripeService {
  /**
   * Create payment intent for card payments
   * @param {string} userId - User ID
   * @param {number} amount - Amount in USD
   * @param {string} currency - Currency code (default: USD)
   * @param {object} metadata - Additional metadata
   * @returns {Promise<object>} Payment intent details
   */
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
        statement_descriptor: 'CARIBREMIT'
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
      console.error('Error creating payment intent:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Retrieve payment intent
   * @param {string} intentId - Payment intent ID
   * @returns {Promise<object>} Payment intent details
   */
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
      console.error('Error retrieving payment intent:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Create customer for recurring payments
   * @param {string} userId - User ID
   * @param {string} email - Customer email
   * @param {object} metadata - Customer metadata
   * @returns {Promise<object>} Customer details
   */
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
      console.error('Error creating customer:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Save card for future use
   * @param {string} customerId - Stripe customer ID
   * @param {string} paymentMethodId - Payment method ID
   * @returns {Promise<object>} Payment method details
   */
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
        last4: paymentMethod.card.last4,
        expMonth: paymentMethod.card.exp_month,
        expYear: paymentMethod.card.exp_year
      };
    } catch (error) {
      console.error('Error saving card:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Refund payment
   * @param {string} paymentIntentId - Payment intent ID
   * @param {number} amount - Refund amount (optional, full refund if not provided)
   * @returns {Promise<object>} Refund details
   */
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
      console.error('Error refunding payment:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Create subscription
   * @param {string} customerId - Stripe customer ID
   * @param {string} priceId - Stripe price ID
   * @returns {Promise<object>} Subscription details
   */
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
      console.error('Error creating subscription:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Validate webhook signature
   * @param {object} body - Webhook body
   * @param {string} signature - Webhook signature
   * @returns {object} Validation result with event
   */
  validateWebhookSignature(body, signature) {
    try {
      const event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
      return { success: true, event };
    } catch (error) {
      console.error('Error validating webhook:', error.message);
      return { success: false, message: error.message };
    }
  }

  /**
   * Get all payment methods for customer
   * @param {string} customerId - Stripe customer ID
   * @returns {Promise<object>} List of payment methods
   */
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
      console.error('Error fetching payment methods:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Delete payment method
   * @param {string} paymentMethodId - Payment method ID
   * @returns {Promise<object>} Result
   */
  async deletePaymentMethod(paymentMethodId) {
    try {
      await stripe.paymentMethods.detach(paymentMethodId);
      return { success: true };
    } catch (error) {
      console.error('Error deleting payment method:', error.message);
      return { success: false, message: error.message };
    }
  }

  /**
   * Create charge (direct charge)
   * @param {number} amount - Amount in cents
   * @param {string} currency - Currency code
   * @param {string} source - Token or source ID
   * @param {object} metadata - Charge metadata
   * @returns {Promise<object>} Charge details
   */
  async createCharge(amount, currency, source, metadata = {}) {
    try {
      const charge = await stripe.charges.create({
        amount,
        currency: currency.toLowerCase(),
        source,
        metadata
      });

      return {
        success: charge.status === 'succeeded',
        chargeId: charge.id,
        status: charge.status,
        amount: charge.amount / 100
      };
    } catch (error) {
      console.error('Error creating charge:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  }
}

module.exports = new StripeService();
