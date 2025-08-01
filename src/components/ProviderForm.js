import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

const FormContainer = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const FormCard = styled.div`
  background: transparent;
  backdrop-filter: blur(100px);
  -webkit-backdrop-filter: blur(100px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 32px;
  padding: 3rem;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
`;

const FormHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
`;

const FormTitle = styled.h2`
  color: #FFFFFF;
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  background: linear-gradient(135deg, #FFFFFF, rgba(255, 215, 0, 0.8));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const FormSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
  margin: 0;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const ToggleContainer = styled.div`
  display: flex;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  padding: 0.5rem;
  margin-bottom: 3rem;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
`;

const ToggleSlider = styled(motion.div)`
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  width: calc(50% - 0.25rem);
  height: calc(100% - 1rem);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08));
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  z-index: 1;
  box-shadow: 
    0 2px 10px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  transform: translateX(0);
`;

const ToggleOption = styled.button`
  flex: 1;
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 16px;
  background: transparent;
  color: ${props => props.active ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)'};
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
  outline: none;
  
  &:hover {
    color: #FFFFFF;
  }
  
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  font-size: 0.875rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  color: #FFFFFF;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  box-shadow: 
    0 2px 10px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  
  &:focus {
    outline: none;
    border-color: rgba(255, 215, 0, 0.6);
    box-shadow: 
      0 0 0 3px rgba(255, 215, 0, 0.1),
      0 4px 20px rgba(255, 215, 0, 0.1);
    transform: translateY(-1px);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  &:hover {
    border-color: rgba(255, 255, 255, 0.25);
    box-shadow: 
      0 2px 15px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  color: #FFFFFF;
  font-size: 0.875rem;
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.3s ease;
  box-shadow: 
    0 2px 10px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  
  &:focus {
    outline: none;
    border-color: rgba(255, 215, 0, 0.6);
    box-shadow: 
      0 0 0 3px rgba(255, 215, 0, 0.1),
      0 4px 20px rgba(255, 215, 0, 0.1);
    transform: translateY(-1px);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  &:hover {
    border-color: rgba(255, 255, 255, 0.25);
    box-shadow: 
      0 2px 15px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  color: #FFFFFF;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  box-shadow: 
    0 2px 10px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  
  &:focus {
    outline: none;
    border-color: rgba(255, 215, 0, 0.6);
    box-shadow: 
      0 0 0 3px rgba(255, 215, 0, 0.1),
      0 4px 20px rgba(255, 215, 0, 0.1);
    transform: translateY(-1px);
  }
  
  &:hover {
    border-color: rgba(255, 255, 255, 0.25);
    box-shadow: 
      0 2px 15px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
  }
  
  option {
    background: #1a1a1a;
    color: #FFFFFF;
  }
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #3B82F6, #1D4ED8);
  border: none;
  border-radius: 12px;
  color: #FFFFFF;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }
  
  &:hover {
    background: linear-gradient(135deg, #2563EB, #1E40AF);
    transform: translateY(-2px);
    box-shadow: 
      0 8px 25px rgba(59, 130, 246, 0.3),
      0 4px 10px rgba(0, 0, 0, 0.2);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.2);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    background: linear-gradient(135deg, #6B7280, #4B5563);
  }
`;

const UltraExclusiveInfo = styled.div`
  background: transparent;
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  
  &::before {
    content: '🌟';
    position: absolute;
    top: 1rem;
    right: 1rem;
    font-size: 1.5rem;
    opacity: 0.3;
  }
  
  h4 {
    color: rgba(255, 255, 255, 0.9);
    margin: 0 0 0.75rem 0;
    font-size: 1rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  p {
    color: rgba(255, 255, 255, 0.7);
    margin: 0;
    font-size: 0.875rem;
    line-height: 1.6;
  }
`;



const SuccessMessage = styled(motion.div)`
  text-align: center;
  padding: 2rem;
  background: rgba(46, 213, 115, 0.08);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(46, 213, 115, 0.2);
  border-radius: 12px;
  color: #2ed573;
  margin-top: 2rem;
  box-shadow: 0 0 30px rgba(46, 213, 115, 0.1);
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const FullWidthSection = styled.div`
  grid-column: 1 / -1;
`;

const FormSection = styled.div`
  background: transparent;
  backdrop-filter: blur(60px);
  -webkit-backdrop-filter: blur(60px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  position: relative;
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
`;

const SectionTitle = styled.h3`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &::before {
    content: '';
    width: 3px;
    height: 20px;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.6), transparent);
    border-radius: 2px;
  }
`;

const ImageUploadArea = styled.div`
  width: 100%;
  margin-bottom: 1rem;
  
  label {
    cursor: pointer;
    display: block;
  }
