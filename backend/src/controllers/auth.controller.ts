import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import jwt, { SignOptions } from 'jsonwebtoken';
import { User, IUser } from '../models/user.model';
import { AppError } from '../middleware/error.middleware';
import crypto from 'crypto';

interface AuthRequest extends Request {
   user?: any;
}

interface TokenPayload {
   _id: string;
}

// Generate tokens
const generateTokens = (userId: string) => {
   const payload: TokenPayload = { _id: userId };
   const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET!,
      { expiresIn: '15m' } as SignOptions
   );

   const refreshToken = crypto.randomBytes(40).toString('hex');
   return { accessToken, refreshToken };
};

// Login user
export const login = async (req: Request, res: Response) => {
   try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         throw new AppError('Validation Error', 400);
      }

      const { email, password } = req.body as { email: string; password: string };

      // Find user
      const user = await User.findOne({ email }) as IUser;
      if (!user) {
         throw new AppError('Invalid credentials', 401);
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
         throw new AppError('Invalid credentials', 401);
      }

      // Generate tokens
      const { accessToken, refreshToken } = generateTokens(user._id.toString());

      // Save refresh token to user
      user.refreshToken = refreshToken;
      await user.save();

      res.json({
         user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
         },
         accessToken,
         refreshToken,
      });
   } catch (error: any) {
      if (error instanceof AppError) {
         res.status(error.statusCode).json({ error: error.message });
      } else {
         res.status(500).json({ error: 'Error logging in' });
      }
   }
};

// Refresh token
export const refreshToken = async (req: Request, res: Response) => {
   try {
      const { refreshToken } = req.body as { refreshToken: string };

      if (!refreshToken) {
         throw new AppError('Refresh token is required', 400);
      }

      // Find user with refresh token
      const user = await User.findOne({ refreshToken }) as IUser;
      if (!user) {
         throw new AppError('Invalid refresh token', 401);
      }

      // Generate new tokens
      const tokens = generateTokens(user._id.toString());

      // Update refresh token
      user.refreshToken = tokens.refreshToken;
      await user.save();

      res.json({
         accessToken: tokens.accessToken,
         refreshToken: tokens.refreshToken,
      });
   } catch (error: any) {
      if (error instanceof AppError) {
         res.status(error.statusCode).json({ error: error.message });
      } else {
         res.status(500).json({ error: 'Error refreshing token' });
      }
   }
};

// Logout
export const logout = async (req: AuthRequest, res: Response) => {
   try {
      const user = await User.findById(req.user._id);
      if (user) {
         user.refreshToken = undefined;
         await user.save();
      }

      res.json({ message: 'Logged out successfully' });
   } catch (error) {
      res.status(500).json({ error: 'Error logging out' });
   }
};

// Get user profile
export const getProfile = async (req: AuthRequest, res: Response) => {
   try {
      const user = await User.findById(req.user._id).select('-password -refreshToken');
      if (!user) {
         throw new AppError('User not found', 404);
      }

      res.json({
         user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
         },
      });
   } catch (error: any) {
      if (error instanceof AppError) {
         res.status(error.statusCode).json({ error: error.message });
      } else {
         res.status(500).json({ error: 'Error fetching profile' });
      }
   }
}; 