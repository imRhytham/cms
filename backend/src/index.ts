import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Routes
import authRoutes from './routes/auth.routes';
import contactRoutes from './routes/contact.routes'
import mediaRoutes from './routes/media.routes'
import { errorHandler } from './middleware/error.middleware';


dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Database connection
mongoose
   .connect(process.env.MONGODB_URI!)
   .then(() => console.log('Connected to MongoDB'))
   .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes)
app.use('/api/file', mediaRoutes)

// Error handling
app.use(errorHandler);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
}); 