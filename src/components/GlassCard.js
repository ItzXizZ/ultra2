import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const CardContainer = styled(motion.div).attrs(props => ({
  $glassType: props.glassType,
  $glowColor: props.glowColor,
}))`
  position: relative;
  padding: 2rem;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  
  /* Glassmorphism base */
  background: ${props => props.$glassType === 'ultra' 
    ? 'rgba(255, 255, 255, 0.15)' 
    : props.$glassType === 'strong' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(255, 255, 255, 0.05)'};
  
  backdrop-filter: ${props => props.$glassType === 'ultra' 
    ? 'blur(40px)' 
    : props.$glassType === 'strong' 
    ? 'blur(30px)' 
    : 'blur(20px)'};
  
  -webkit-backdrop-filter: ${props => props.$glassType === 'ultra' 
    ? 'blur(40px)' 
    : props.$glassType === 'strong' 
    ? 'blur(30px)' 
    : 'blur(20px)'};
  
  border: 1px solid ${props => props.$glassType === 'ultra' 
    ? 'rgba(255, 255, 255, 0.3)' 
    : props.$glassType === 'strong' 
    ? 'rgba(255, 255, 255, 0.2)' 
    : 'rgba(255, 255, 255, 0.1)'};
  
  box-shadow: ${props => props.$glassType === 'ultra' 
    ? '0 16px 48px rgba(0, 0, 0, 0.5)' 
    : props.$glassType === 'strong' 
    ? '0 12px 40px rgba(0, 0, 0, 0.4)' 
    : '0 8px 32px rgba(0, 0, 0, 0.3)'};

  /* Glass reflection effect */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  /* Inner glow on hover */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 20px;
    background: ${props => props.$glowColor 
      ? `radial-gradient(circle at 50% 50%, ${props.$glowColor}20 0%, transparent 70%)` 
      : 'transparent'};
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  &:hover::after {
    opacity: 1;
  }
`;

const GlassCard = ({ 
  children, 
  glassType = 'normal', 
  glowColor = 'rgba(255, 215, 0, 0.5)',
  onClick,
  className,
  ...props 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <CardContainer
      glassType={glassType}
      glowColor={glowColor}
      onClick={onClick}
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 20
        }
      }}
      whileTap={{
        scale: 0.98,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 20
        }
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        ease: "easeOut"
      }}
    >
      {/* Floating particles effect */}
      {isHovered && (
        <>
          <motion.div
            style={{
              position: 'absolute',
              top: '10%',
              left: '10%',
              width: '4px',
              height: '4px',
              background: 'rgba(255, 215, 0, 0.6)',
              borderRadius: '50%',
              pointerEvents: 'none',
            }}
            animate={{
              y: [-10, 10, -10],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            style={{
              position: 'absolute',
              top: '20%',
              right: '15%',
              width: '3px',
              height: '3px',
              background: 'rgba(255, 215, 0, 0.4)',
              borderRadius: '50%',
              pointerEvents: 'none',
            }}
            animate={{
              y: [10, -10, 10],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
        </>
      )}
      
      {children}
    </CardContainer>
  );
};

export default GlassCard; 