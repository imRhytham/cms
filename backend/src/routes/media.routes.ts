import express from 'express';
import multer from 'multer';
import path from 'path';
import {
   uploadMedia,
   getMedia,
} from '../controllers/media.controller';
import { adminAuth } from '../middleware/auth.middleware';

// Configure multer for file upload
const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../../uploads'));
   },
   filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(
         null,
         file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
      );
   },
});

const upload = multer({
   storage,
   limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
   },
   fileFilter: (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png|gif|webp/;
      const extname = allowedTypes.test(
         path.extname(file.originalname).toLowerCase()
      );
      const mimetype = allowedTypes.test(file.mimetype);

      if (extname && mimetype) {
         return cb(null, true);
      }
      cb(new Error('Only images are allowed!'));
   },
});

const router = express.Router();

// Upload media (admin only)
router.post('/upload', adminAuth, upload.single('file'), uploadMedia);

// Get all media (public)
router.get('/all', getMedia);


export default router; 