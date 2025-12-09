import React from 'react';

export const CustomKeyIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
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
    {/* Head of the key (Circle) */}
    <circle cx="15.5" cy="8.5" r="4.5" />
    
    {/* Hole in the key head */}
    <circle cx="15.5" cy="8.5" r="1.5" fill="currentColor" stroke="none" />
    
    {/* Shaft */}
    <path d="M12.5 11.5L5 19" />
    
    {/* Teeth */}
    <path d="M5 19L4 18" />
    <path d="M7.5 16.5L6 18" />
    <path d="M9.5 14.5L8.5 15.5" />
  </svg>
);