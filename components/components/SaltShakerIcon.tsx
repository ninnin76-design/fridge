import React from 'react';

export const SaltShakerIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    {/* Cap (Dome) */}
    <path d="M16 8V6a4 4 0 0 0-8 0v2" />
    
    {/* Neck/Shoulder line */}
    <path d="M6 8h12" />
    
    {/* Body with rounded bottom */}
    <path d="M6 8v10a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4V8" />
    
    {/* Label Area (Rectangle inside) */}
    <rect x="9" y="12" width="6" height="5" rx="1" />
    
    {/* Holes (Dots) */}
    <circle cx="10" cy="5" r="1" fill="currentColor" stroke="none" />
    <circle cx="14" cy="5" r="1" fill="currentColor" stroke="none" />
    <circle cx="12" cy="3.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);