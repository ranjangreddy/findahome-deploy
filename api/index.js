import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import requireAuth from './middleware/requireAuth.js';
import propertyRoutes from './routes/property.js';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

const app = express();
const prisma = new PrismaClient();
const PORT = 3000;
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, // needed to allow cookies
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api', authRoutes);

app.get('/ping', (req, res) => res.send('pong'));

// Protected example route
app.get('/api/protected', requireAuth, (req, res) => {
  res.json({ message: 'You are authenticated!', user: req.user });
});
app.use('/api', propertyRoutes);
app.use('/uploads', express.static('uploads'));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
