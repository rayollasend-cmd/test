// src/routes/rates.js - Exchange rate routes

import express from 'express';
import rateService from '../services/rateService.js';

const router = express.Router();

/**
 * GET /api/v1/rates
 * Get current exchange rates
 */
router.get('/', async (req, res) => {
  try {
    const rates = await rateService.getCurrentRates();

    res.json({
      success: true,
      ...rates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/v1/rates/:from/:to
 * Get specific exchange rate
 */
router.get('/:from/:to', async (req, res) => {
  try {
    const { from, to } = req.params;

    if (!from || !to) {
      return res.status(400).json({
        success: false,
        message: 'Missing currency codes'
      });
    }

    const rate = await rateService.getRate(from, to);

    res.json({
      success: true,
      ...rate
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/v1/rates/historical
 * Get historical exchange rates
 */
router.get('/historical/:from/:to', async (req, res) => {
  try {
    const { from, to } = req.params;
    const { startDate, endDate } = req.query;

    if (!from || !to || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters'
      });
    }

    const rates = await rateService.getHistoricalRates(
      from,
      to,
      startDate,
      endDate
    );

    res.json({
      success: true,
      ...rates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
