import mongoose, { Document, Schema, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
   _id: Types.ObjectId;
   name: string;
   email: string;
   password: string;
   role: 'admin' | 'user';
   refreshToken?: string;
   comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
   {
      name: {
         type: String,
         required: true,
         trim: true,
      },
      email: {
         type: String,
         required: true,
         unique: true,
         trim: true,
         lowercase: true,
      },
      password: {
         type: String,
         required: true,
         minlength: 6,
      },
      role: {
         type: String,
         enum: ['admin', 'user'],
         default: 'user',
      },
      refreshToken: {
         type: String,
         default: null,
      },
   },
   {
      timestamps: true,
   }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
   if (!this.isModified('password')) return next();

   try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
   } catch (error: any) {
      next(error);
   }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
   return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema); 