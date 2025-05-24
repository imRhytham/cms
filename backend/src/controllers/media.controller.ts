import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { Media } from '../models/media.model';
import { AppError } from '../middleware/error.middleware';

interface AuthRequest extends Request {
   user?: any;
   file?: Express.Multer.File;
}

// Helper function to generate CDN URL
const getCdnUrl = (filePath: string): string => {
   const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
   const relativePath = filePath.split('uploads')[1].replace(/\\/g, '/');
   return `${baseUrl}/uploads${relativePath}`;
};

// Upload media
export const uploadMedia = async (req: AuthRequest, res: Response) => {
   try {
      if (!req.file) {
         throw new AppError('No file uploaded', 400);
      }

      // Delete old file if exists
      const oldMedia = await Media.findOne().sort({ createdAt: -1 });
      if (oldMedia) {
         const oldFilePath = path.join(__dirname, '../../', oldMedia.path);
         try {
            fs.unlinkSync(oldFilePath);
         } catch (error) {
            console.error('Error deleting old file:', error);
         }
         await oldMedia.deleteOne();
      }

      const media = new Media({
         filename: req.file.filename,
         originalName: req.file.originalname,
         mimeType: req.file.mimetype,
         size: req.file.size,
         path: req.file.path,
         uploadedBy: req.user._id,
      });

      await media.save();

      res.status(201).json({
         message: 'File uploaded successfully',
         media: {
            id: media._id,
            filename: media.filename,
            originalName: media.originalName,
            mimeType: media.mimeType,
            size: media.size,
            url: getCdnUrl(media.path),
            uploadedBy: media.uploadedBy,
            createdAt: media.createdAt,
         },
      });
   } catch (error: any) {
      if (error instanceof AppError) {
         res.status(error.statusCode).json({ error: error.message });
      } else {
         res.status(500).json({ error: 'Error uploading file' });
      }
   }
};

// Get all media
export const getMedia = async (req: Request, res: Response) => {
   try {
      const media = await Media.findOne()
         .sort({ createdAt: -1 })
         .populate('uploadedBy', 'name email')
         .select('-__v');

      if (!media) {
         return res.json({ file: null });
      }

      res.json({
         file: {
            id: media._id,
            filename: media.filename,
            originalName: media.originalName,
            mimeType: media.mimeType,
            size: media.size,
            url: getCdnUrl(media.path),
            uploadedBy: media.uploadedBy,
            createdAt: media.createdAt,
         }
      });
   } catch (error) {
      res.status(500).json({ error: 'Error fetching media' });
   }
};
