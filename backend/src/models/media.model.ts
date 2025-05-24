import mongoose, { Document, Schema } from 'mongoose';

export interface IMedia extends Document {
   filename: string;
   originalName: string;
   mimeType: string;
   size: number;
   url: string;
   uploadedBy: mongoose.Types.ObjectId;
   createdAt: Date;
   updatedAt: Date;
}

const mediaSchema = new Schema<IMedia>(
   {
      filename: {
         type: String,
         required: true,
      },
      originalName: {
         type: String,
         required: true,
      },
      mimeType: {
         type: String,
         required: true,
      },
      size: {
         type: Number,
         required: true,
      },
      url: {
         type: String,
         required: true,
      },
      uploadedBy: {
         type: Schema.Types.ObjectId,
         ref: 'User',
         required: true,
      },
   },
   {
      timestamps: true,
   }
);

export const Media = mongoose.model<IMedia>('Media', mediaSchema); 