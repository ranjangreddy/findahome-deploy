import express from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = 'tempnest_secret';

// Cookie options
const cookieOptions = {
  httpOnly: true,
  maxAge: 60 * 60 * 1000, // 1 hour
};

// REGISTER
router.post('/register', async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
  
    try {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }
  
      const newUser = await prisma.user.create({
        data: {
          email,
          password,
          firstName,
          lastName,
          dateCreated: new Date(),
        },
      });
  
      res.status(201).json({ message: 'User registered', user: newUser });
    } catch (err) {
      console.error('❌ Registration error:', err); // Add this!
      res.status(500).json({ error: 'Registration failed' });
    }
  });
  

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

  res.cookie('token', token, cookieOptions);
  res.json({ message: 'Login successful' });
});

// LOGOUT
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});

export default router;
