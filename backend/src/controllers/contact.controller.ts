import { Request, Response } from 'express';
import { Contact } from '../models/contact.model';
import { AppError } from '../middleware/error.middleware';

// Submit contact form
export const submitContact = async (req: Request, res: Response) => {
   try {
      const { name, email, message, pincode, phone } = req.body;


      const contact = new Contact({
         name,
         email: email.toLowerCase(),
         message,
         pincode,
         phone
      });

      await contact.save();

      res.status(201).json({
         message: 'Contact form submitted successfully',
         contact: {
            id: contact._id,
            name: contact.name,
            email: contact.email,
            message: contact.message,
            pincode: contact.pincode,
            phone: contact.phone,
            createdAt: contact.createdAt,
         },
      });
   } catch (error: any) {

      if (error instanceof AppError) {
         res.status(error.statusCode).json({ error: error.message });
      } else {
         res.status(500).json({ error: 'Error submitting contact form' });
      }
   }
};

// Get all contacts (admin only)
export const getContacts = async (req: Request, res: Response) => {
   try {
      const contacts = await Contact.find()
         .sort({ createdAt: -1 })
         .select('-__v');

      res.json({
         contacts: contacts.map((contact) => ({
            id: contact._id,
            name: contact.name,
            email: contact.email,
            message: contact.message,
            phone: contact.phone,
            pincode: contact.pincode,
            createdAt: contact.createdAt,
            updatedAt: contact.updatedAt,
         })),
      });
   } catch (error) {
      res.status(500).json({ error: 'Error fetching contacts' });
   }
};

