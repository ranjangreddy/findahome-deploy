import React from 'react';
import { render, screen } from '@testing-library/react';
import PreviewListing from '../components/PreviewListing';
import { MemoryRouter } from 'react-router-dom';

// Mock data for localStorage
const mockPropertyData = {
  name: 'Modern Apartment',
  type: 'Studio',
  location: 'Boston',
  description: 'A beautiful and cozy studio apartment.',
  bedrooms: 1,
  bathrooms: 1,
  hasLivingRoom: false,
  rentalType: 'entire',
  units: [],
  amenities: ['WiFi', 'Air Conditioning'],
  photoUrls: ['https://via.placeholder.com/150'],
  contactName: 'John Doe',
  contactEmail: 'john@example.com',
  showEmail: true,
  contactPhone: '1234567890',
  showPhone: true,
  price: '1200',
  priceUnit: '/month',
  availableFrom: '2025-05-01',
  availableTo: '2025-08-31',
  latitude: 42.3601,
  longitude: -71.0589
};

describe('PreviewListing', () => {
  beforeEach(() => {
    localStorage.setItem('propertyData', JSON.stringify(mockPropertyData));
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('renders property name and type correctly', () => {
    render(
      <MemoryRouter>
        <PreviewListing />
      </MemoryRouter>
    );

    expect(screen.getByText('Modern Apartment')).toBeInTheDocument();
    expect(screen.getByText('Studio')).toBeInTheDocument();
  });
});