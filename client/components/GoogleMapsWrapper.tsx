// client/components/GoogleMapsWrapper.tsx
import React from 'react';
import { LoadScript } from '@react-google-maps/api';

const libraries = ['places'];

const GoogleMapsWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY!}
      libraries={libraries}
    >
      {children}
    </LoadScript>
  );
};

export default GoogleMapsWrapper;
