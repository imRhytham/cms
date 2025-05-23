import express from 'express';
import {
   submitContact,
   getContacts,
} from '../controllers/contact.controller';
import { adminAuth } from '../middleware/auth.middleware';
import { validate, contactSchema } from '../utils/validation';

const router = express.Router();

// Submit contact form (public)
router.post('/contact-us', validate(contactSchema), submitContact);

// Get all contacts (admin only)
router.get('/', adminAuth, getContacts);



export default router; 