import express from 'express';
import { PrismaClient } from '@prisma/client';
import requireAuth from '../middleware/requireAuth.js';

const prisma = new PrismaClient();
const router = express.Router();

// POST /api/properties (Authenticated)
router.post('/properties', requireAuth, async (req, res) => {
  const {
    title,
    type,
    description,
    location,
    bedrooms,
    bathrooms,
    hasLivingRoom,
    rentalType,
    amenities,
    imageUrls,
    price,
    priceUnit,
    availableFrom,
    availableTo,
    contactName,
    contactEmail,
    showEmail,
    contactPhone,
    showPhone
  } = req.body;

  try {
    const property = await prisma.property.create({
      data: {
        title,
        type,
        description,
        location,
        bedrooms: parseInt(bedrooms),
        bathrooms: parseInt(bathrooms),
        hasLivingRoom,
        rentalType,
        amenities: JSON.stringify(amenities),
        imageUrls: JSON.stringify(imageUrls),
        price: parseFloat(price),
        priceUnit,
        availableFrom: new Date(availableFrom),
        availableTo: availableTo ? new Date(availableTo) : null,
        contactName,
        contactEmail,
        showEmail,
        contactPhone,
        showPhone,
        ownerId: req.user.id,
      },
    });

    res.status(201).json({ message: 'Property listed successfully', property });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to list property' });
  }
});
router.get('/properties/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const property = await prisma.property.findUnique({
        where: { id: parseInt(id) },
        include: { owner: { select: { id: true, firstName: true, lastName: true, email: true } } }
      });
  
      if (!property) return res.status(404).json({ error: 'Property not found' });
  
      res.json(property);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch property' });
    }
  });
  router.get('/properties', async (req, res) => {
    try {
      const properties = await prisma.property.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          }
        }
      });
  
      res.json(properties);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch listings' });
    }
  });
  router.get('/users/:id/listings', async (req, res) => {
    const { id } = req.params;
  
    try {
      const listings = await prisma.property.findMany({
        where: { ownerId: parseInt(id) },
        orderBy: { createdAt: 'desc' }
      });
  
      res.json(listings);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch user listings' });
    }
  });
  
export default router;