// src/routes/users.js - User management routes

import express from 'express';

const router = express.Router();

/**
 * GET /api/v1/users/profile
 * Get user profile
 */
router.get('/profile', (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user?.userId,
      email: req.user?.email,
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
      kycStatus: 'verified',
      createdAt: new Date()
    }
  });
});

/**
 * PUT /api/v1/users/profile
 * Update user profile
 */
router.put('/profile', (req, res) => {
  const { firstName, lastName, phone } = req.body;

  res.json({
    success: true,
    message: 'Profile updated successfully',
    user: {
      id: req.user?.userId,
      firstName,
      lastName,
      phone
    }
  });
});

/**
 * POST /api/v1/users/addresses
 * Add address
 */
router.post('/addresses', (req, res) => {
  const { street, city, state, country, postalCode } = req.body;

  res.status(201).json({
    success: true,
    message: 'Address added successfully',
    address: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      userId: req.user?.userId,
      street,
      city,
      state,
      country,
      postalCode,
      isPrimary: false,
      createdAt: new Date()
    }
  });
});

/**
 * GET /api/v1/users/addresses
 * List addresses
 */
router.get('/addresses', (req, res) => {
  res.json({
    success: true,
    addresses: [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        street: '123 Main St',
        city: 'Kingston',
        state: 'ST',
        country: 'Jamaica',
        postalCode: 'JM1',
        isPrimary: true
      }
    ]
  });
});

/**
 * PUT /api/v1/users/addresses/:id
 * Update address
 */
router.put('/addresses/:id', (req, res) => {
  res.json({
    success: true,
    message: 'Address updated successfully'
  });
});

/**
 * DELETE /api/v1/users/addresses/:id
 * Delete address
 */
router.delete('/addresses/:id', (req, res) => {
  res.json({
    success: true,
    message: 'Address deleted successfully'
  });
});

/**
 * POST /api/v1/users/bank-accounts
 * Add bank account
 */
router.post('/bank-accounts', (req, res) => {
  const { bankName, accountNumber, accountType, currency } = req.body;

  res.status(201).json({
    success: true,
    message: 'Bank account added successfully',
    account: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      bankName,
      accountNumber: '****' + accountNumber.slice(-4),
      accountType,
      currency,
      isVerified: false
    }
  });
});

/**
 * GET /api/v1/users/bank-accounts
 * List bank accounts
 */
router.get('/bank-accounts', (req, res) => {
  res.json({
    success: true,
    accounts: [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        bankName: 'Bank of Jamaica',
        accountNumber: '****1234',
        accountType: 'savings',
        currency: 'JMD',
        isVerified: true
      }
    ]
  });
});

/**
 * DELETE /api/v1/users/bank-accounts/:id
 * Delete bank account
 */
router.delete('/bank-accounts/:id', (req, res) => {
  res.json({
    success: true,
    message: 'Bank account deleted successfully'
  });
});

export default router;
