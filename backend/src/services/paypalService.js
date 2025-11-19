// PayPal payment service - handles all PayPal-related operations
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

    // Create axios instance with retry logic
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000
    });
  }

  /**
   * Get OAuth access token
   * @returns {Promise<string>} Access token
   */
  async getAccessToken() {
    try {
      const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
      const response = await this.client.post(
        '/v1/oauth2/token',
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
      console.error('Error getting PayPal access token:', error.message);
      throw new Error(`Failed to get PayPal access token: ${error.message}`);
    }
  }

  /**
   * Create order
   * @param {string} userId - User ID
   * @param {number} amount - Order amount
   * @param {string} currency - Currency code
   * @param {string} returnUrl - Return URL after approval
   * @param {string} cancelUrl - Cancel URL
   * @returns {Promise<object>} Order details
   */
  async createOrder(userId, amount, currency = 'USD', returnUrl, cancelUrl) {
    try {
      const token = await this.getAccessToken();

      const response = await this.client.post(
        '/v2/checkout/orders',
        {
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: currency,
                value: amount.toFixed(2)
              },
              description: 'CaribRemit Wallet Top-up',
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
      console.error('Error creating PayPal order:', error.message);
      return {
        success: false,
        message: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Capture order payment
   * @param {string} orderId - Order ID
   * @returns {Promise<object>} Capture details
   */
  async captureOrder(orderId) {
    try {
      const token = await this.getAccessToken();

      const response = await this.client.post(
        `/v2/checkout/orders/${orderId}/capture`,
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
          name: response.data.payer.name.given_name + ' ' + response.data.payer.name.surname
        }
      };
    } catch (error) {
      console.error('Error capturing PayPal order:', error.message);
      return {
        success: false,
        message: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Get order details
   * @param {string} orderId - Order ID
   * @returns {Promise<object>} Order details
   */
  async getOrderDetails(orderId) {
    try {
      const token = await this.getAccessToken();

      const response = await this.client.get(
        `/v2/checkout/orders/${orderId}`,
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
      console.error('Error fetching PayPal order details:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Refund captured payment
   * @param {string} captureId - Capture ID
   * @param {number} amount - Refund amount (optional, full refund if not provided)
   * @returns {Promise<object>} Refund details
   */
  async refundCapture(captureId, amount = null) {
    try {
      const token = await this.getAccessToken();

      const body = amount ? { amount: { value: amount.toFixed(2), currency_code: 'USD' } } : {};

      const response = await this.client.post(
        `/v2/payments/captures/${captureId}/refund`,
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
        status: response.data.status,
        amount: parseFloat(response.data.amount.value)
      };
    } catch (error) {
      console.error('Error refunding PayPal capture:', error.message);
      return {
        success: false,
        message: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Validate webhook signature
   * @param {object} body - Webhook body
   * @param {object} headers - Request headers
   * @returns {Promise<boolean>} Is webhook valid
   */
  async validateWebhook(body, headers) {
    try {
      const token = await this.getAccessToken();

      const response = await this.client.post(
        '/v1/notifications/verify-webhook-signature',
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

  /**
   * Get billing agreements
   * @param {string} customerId - PayPal customer ID
   * @returns {Promise<object>} List of agreements
   */
  async getAgreements(customerId) {
    try {
      const token = await this.getAccessToken();

      const response = await this.client.get(
        '/v1/billing-agreements/search',
        {
          params: {
            status: 'Active',
            payer_id: customerId
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      return {
        success: true,
        agreements: response.data.agreements || []
      };
    } catch (error) {
      console.error('Error fetching PayPal agreements:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Get transaction details
   * @param {string} transactionId - Transaction ID
   * @returns {Promise<object>} Transaction details
   */
  async getTransactionDetails(transactionId) {
    try {
      const token = await this.getAccessToken();

      const response = await this.client.get(
        `/v1/reporting/transactions/${transactionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      return {
        success: true,
        transaction: response.data
      };
    } catch (error) {
      console.error('Error fetching PayPal transaction:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  }
}

module.exports = new PayPalService();
