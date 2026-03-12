import React from 'react';

const Logo = ({ size = 48, style = {} }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    style={{ ...style }}
  >
    {/* Background soft glow - Neural Field */}
    <circle cx="50" cy="50" r="45" fill="#bc13fe" fillOpacity="0.05" />
    
    {/* Bridge Path 1 - Left Logic Branch */}
    <path 
        d="M20 30 C 30 30, 40 50, 50 50" 
        stroke="#bc13fe" 
        strokeWidth="6" 
        strokeLinecap="round" 
        fill="none"
        opacity="0.8"
    />
    {/* Bridge Path 2 - Right AI Branch */}
    <path 
        d="M80 30 C 70 30, 60 50, 50 50" 
        stroke="#9d00ff" 
        strokeWidth="6" 
        strokeLinecap="round" 
        fill="none"
        opacity="0.8"
    />
    
    {/* Connection Nodes */}
    <circle cx="20" cy="30" r="6" fill="#bc13fe" />
    <circle cx="80" cy="30" r="6" fill="#9d00ff" />
    
    {/* Central Processing Node - The Bridge */}
    <circle cx="50" cy="50" r="10" fill="#bc13fe" fillOpacity="0.2" />
    <circle cx="50" cy="50" r="5" fill="white" />
    
    {/* Downward Logic Stream */}
    <path 
        d="M50 50 V 80" 
        stroke="#bc13fe" 
        strokeWidth="4" 
        strokeDasharray="4 4"
        strokeLinecap="round"
    />
    <circle cx="50" cy="80" r="4" fill="#bc13fe" />
  </svg>
);

export default Logo;
