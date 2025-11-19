// src/routes/transactions.js - Transaction routes

import express from 'express';
import transactionService from '../services/transactionService.js';

const router = express.Router();

/**
 * POST /api/v1/transactions/quote
 * Get transfer quote
 */
router.post('/quote', async (req, res) => {
  try {
    const { recipientId, amount, sendCurrency, receiveCurrency } = req.body;

    if (!recipientId || !amount || !sendCurrency || !receiveCurrency) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const quote = await transactionService.getQuote(
      req.user?.userId,
      recipientId,
      amount,
      sendCurrency,
      receiveCurrency
    );

    res.json({
      success: true,
      quote
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * POST /api/v1/transactions/initiate
 * Initiate transfer
 */
router.post('/initiate', async (req, res) => {
  try {
    const { recipientId, amount, paymentMethod } = req.body;

    if (!recipientId || !amount || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const result = await transactionService.initiateTransfer(
      req.user?.userId,
      recipientId,
      amount,
      paymentMethod
    );

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/v1/transactions
 * List transactions
 */
router.get('/', async (req, res) => {
  try {
    const { status, dateFrom, dateTo, limit, offset } = req.query;

    const result = await transactionService.getTransactionHistory(
      req.user?.userId,
      { status, dateFrom, dateTo, limit, offset }
    );

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/v1/transactions/:id
 * Get transaction details
 */
router.get('/:id', (req, res) => {
  res.json({
    success: true,
    transaction: {
      id: req.params.id,
      senderId: req.user?.userId,
      amount: 500,
      currency: 'USD',
      recipientName: 'Jane Doe',
      status: 'completed',
      fee: 10,
      exchangeRate: 150.25,
      amountReceived: 7250,
      createdAt: new Date()
    }
  });
});

/**
 * POST /api/v1/transactions/:id/cancel
 * Cancel transaction
 */
router.post('/:id/cancel', async (req, res) => {
  try {
    const { reason } = req.body;

    const result = await transactionService.cancelTransfer(
      req.params.id,
      reason
    );

    res.json({
      success: true,
      message: 'Transaction cancelled successfully',
      ...result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/v1/transactions/:id/track
 * Track transfer status
 */
router.get('/:id/track', async (req, res) => {
  try {
    const result = await transactionService.trackTransfer(
      req.params.id,
      req.user?.userId
    );

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
