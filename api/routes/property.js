import express from 'express';
import { PrismaClient } from '@prisma/client';
import requireAuth from '../middleware/requireAuth.js';
import multer from 'multer';
import path from 'path';


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
    showPhone,
    latitude,
    longitude,
    units 
  } = req.body;
  if (
    !title || !type || !description || !location ||
    isNaN(parseInt(bedrooms)) || isNaN(parseInt(bathrooms)) ||
    typeof hasLivingRoom !== 'boolean' ||
    !['entire', 'units'].includes(rentalType) ||
    !Array.isArray(amenities) || !Array.isArray(imageUrls) ||
    isNaN(parseFloat(price)) || !['/day', '/month'].includes(priceUnit) ||
    !availableFrom || !contactName || !contactEmail || !contactPhone ||
    typeof showEmail !== 'boolean' || typeof showPhone !== 'boolean' ||
    isNaN(latitude) || isNaN(longitude)
  ) {
    return res.status(400).json({ error: 'Missing or invalid required fields' });
  }

  if (rentalType === 'units' && (!Array.isArray(units) || units.length === 0)) {
    return res.status(400).json({ error: 'Units are required when rentalType is "units"' });
  }

  if (rentalType === 'units') {
    for (const unit of units) {
      if (!['private', 'shared'].includes(unit.type) || isNaN(unit.quantity)) {
        return res.status(400).json({ error: 'Invalid unit configuration' });
      }
    }
  }
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
        latitude,
        longitude,
        ownerId: req.user.id,
        // if rental type is units, create them as nested records
        units: rentalType === 'units'
        ? {
            create: units.map(unit => ({
              type: unit.type,
              quantity: unit.quantity
            }))
          }
        : undefined
      
      },
      include: {
        units: true // include created units in response if needed
      }
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
      include: {
        owner: { select: { id: true, firstName: true, lastName: true, email: true } },
        units: true // 👈 Include the related units
      }
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
  // GET /api/my-listings
router.get('/my-listings', requireAuth, async (req, res) => {
  try {
    const listings = await prisma.property.findMany({
      where: { ownerId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });

    res.json(listings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user listings' });
  }
});

  // configure storage destination and filename
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`);
  }
});

const upload = multer({ storage });

router.post('/upload', upload.single('image'), (req, res) => {
  const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;
  res.json({ url: imageUrl });
});
router.delete('/properties/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await prisma.property.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Property deleted successfully', deleted });
  } catch (err) {
    console.error(err);

    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.status(500).json({ error: 'Failed to delete property' });
  }
});

export default router;

