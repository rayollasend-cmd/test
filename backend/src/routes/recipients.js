// src/routes/recipients.js - Recipient management routes

import express from 'express';
import recipientService from '../services/recipientService.js';

const router = express.Router();

/**
 * POST /api/v1/recipients
 * Create recipient
 */
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, country, recipientType } = req.body;

    if (!firstName || !lastName || !country) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const recipient = await recipientService.addRecipient(req.user?.userId, {
      firstName,
      lastName,
      country,
      recipientType
    });

    res.status(201).json({
      success: true,
      message: 'Recipient added successfully',
      recipient
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/v1/recipients
 * List recipients
 */
router.get('/', async (req, res) => {
  try {
    const result = await recipientService.getRecipients(req.user?.userId);

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
 * GET /api/v1/recipients/:id
 * Get recipient details
 */
router.get('/:id', (req, res) => {
  res.json({
    success: true,
    recipient: {
      id: req.params.id,
      firstName: 'Jane',
      lastName: 'Doe',
      country: 'Jamaica',
      recipientType: 'bank_account',
      isVerified: true,
      createdAt: new Date()
    }
  });
});

/**
 * PUT /api/v1/recipients/:id
 * Update recipient
 */
router.put('/:id', async (req, res) => {
  try {
    const result = await recipientService.updateRecipient(
      req.params.id,
      req.user?.userId,
      req.body
    );

    res.json({
      success: true,
      message: 'Recipient updated successfully',
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
 * DELETE /api/v1/recipients/:id
 * Delete recipient
 */
router.delete('/:id', async (req, res) => {
  try {
    const result = await recipientService.deleteRecipient(
      req.params.id,
      req.user?.userId
    );

    res.json({
      success: true,
      message: 'Recipient deleted successfully',
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
