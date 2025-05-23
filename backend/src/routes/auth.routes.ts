import express from 'express';
import { body } from 'express-validator';
import { login, getProfile, refreshToken, logout } from '../controllers/auth.controller';
import { auth } from '../middleware/auth.middleware';

const router = express.Router();

// Login route
router.post(
   '/login',
   [
      body('email').isEmail().withMessage('Please enter a valid email'),
      body('password').notEmpty().withMessage('Password is required'),
   ],
   login
);

// Refresh token route
router.post(
   '/refresh-token',
   [
      body('refreshToken').notEmpty().withMessage('Refresh token is required'),
   ],
   refreshToken
);

// Logout route
router.post('/logout', auth, logout);

// Get user profile (admin only)
router.get('/profile', auth, getProfile);

export default router; 