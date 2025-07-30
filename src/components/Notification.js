import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationWrapper = styled(motion.div)`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  max-width: 400px;
  min-width: 300px;
`;

const NotificationCard = styled(motion.div)`
  background: ${props => {
    switch (props.type) {
      case 'success':
        return 'linear-gradient(135deg, rgba(76, 175, 80, 0.95) 0%, rgba(56, 142, 60, 0.9) 100%)';
      case 'error':
        return 'linear-gradient(135deg, rgba(244, 67, 54, 0.95) 0%, rgba(211, 47, 47, 0.9) 100%)';
      case 'warning':
        return 'linear-gradient(135deg, rgba(255, 152, 0, 0.95) 0%, rgba(245, 124, 0, 0.9) 100%)';
      case 'info':
        return 'linear-gradient(135deg, rgba(33, 150, 243, 0.95) 0%, rgba(25, 118, 210, 0.9) 100%)';
      default:
        return 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 245, 245, 0.9) 100%)';
    }
  }};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid ${props => {
    switch (props.type) {
      case 'success':
        return 'rgba(76, 175, 80, 0.3)';
      case 'error':
        return 'rgba(244, 67, 54, 0.3)';
      case 'warning':
        return 'rgba(255, 152, 0, 0.3)';
      case 'info':
        return 'rgba(33, 150, 243, 0.3)';
      default:
        return 'rgba(255, 255, 255, 0.3)';
    }
  }};
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  color: white;
  margin-bottom: 1rem;
`;

const NotificationHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
`;

const NotificationTitle = styled.h4`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NotificationMessage = styled.p`
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.4;
  opacity: 0.9;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }
`;

const ProgressBar = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 0 0 16px 16px;
`;

const Notification = React.forwardRef(({ 
  id, 
  type = 'info', 
  title, 
  message, 
  duration = 5000, 
  onClose, 
  autoClose = true 
}, ref) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '•';
    }
  };

  return (
    <NotificationCard
      ref={ref}
      type={type}
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <NotificationHeader>
        <NotificationTitle>
          <span>{getIcon()}</span>
          {title}
        </NotificationTitle>
        <CloseButton onClick={() => onClose(id)}>
          ×
        </CloseButton>
      </NotificationHeader>
      
      <NotificationMessage>
        {message}
      </NotificationMessage>
      
      {autoClose && (
        <ProgressBar
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: duration / 1000, ease: "linear" }}
        />
      )}
    </NotificationCard>
  );
});

const NotificationContainer = ({ notifications, onClose }) => {
  return (
    <NotificationWrapper>
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            {...notification}
            onClose={onClose}
          />
        ))}
      </AnimatePresence>
    </NotificationWrapper>
  );
};

export default NotificationContainer; 