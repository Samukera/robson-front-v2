import React from 'react';

interface IconPlanningTextProps {
  texting?: string;
  fill?: string;
  opacity?: number;
  width?: string | number;
  height?: string | number;
  className?: string;
}

export const IconPlanningText: React.FC<IconPlanningTextProps> = ({
  opacity = 0.15,
  width = '100%',
  height = 100,
  className = '',
  texting = '',
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1200 120"
    width={width}
    height={height}
    className={className}
  >
    {/* Gradiente dourado */}
    <defs>
      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FFD700" />
        <stop offset="50%" stopColor="#FFF5A5" />
        <stop offset="100%" stopColor="#FFA500" />
      </linearGradient>
    </defs>

    <text
      x="50%"
      y="50%"
      dominantBaseline="middle"
      textAnchor="middle"
      fontSize="72"
      fill="url(#goldGradient)"
      opacity={opacity}
      fontWeight="900"
      fontStyle="italic"
      letterSpacing="28"
      fontFamily="'Orbitron', 'Rajdhani', 'Arial Black', sans-serif"
      stroke="#000"
      strokeWidth="2"
      paintOrder="stroke"
    >
      {texting}
    </text>
  </svg>
);
