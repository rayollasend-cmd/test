// src/routes/wallets.js - Wallet management routes

import express from 'express';
import walletService from '../services/walletService.js';

const router = express.Router();

/**
 * GET /api/v1/wallets
 * Get all wallets
 */
router.get('/', async (req, res) => {
  try {
    res.json({
      success: true,
      wallets: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          userId: req.user?.userId,
          currency: 'USD',
          balance: 1000,
          availableBalance: 900
        },
        {
          id: '223e4567-e89b-12d3-a456-426614174001',
          userId: req.user?.userId,
          currency: 'JMD',
          balance: 150000,
          availableBalance: 145000
        }
      ]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/v1/wallets/:currency
 * Get wallet balance for specific currency
 */
router.get('/:currency', async (req, res) => {
  try {
    const wallet = await walletService.getWallet(
      req.user?.userId,
      req.params.currency
    );

    res.json({
      success: true,
      wallet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * POST /api/v1/wallets/top-up
 * Top up wallet
 */
router.post('/top-up', async (req, res) => {
  try {
    const { currency, amount, paymentMethod } = req.body;

    if (!currency || !amount || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const result = await walletService.topUp(
      req.user?.userId,
      currency,
      amount,
      paymentMethod
    );

    res.status(201).json({
      success: true,
      message: 'Top-up initiated successfully',
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
 * POST /api/v1/wallets/convert
 * Convert currency
 */
router.post('/convert', async (req, res) => {
  try {
    const { fromCurrency, toCurrency, amount } = req.body;

    if (!fromCurrency || !toCurrency || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const result = await walletService.convertCurrency(
      req.user?.userId,
      fromCurrency,
      toCurrency,
      amount
    );

    res.json({
      success: true,
      message: 'Conversion completed successfully',
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
 * POST /api/v1/wallets/transfer
 * Transfer between wallets
 */
router.post('/transfer', async (req, res) => {
  try {
    const { fromCurrency, toCurrency, amount } = req.body;

    if (!fromCurrency || !toCurrency || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const result = await walletService.transferBetweenWallets(
      req.user?.userId,
      fromCurrency,
      toCurrency,
      amount
    );

    res.json({
      success: true,
      message: 'Transfer completed successfully',
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
