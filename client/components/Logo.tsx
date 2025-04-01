import React from 'react';

const Logo: React.FC = () => (
  <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* House */}
    <path
      d="M30 60 L30 40 L50 25 L70 40 L70 60"
      stroke="#007A33"
      strokeWidth="4"
      fill="none"
    />
    {/* Door */}
    <path
      d="M45 60 L45 50 L55 50 L55 60"
      stroke="#007A33"
      strokeWidth="4"
      fill="none"
    />
    {/* Tree Circle */}
    <circle cx="75" cy="35" r="12" fill="#007A33" fillOpacity="0.3"/>
    {/* Tree Trunk */}
    <path
      d="M75 25 L75 45"
      stroke="#007A33"
      strokeWidth="4"
    />
    {/* Ground Line */}
    <line x1="20" y1="60" x2="80" y2="60" stroke="#007A33" strokeWidth="4"/>
    {/* Dots */}
    <circle cx="85" cy="60" r="2" fill="#007A33"/>
    <circle cx="90" cy="60" r="2" fill="#007A33"/>
    <circle cx="95" cy="60" r="2" fill="#007A33"/>
  </svg>
);

export default Logo;