`;

const ImageUploadPlaceholder = styled.div`
  width: 100%;
  height: 200px;
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    border-color: rgba(255, 215, 0, 0.6);
    background: rgba(255, 215, 0, 0.05);
  }
  
  span {
    color: rgba(255, 255, 255, 0.8);
    font-weight: 500;
    margin-bottom: 0.5rem;
  }
  
  small {
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.8rem;
  }
`;

const ImagePreview = styled.div`
  width: 100%;
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  
  &:hover .image-overlay {
    opacity: 1;
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  span {
    color: white;
    font-weight: 500;
  }
`;

const ImageRequirements = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  
  strong {
    color: rgba(255, 255, 255, 0.9);
    display: block;
    margin-bottom: 0.5rem;
  }
  
  ul {
    margin: 0;
    padding-left: 1.5rem;
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
  }
  
  li {
    margin-bottom: 0.25rem;
  }
`;

const ProviderForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    requirements: '',
    location: '',
    type: 'internship',
    compensation: '',
    duration: '',
    applicationDeadline: '',
    contactEmail: '',
    // Enhanced optional fields
    maxApplicants: '',
    selectionCriteria: '',
    interviewProcess: '',
    mentorshipDetails: '',
    networkingOpportunities: '',
    image: null
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file (JPG, PNG, GIF)');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image file size must be less than 5MB');
        return;
      }
      
      // Create a preview to validate dimensions
      const img = new Image();
      const reader = new FileReader();
      
      reader.onload = (e) => {
        img.src = e.target.result;
        img.onload = () => {
          // Check if dimensions are close to recommended (1200x800 or similar aspect ratio)
          const aspectRatio = img.width / img.height;
          const recommendedAspectRatio = 1200 / 800; // 1.5
          
          if (Math.abs(aspectRatio - recommendedAspectRatio) > 0.3) {
            alert('Please upload an image with aspect ratio close to 3:2 (1200x800 recommended). Current image: ' + img.width + 'x' + img.height);
            return;
          }
          
          if (img.width < 800 || img.height < 600) {
            alert('Please upload an image with minimum dimensions of 800x600 pixels. Current image: ' + img.width + 'x' + img.height);
            return;
          }
          
          setFormData(prev => ({
            ...prev,
            image: file
          }));
        };
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      return;
    }
    
    // Create FormData for file uploads
    const formDataObj = new FormData();
    
    // Add all form fields to FormData
    Object.keys(formData).forEach(key => {
      if (formData[key] && key !== 'image') {
        formDataObj.append(key, formData[key]);
      }
    });
    
    // Add image file
    if (formData.image) {
      formDataObj.append('file_attachment', formData.image);
    }
    
    // Add form type (always general now)
    formDataObj.append('formType', 'general');
    
    // Call the parent's onSubmit handler
    if (onSubmit) {
      await onSubmit('general', formDataObj);
    }
    
    // Show success message
    setIsSubmitted(true);
  };

  const isFormValid = () => {
    const requiredFields = ['title', 'company', 'description', 'requirements', 'contactEmail'];
    
    const hasRequiredFields = requiredFields.every(field => formData[field].trim() !== '');
    const hasImage = formData.image && formData.image.size > 0;
    
    return hasRequiredFields && hasImage;
  };

  return (
    <FormContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <FormCard>
        <FormHeader>
          <FormTitle>Submit Opportunity</FormTitle>
          <FormSubtitle>
            Share your opportunity with talented high school students. Include optional enhanced details for better visibility.
          </FormSubtitle>
        </FormHeader>

        <AnimatePresence>
          {isSubmitted ? (
            <SuccessMessage
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h3>🎉 Opportunity Submitted Successfully!</h3>
              <p>Thank you for submitting your opportunity. Our team will review it and make it available to students within 24-48 hours.</p>
            </SuccessMessage>
          ) : (
            <form onSubmit={handleSubmit}>
          <FormGrid>
            <FormSection>
              <SectionTitle>Basic Information</SectionTitle>
              <FormGroup>
                <Label>Opportunity Title *</Label>
                <Input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Software Engineering Intern"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Company/Organization *</Label>
                <Input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Your company name"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Location</Label>
                <Input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Remote, New York, NY, or Hybrid"
                />
              </FormGroup>

              <FormGroup>
                <Label>Opportunity Type</Label>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                >
                  <option value="internship">Internship</option>
                  <option value="part-time">Part-time</option>
                  <option value="full-time">Full-time</option>
                  <option value="project">Project-based</option>
                  <option value="mentorship">Mentorship</option>
                  <option value="competition">Competition</option>
                </Select>
              </FormGroup>
            </FormSection>

            <FormSection>
              <SectionTitle>Opportunity Image *</SectionTitle>
              <FormGroup>
                <Label>Upload Image</Label>
                <ImageUploadArea>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    id="image-upload"
                  />
                  <label htmlFor="image-upload">
                    {formData.image ? (
                      <ImagePreview>
                        <img 
                          src={URL.createObjectURL(formData.image)} 
                          alt="Preview" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
                        />
                        <ImageOverlay>
                          <span>Click to change image</span>
                        </ImageOverlay>
                      </ImagePreview>
                    ) : (
                      <ImageUploadPlaceholder>
                        <i className="fas fa-image" style={{ fontSize: '2rem', marginBottom: '1rem', color: 'rgba(255, 255, 255, 0.6)' }}></i>
                        <span>Click to upload image</span>
                        <small>Recommended: 1200x800 pixels, max 5MB</small>
                      </ImageUploadPlaceholder>
                    )}
                  </label>
                </ImageUploadArea>
                <ImageRequirements>
                  <strong>Image Requirements:</strong>
                  <ul>
                    <li>Minimum dimensions: 800x600 pixels</li>
                    <li>Recommended aspect ratio: 3:2 (1200x800)</li>
                    <li>Maximum file size: 5MB</li>
                    <li>Formats: JPG, PNG, GIF</li>
                  </ul>
                </ImageRequirements>
              </FormGroup>
            </FormSection>

            <FormSection>
              <SectionTitle>Details & Compensation</SectionTitle>
              <FormGroup>
                <Label>Compensation</Label>
                <Input
                  type="text"
                  name="compensation"
                  value={formData.compensation}
                  onChange={handleInputChange}
                  placeholder="e.g., $25/hour, Stipend, Equity, or Unpaid"
                />
              </FormGroup>

              <FormGroup>
                <Label>Duration</Label>
                <Input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="e.g., 3 months, 6 months, Ongoing"
                />
              </FormGroup>

              <FormGroup>
                <Label>Application Deadline</Label>
                <Input
                  type="date"
                  name="applicationDeadline"
                  value={formData.applicationDeadline}
                  onChange={handleInputChange}
                />
              </FormGroup>

              <FormGroup>
                <Label>Contact Email *</Label>
                <Input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  placeholder="email@company.com"
                  required
                />
              </FormGroup>
            </FormSection>
          </FormGrid>

          <FullWidthSection>
            <FormSection>
              <SectionTitle>Opportunity Details</SectionTitle>
              <FormGroup>
                <Label>Description *</Label>
                <TextArea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the opportunity, responsibilities, and what students will learn..."
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Requirements *</Label>
                <TextArea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  placeholder="List the skills, experience, or qualifications needed..."
                  required
                />
              </FormGroup>
            </FormSection>
          </FullWidthSection>

          <FullWidthSection>
            <FormSection>
              <SectionTitle>
                <span style={{ color: 'rgba(255, 215, 0, 0.8)', marginRight: '0.5rem' }}>🌟</span>
                Enhanced Details (Optional)
              </SectionTitle>
              <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem', marginBottom: '2rem' }}>
                Include these details to make your opportunity more attractive to students
              </p>
              <FormGrid>
                <FormGroup>
                  <Label>Maximum Applicants</Label>
                  <Input
                    type="number"
                    name="maxApplicants"
                    value={formData.maxApplicants}
                    onChange={handleInputChange}
                    placeholder="e.g., 10"
                    min="1"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Selection Criteria</Label>
                  <TextArea
                    name="selectionCriteria"
                    value={formData.selectionCriteria}
                    onChange={handleInputChange}
                    placeholder="Describe how you'll evaluate and select applicants..."
                  />
                </FormGroup>
              </FormGrid>

              <FormGroup>
                <Label>Interview Process</Label>
                <TextArea
                  name="interviewProcess"
                  value={formData.interviewProcess}
                  onChange={handleInputChange}
                  placeholder="Describe your interview process and timeline..."
                />
              </FormGroup>

              <FormGroup>
                <Label>Mentorship Details</Label>
                <TextArea
                  name="mentorshipDetails"
                  value={formData.mentorshipDetails}
                  onChange={handleInputChange}
                  placeholder="Describe any mentorship, training, or development opportunities..."
                />
              </FormGroup>

              <FormGroup>
                <Label>Networking Opportunities</Label>
                <TextArea
                  name="networkingOpportunities"
                  value={formData.networkingOpportunities}
                  onChange={handleInputChange}
                  placeholder="Describe networking events, industry connections, or career development opportunities..."
                />
              </FormGroup>
            </FormSection>
          </FullWidthSection>

          <SubmitButton
            type="submit"
            disabled={!isFormValid()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Submit Opportunity
          </SubmitButton>
            </form>
          )}
        </AnimatePresence>
      </FormCard>
    </FormContainer>
  );
};

export default ProviderForm; 