import React from 'react';

const Logo: React.FC = () => (
  <img 
    src="https://raw.githubusercontent.com/stackblitz/stackblitz-images/main/tempnest-logo.png" 
    alt="TempNest Logo" 
    style={{ 
      width: '100px', 
      height: 'auto',
      objectFit: 'contain'
    }} 
  />
);

export default Logo;