import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import GlassCard from './GlassCard';

const CardContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const CardImage = styled.div.attrs(props => ({
  $imageUrl: props.imageUrl,
  $hasImage: props.hasImage,
}))`
  width: 100%;
  height: 200px;
  border-radius: 16px;
  margin-bottom: 1.5rem;
  background: ${props => props.$hasImage ? `url(${props.$imageUrl})` : 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)'};
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.$hasImage ? 'linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)' : 'rgba(0,0,0,0.3)'};
  }
`;

const NoImageText = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
  z-index: 2;
  position: relative;
`;

const SpotlightTag = styled(motion.div)`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.95) 0%, rgba(255, 165, 0, 0.9) 100%);
  color: #000000;
  padding: 0.375rem 0.875rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  z-index: 2;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
`;

const CardInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.5rem;
  line-height: 1.3;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const CardCompany = styled.div`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1rem;
  font-weight: 500;
`;

const CardDescription = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 1.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ReadMoreLink = styled.span`
  color: rgba(255, 215, 0, 0.9);
  cursor: pointer;
  font-weight: 500;
  transition: color 0.3s ease;
  
  &:hover {
    color: rgba(255, 215, 0, 1);
    text-decoration: underline;
  }
`;

const CardMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
`;

const CardActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  gap: 1rem;
`;

const SaveButton = styled(motion.button).attrs(props => ({
  $isSaved: props.isSaved,
}))`
  background: none;
  border: none;
  color: ${props => props.$isSaved ? 'rgba(255, 215, 0, 0.9)' : 'rgba(255, 255, 255, 0.6)'};
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  
  &:hover {
    color: ${props => props.$isSaved ? 'rgba(255, 215, 0, 1)' : 'rgba(255, 255, 255, 0.8)'};
    background: rgba(255, 255, 255, 0.1);
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const ActionButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const CardStats = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.type === 'invest' ? '#FFFFFF' : 'rgba(255, 215, 0, 0.9)'};
  text-shadow: ${props => props.type === 'invest' 
    ? '0 0 3px rgba(255, 215, 0, 0.3), 0 0 6px rgba(255, 215, 0, 0.2)' 
    : 'none'};
