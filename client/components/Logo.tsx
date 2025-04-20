import React from 'react';
import logo from './logo.png'; // ✅ Correct way to import in Vite

const Logo: React.FC = () => (
  <img 
    src={logo} 
    alt="TempNest Logo" 
    style={{ 
      width: '100px', 
      height: 'auto',
      objectFit: 'contain',
      borderRadius:'16px'
    }} 
  />
);

export default Logo;
