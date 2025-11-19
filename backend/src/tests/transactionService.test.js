// src/tests/transactionService.test.js - Transaction service tests

import transactionService from '../services/transactionService';

describe('TransactionService', () => {
  describe('getQuote', () => {
    it('should return a quote for valid transfer', async () => {
      const senderId = '123e4567-e89b-12d3-a456-426614174000';
      const recipientId = '223e4567-e89b-12d3-a456-426614174001';
      const amount = 500;
      const sendCurrency = 'USD';
      const receiveCurrency = 'JMD';

      const quote = await transactionService.getQuote(
        senderId,
        recipientId,
        amount,
        sendCurrency,
        receiveCurrency
      );

      expect(quote).toHaveProperty('exchangeRate');
      expect(quote).toHaveProperty('amountReceived');
      expect(quote).toHaveProperty('fee');
      expect(quote.amountSent).toBe(amount);
      expect(quote.currencySent).toBe(sendCurrency);
    });
  });

  describe('initiateTransfer', () => {
    it('should initiate a transfer', async () => {
      const senderId = '123e4567-e89b-12d3-a456-426614174000';
      const recipientId = '223e4567-e89b-12d3-a456-426614174001';
      const amount = 500;
      const paymentMethod = 'card';

      const result = await transactionService.initiateTransfer(
        senderId,
        recipientId,
        amount,
        paymentMethod
      );

      expect(result.success).toBe(true);
      expect(result).toHaveProperty('transactionId');
      expect(result.status).toBe('pending');
    });
  });

  describe('trackTransfer', () => {
    it('should track transfer status', async () => {
      const transactionId = '323e4567-e89b-12d3-a456-426614174002';
      const userId = '123e4567-e89b-12d3-a456-426614174000';

      const result = await transactionService.trackTransfer(transactionId, userId);

      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('events');
    });
  });

  describe('validateTransferLimit', () => {
    it('should validate transfer limits', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const amount = 1000;

      const result = await transactionService.validateTransferLimit(userId, amount);

      expect(result.isValid).toBe(true);
      expect(result).toHaveProperty('remainingDaily');
      expect(result).toHaveProperty('remainingMonthly');
    });
  });
});