`;

const Tag = styled(motion.span)`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${props => props.type === 'invest' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(255, 215, 0, 0.15)'};
  color: ${props => props.type === 'invest' ? '#FFFFFF' : 'rgba(255, 215, 0, 0.9)'};
  border: 1px solid ${props => props.type === 'invest' 
    ? 'rgba(255, 215, 0, 0.2)' 
    : 'rgba(255, 215, 0, 0.3)'};
  text-shadow: ${props => props.type === 'invest' 
    ? '0 0 2px rgba(255, 215, 0, 0.3), 0 0 4px rgba(255, 215, 0, 0.2)' 
    : 'none'};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  flex-shrink: 0;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const TagItem = styled.span`
  padding: 0.375rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

const ActionButton = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${props => props.type === 'invest' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'linear-gradient(135deg, rgba(255, 215, 0, 0.9) 0%, rgba(255, 165, 0, 0.8) 100%)'};
  color: ${props => props.type === 'invest' ? '#FFFFFF' : '#000000'};
  text-shadow: ${props => props.type === 'invest' 
    ? '0 0 2px rgba(255, 215, 0, 0.3), 0 0 4px rgba(255, 215, 0, 0.2)' 
    : 'none'};
  border: ${props => props.type === 'invest' 
    ? '1px solid rgba(255, 215, 0, 0.2)' 
    : '1px solid rgba(255, 215, 0, 0.3)'};
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: ${props => props.type === 'invest' 
    ? '0 4px 15px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
    : '0 4px 15px rgba(255, 215, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.1)'};
  
  &:hover {
    transform: translateY(-2px);
    background: ${props => props.type === 'invest' 
      ? 'rgba(255, 255, 255, 0.15)' 
      : 'linear-gradient(135deg, rgba(255, 215, 0, 1) 0%, rgba(255, 165, 0, 0.9) 100%)'};
    box-shadow: ${props => props.type === 'invest' 
      ? '0 8px 25px rgba(255, 215, 0, 0.2), 0 0 15px rgba(255, 215, 0, 0.1)' 
      : '0 8px 25px rgba(255, 215, 0, 0.4), 0 4px 12px rgba(0, 0, 0, 0.15)'};
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  margin: 1rem 0;
  overflow: hidden;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: ${props => props.type === 'invest' 
    ? 'linear-gradient(90deg, rgba(255, 215, 0, 0.8) 0%, rgba(255, 165, 0, 0.6) 100%)' 
    : 'linear-gradient(90deg, rgba(255, 215, 0, 0.8) 0%, rgba(255, 165, 0, 0.6) 100%)'};
  border-radius: 4px;
  box-shadow: ${props => props.type === 'invest' 
    ? '0 0 3px rgba(255, 215, 0, 0.3), 0 0 6px rgba(255, 215, 0, 0.2)' 
    : '0 0 3px rgba(255, 215, 0, 0.3), 0 0 6px rgba(255, 215, 0, 0.2)'};
`;

const ProgressText = styled.div`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const OpportunityCard = ({ 
  opportunity, 
  type = 'apply', 
  onClick,
  onSave,
  isSaved = false,
  delay = 0 
}) => {
  const { 
    title, 
    company, 
    description, 
    location, 
    deadline, 
    stats,
    progress,
    tags = [],
    imageUrl
  } = opportunity;



  const handleSaveClick = (e) => {
    e.stopPropagation();
    if (onSave) {
      onSave();
    }
  };

  return (
    <GlassCard
      glassType="strong"
      glowColor={type === 'invest' ? 'rgba(255, 215, 0, 0.3)' : 'rgba(0, 122, 255, 0.3)'}
      onClick={onClick}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: delay * 0.1,
        ease: "easeOut"
      }}
    >
      <CardContent>
        <CardImage imageUrl={imageUrl} hasImage={!!imageUrl}>
          {!imageUrl && (
            <NoImageText>
              <i className="fas fa-image" style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'block' }}></i>
              NO IMAGE PROVIDED
            </NoImageText>
          )}
          {type === 'invest' && progress && progress > 70 && (
            <SpotlightTag
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay * 0.1 + 0.2 }}
            >
              ☆ SPOTLIGHT
            </SpotlightTag>
          )}
        </CardImage>

        <CardHeader>
          <CardInfo>
            <CardTitle>{title}</CardTitle>
            <CardCompany>{company}</CardCompany>
          </CardInfo>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Tag
              type={type}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay * 0.1 + 0.3 }}
            >
              {type === 'invest' ? 'Invest' : 'Apply'}
            </Tag>
            <SaveButton
              isSaved={isSaved}
              onClick={handleSaveClick}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <i className={`fas fa-bookmark ${isSaved ? 'fas' : 'far'}`}></i>
            </SaveButton>
          </div>
        </CardHeader>

        <CardDescription>
          {description}
          <ReadMoreLink> Read More</ReadMoreLink>
        </CardDescription>

        {tags.length > 0 && (
          <TagsContainer>
            {tags.slice(0, 3).map((tag, index) => (
              <TagItem key={index}>{tag}</TagItem>
            ))}
          </TagsContainer>
        )}

        <CardMeta>
          <span>📍 {location}</span>
          <span>⏰ {deadline}</span>
        </CardMeta>

        {type === 'invest' && progress && (
          <>
            <ProgressText>{progress}% funded</ProgressText>
            <ProgressBar>
              <ProgressFill
                type={type}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ delay: delay * 0.1 + 0.4, duration: 1 }}
              />
            </ProgressBar>
          </>
        )}

        <CardActions>
          <CardStats type={type}>{stats}</CardStats>
          <ActionButtonGroup>
            <ActionButton
              type={type}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className={`fas fa-${type === 'invest' ? 'chart-line' : 'paper-plane'}`}></i>
              {type === 'invest' ? 'Invest Now' : 'Apply Now'}
            </ActionButton>
          </ActionButtonGroup>
        </CardActions>
      </CardContent>
    </GlassCard>
  );
};

export default OpportunityCard; 