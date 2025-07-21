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
  fill = 'white',
  opacity = 0.08,
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
    <text
      x="50%"
      y="50%"
      dominantBaseline="middle"
      textAnchor="middle"
      fontSize="80"
      fill={fill}
      opacity={opacity}
      fontWeight="bold"
      fontStyle="italic"
      letterSpacing="20"
      fontFamily="Arial, sans-serif"
    >
      {texting}
    </text>
  </svg>
);
