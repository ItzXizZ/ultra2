import styled from 'styled-components';
import { useState } from 'react';

// Simple Star component (dot)
export const Star = styled.div`
  position: absolute;
  width: ${props => props.size || 1}px;
  height: ${props => props.size || 1}px;
  background: rgba(255, 255, 255, ${props => props.opacity || 0.3});
  border-radius: 50%;
  pointer-events: none;
`;

// Generate static background dots
export const generateStars = () => {
  const stars = [];
  for (let i = 0; i < 200; i++) {
    stars.push({
      id: `star-${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() < 0.8 ? 1 : 1.5,
      opacity: 0.1 + Math.random() * 0.3
    });
  }
  return stars;
};

// Background container
export const GlobalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000000;
  z-index: -1;
  overflow: hidden;
  transform: translateZ(0);
`;

// Main Background Component
export const Galaxy = () => {
  const [stars] = useState(generateStars());

  return (
    <GlobalBackground>
      {stars.map(star => (
        <Star
          key={star.id}
          size={star.size}
          opacity={star.opacity}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`
          }}
        />
      ))}
    </GlobalBackground>
  );
};

export default Galaxy;
