import React, { useState, useRef } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import styled from 'styled-components';

const ToggleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 2rem 0;
  position: relative;
  * {
    text-shadow: none !important;
    box-shadow: none !important;
  }
`;

const ToggleWrapper = styled.div`
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50px;
  padding: 0.5rem;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 0;
  width: 400px;
`;

const ToggleOption = styled.button.attrs(props => ({
  $active: props.active,
}))`
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 40px;
  background: transparent;
  color: ${props => props.$active ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)'};
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: color 0.3s ease;
  position: relative;
  z-index: 2;
  text-shadow: none !important;
  box-shadow: none !important;
  outline: none !important;
  
  &:hover {
    color: #FFFFFF;
    text-shadow: none !important;
    box-shadow: none !important;
  }
  
  &:focus {
    text-shadow: none !important;
    box-shadow: none !important;
  }
`;

const DownArrow = styled(motion.div)`
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 2rem;
  cursor: pointer;
  text-shadow: none !important;
  box-shadow: none !important;
  z-index: 1000;
  
  &::before {
    content: '↓';
    display: block;
  }
`;

const ActiveLabel = styled(motion.div)`
  margin-top: 1rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  text-shadow: none !important;
  box-shadow: none !important;
  max-width: 400px;
  white-space: normal;
`;

const ActiveIndicator = styled(motion.div)`
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  width: calc(25% - 0.25rem);
  height: calc(100% - 1rem);
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 40px;
  z-index: 1;
  cursor: grab;
  box-shadow: none !important;
  
  &:active {
    cursor: grabbing;
  }
`;

const UserToggle = ({ onToggle, initialValue = 0, onToggleClick }) => {
  const [activeIndex, setActiveIndex] = useState(initialValue);
  const [showArrow, setShowArrow] = useState(true);
  const containerRef = useRef(null);
  const x = useMotionValue(activeIndex * 100);
  
  const options = [
    { 
      id: 0, 
      label: 'Student',
      description: 'High school students looking for opportunities'
    },
    { 
      id: 1, 
      label: 'Provider',
      description: 'Companies & coordinators seeking applicants'
    },
    { 
      id: 2, 
      label: 'Investor',
      description: 'Individuals wanting to invest in projects'
    },
    { 
      id: 3, 
      label: 'Founder',
      description: 'Students with projects seeking funding'
    }
  ];

  const handleToggle = (index) => {
    setActiveIndex(index);
    onToggle(index);
    // Trigger the glow animation if callback is provided
    if (onToggleClick) {
      onToggleClick();
    }
  };

  const handleDragEnd = (event, info) => {
    const containerWidth = containerRef.current?.offsetWidth || 400;
    const dragDistance = info.offset.x;
    const segmentWidth = containerWidth / 4;
    const newIndex = Math.round(dragDistance / segmentWidth);
    const clampedIndex = Math.max(0, Math.min(3, newIndex));
    
    if (clampedIndex !== activeIndex) {
      setActiveIndex(clampedIndex);
      if (onToggle) onToggle(clampedIndex);
      // Trigger the glow animation if callback is provided
      if (onToggleClick) {
        onToggleClick();
      }
    }
  };

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setShowArrow(false);
      } else if (window.scrollY <= 10) {
        setShowArrow(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [showArrow]);

  return (
    <ToggleContainer>
      <ToggleWrapper ref={containerRef}>
        <ActiveIndicator
          drag="x"
          dragConstraints={{ left: 0, right: 300 }}
          dragElastic={0.2}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
          animate={{ 
            x: `${activeIndex * 100}%`
          }}
          transition={{ 
            type: "spring", 
            stiffness: 500, 
            damping: 30,
            duration: 0.2
          }}
          style={{ x }}
          whileDrag={{ scale: 1.02 }}
        />
        {options.map((option, index) => (
          <ToggleOption
            key={option.id}
            $active={activeIndex === index}
            onClick={() => handleToggle(index)}
          >
            {option.label}
          </ToggleOption>
        ))}
      </ToggleWrapper>
      
      <ActiveLabel
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {options[activeIndex]?.description}
      </ActiveLabel>
      
      {showArrow && (
        <DownArrow
          animate={{ 
            y: [0, 5, 0],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </ToggleContainer>
  );
};

export default UserToggle; 