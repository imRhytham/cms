import { Request, Response } from 'express';
import { Media } from '../models/media.model';
import { AppError } from '../middleware/error.middleware';

interface AuthRequest extends Request {
   user?: any;
   body: {
      url: string;
      filename: string;
      mimeType: string;
      size: number;
   };
}

// Update media URL
export const updateMedia = async (req: AuthRequest, res: Response) => {
   try {
      const { url, filename, mimeType, size } = req.body;

      if (!url) {
         throw new AppError('URL is required', 400);
      }

      // Delete old media if exists
      const oldMedia = await Media.findOne().sort({ createdAt: -1 });
      if (oldMedia) {
         await oldMedia.deleteOne();
      }

      const media = new Media({
         filename,
         originalName: filename,
         mimeType,
         size,
         url,
         uploadedBy: req.user._id,
      });

      await media.save();

      res.status(201).json({
         message: 'Media URL updated successfully',
         media: {
            id: media._id,
            filename: media.filename,
            originalName: media.originalName,
            mimeType: media.mimeType,
            size: media.size,
            url: media.url,
            uploadedBy: media.uploadedBy,
            createdAt: media.createdAt,
         },
      });
   } catch (error: any) {
      if (error instanceof AppError) {
         res.status(error.statusCode).json({ error: error.message });
      } else {
         res.status(500).json({ error: 'Error updating media URL' });
      }
   }
};

// Get media
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
            url: media.url,
            uploadedBy: media.uploadedBy,
            createdAt: media.createdAt,
         }
      });
   } catch (error) {
      res.status(500).json({ error: 'Error fetching media' });
   }
};
