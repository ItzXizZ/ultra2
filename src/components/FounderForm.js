import React, { useState, useRef } from 'react';
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

const Required = styled.span`
  color: #ff4757;
  font-size: 1.2rem;
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

const FileUploadArea = styled.div`
  border: 2px dashed rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    border-color: rgba(255, 215, 0, 0.6);
    background: rgba(255, 255, 255, 0.04);
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.1);
  }
  
  &.drag-over {
    border-color: rgba(255, 215, 0, 0.6);
    background: rgba(255, 215, 0, 0.08);
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.2);
  }
`;

const FileUploadIcon = styled.div`
  font-size: 3rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 1rem;
`;

const FileUploadText = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
`;

const FileUploadSubtext = styled.div`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
`;

const FileList = styled.div`
  display: grid;
  gap: 1rem;
  margin-top: 1rem;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.12);
  }
`;

const FileIcon = styled.div`
  font-size: 1.5rem;
  color: rgba(255, 215, 0, 0.8);
`;

const FileInfo = styled.div`
  flex: 1;
`;

const FileName = styled.div`
  color: #FFFFFF;
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const FileSize = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
`;

const RemoveFile = styled.button`
  background: none;
  border: none;
  color: #ff4757;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 71, 87, 0.1);
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 0.5rem;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, rgba(255, 215, 0, 0.8), rgba(255, 215, 0, 0.6));
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
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

const ValidationMessage = styled.div`
  background: rgba(255, 107, 107, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 107, 107, 0.2);
  border-radius: 8px;
  color: #ff6b6b;
  padding: 0.75rem 1rem;
  margin-top: 1rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  i {
    font-size: 1rem;
  }
`;

const FounderForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    projectName: '',
    founderName: '',
    email: '',
    phone: '',
    category: '',
    description: '',
    problem: '',
    solution: '',
    market: '',
    team: '',
    fundingGoal: '',
    equity: '',
    timeline: '',
    milestones: '',
    risks: '',
    competitiveAdvantage: ''
  });
  
  const [files, setFiles] = useState({
    images: [],
    videos: [],
    documents: []
  });
  
  const [uploadProgress, setUploadProgress] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e, fileType) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Validate images if this is an image upload
    if (fileType === 'images') {
      for (const file of selectedFiles) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          alert('Please select valid image files (JPG, PNG, GIF)');
          return;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert('Image file size must be less than 5MB');
          return;
        }
        
        // Validate dimensions
        const img = new Image();
        const reader = new FileReader();
        
        reader.onload = (e) => {
          img.src = e.target.result;
          img.onload = () => {
            // Check if dimensions are close to recommended (1200x800 or similar aspect ratio)
            const aspectRatio = img.width / img.height;
            const recommendedAspectRatio = 1200 / 800; // 1.5
            
            if (Math.abs(aspectRatio - recommendedAspectRatio) > 0.3) {
              alert('Please upload images with aspect ratio close to 3:2 (1200x800 recommended). Current image: ' + img.width + 'x' + img.height);
              return;
            }
            
            if (img.width < 800 || img.height < 600) {
              alert('Please upload images with minimum dimensions of 800x600 pixels. Current image: ' + img.width + 'x' + img.height);
              return;
            }
          };
        };
        
        reader.readAsDataURL(file);
      }
    }
    
    const newFiles = selectedFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0
    }));
    
    setFiles(prev => ({
      ...prev,
      [fileType]: [...prev[fileType], ...newFiles]
    }));
    
    // Simulate upload progress
    newFiles.forEach(fileObj => {
      simulateUpload(fileObj.id, fileType);
    });
  };

  const simulateUpload = (fileId, fileType) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      
      setUploadProgress(prev => ({
        ...prev,
        [fileId]: progress
      }));
    }, 200);
  };

  const removeFile = (fileId, fileType) => {
    setFiles(prev => ({
      ...prev,
      [fileType]: prev[fileType].filter(f => f.id !== fileId)
    }));
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileId];
      return newProgress;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create FormData for file uploads
      const formDataObj = new FormData();
      
      // Add all form fields to FormData
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          formDataObj.append(key, formData[key]);
        }
      });
      
      // Add files to FormData
      Object.keys(files).forEach(fileType => {
        files[fileType].forEach(file => {
          formDataObj.append(`${fileType}[]`, file.file);
        });
      });
      
      // Add form type
      formDataObj.append('formType', 'founder');
      
      // Call the parent's onSubmit handler
      if (onSubmit) {
        await onSubmit('founder', formDataObj);
      }
      
      setIsSubmitted(true);
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          projectName: '',
          founderName: '',
          email: '',
          phone: '',
          category: '',
          description: '',
          problem: '',
          solution: '',
          market: '',
          team: '',
          fundingGoal: '',
          equity: '',
          timeline: '',
          milestones: '',
          risks: '',
          competitiveAdvantage: ''
        });
        setFiles({ images: [], videos: [], documents: [] });
        setUploadProgress({});
      }, 5000);
      
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return <i className="fas fa-image"></i>;
    if (fileType.startsWith('video/')) return <i className="fas fa-video"></i>;
    return <i className="fas fa-file"></i>;
  };

  const isFormValid = () => {
    const requiredFields = ['projectName', 'founderName', 'email', 'category', 'description', 'problem', 'solution', 'market', 'team', 'fundingGoal', 'timeline'];
    const hasRequiredFields = requiredFields.every(field => formData[field].trim() !== '');
    const hasImage = files.images && files.images.length > 0;
    
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
          <FormTitle>Submit Your Project</FormTitle>
          <FormSubtitle>
            Share your innovative idea with our community of investors. 
            Upload images, videos, and detailed information to showcase your project.
          </FormSubtitle>
        </FormHeader>

        <AnimatePresence>
          {isSubmitted ? (
            <SuccessMessage
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h3>🎉 Project Submitted Successfully!</h3>
              <p>Thank you for submitting your project. Our team will review it and get back to you within 48 hours.</p>
            </SuccessMessage>
          ) : (
            <form onSubmit={handleSubmit}>
              <FormGrid>
                <FormSection>
                  <SectionTitle>Basic Information</SectionTitle>
                  <FormGroup>
                    <Label>Project Name <Required>*</Required></Label>
                    <Input
                      type="text"
                      name="projectName"
                      value={formData.projectName}
                      onChange={handleInputChange}
                      placeholder="Enter your project name"
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Founder Name <Required>*</Required></Label>
                    <Input
                      type="text"
                      name="founderName"
                      value={formData.founderName}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Email Address <Required>*</Required></Label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Phone Number</Label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
                    />
                  </FormGroup>
                </FormSection>

                <FormSection>
                  <SectionTitle>Project Details</SectionTitle>
                  <FormGroup>
                    <Label>Category <Required>*</Required></Label>
                    <Select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="technology">Technology</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="education">Education</option>
                      <option value="environment">Environment</option>
                      <option value="finance">Finance</option>
                      <option value="entertainment">Entertainment</option>
                      <option value="social-impact">Social Impact</option>
                      <option value="other">Other</option>
                    </Select>
                  </FormGroup>

                  <FormGroup>
                    <Label>Funding Goal (USD) <Required>*</Required></Label>
                    <Input
                      type="number"
                      name="fundingGoal"
                      value={formData.fundingGoal}
                      onChange={handleInputChange}
                      placeholder="50000"
                      min="1000"
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Equity Offered (%)</Label>
                    <Input
                      type="number"
                      name="equity"
                      value={formData.equity}
                      onChange={handleInputChange}
                      placeholder="10"
                      min="1"
                      max="100"
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Timeline <Required>*</Required></Label>
                    <Input
                      type="text"
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleInputChange}
                      placeholder="e.g., 6 months, 1 year"
                      required
                    />
                  </FormGroup>
                </FormSection>
              </FormGrid>

              <FullWidthSection>
                <FormSection>
                  <SectionTitle>Project Description</SectionTitle>
                  <FormGroup>
                    <Label>Brief Description <Required>*</Required></Label>
                    <TextArea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your project in 2-3 sentences..."
                      required
                    />
                  </FormGroup>

                  <FormGrid>
                    <FormGroup>
                      <Label>Problem Statement <Required>*</Required></Label>
                      <TextArea
                        name="problem"
                        value={formData.problem}
                        onChange={handleInputChange}
                        placeholder="What problem does your project solve?"
                        required
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Solution <Required>*</Required></Label>
                      <TextArea
                        name="solution"
                        value={formData.solution}
                        onChange={handleInputChange}
                        placeholder="How does your project solve this problem?"
                        required
                      />
                    </FormGroup>
                  </FormGrid>
                </FormSection>
              </FullWidthSection>

              <FullWidthSection>
                <FormSection>
                  <SectionTitle>Market & Team</SectionTitle>
                  <FormGrid>
                    <FormGroup>
                      <Label>Target Market <Required>*</Required></Label>
                      <TextArea
                        name="market"
                        value={formData.market}
                        onChange={handleInputChange}
                        placeholder="Describe your target market and audience..."
                        required
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Team Information <Required>*</Required></Label>
                      <TextArea
                        name="team"
                        value={formData.team}
                        onChange={handleInputChange}
                        placeholder="Tell us about your team members and their expertise..."
                        required
                      />
                    </FormGroup>
                  </FormGrid>
                </FormSection>
              </FullWidthSection>

              <FullWidthSection>
                <FormSection>
                  <SectionTitle>Additional Information</SectionTitle>
                  <FormGrid>
                    <FormGroup>
                      <Label>Key Milestones</Label>
                      <TextArea
                        name="milestones"
                        value={formData.milestones}
                        onChange={handleInputChange}
                        placeholder="List your key milestones and achievements..."
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Risks & Challenges</Label>
                      <TextArea
                        name="risks"
                        value={formData.risks}
                        onChange={handleInputChange}
                        placeholder="What are the main risks and challenges?"
                      />
                    </FormGroup>
                  </FormGrid>
                  <FormGroup>
                    <Label>Competitive Advantage</Label>
                    <TextArea
                      name="competitiveAdvantage"
                      value={formData.competitiveAdvantage}
                      onChange={handleInputChange}
                      placeholder="What makes your project unique? What's your competitive advantage?"
                    />
                  </FormGroup>
                </FormSection>
              </FullWidthSection>

              <FullWidthSection>
                <FormSection>
                  <SectionTitle>Media & Documents</SectionTitle>
                  
                  {/* Images */}
                  <FormGroup>
                    <Label>Project Images <Required>*</Required></Label>
                    <FileUploadArea
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
                        if (droppedFiles.length > 0) {
                          const event = { target: { files: droppedFiles } };
                          handleFileUpload(event, 'images');
                        }
                      }}
                    >
                      <FileUploadIcon>
                        <i className="fas fa-camera"></i>
                      </FileUploadIcon>
                      <FileUploadText>Click to upload images or drag and drop</FileUploadText>
                      <FileUploadSubtext>PNG, JPG, GIF up to 5MB each • Minimum 800x600px • Recommended 1200x800px</FileUploadSubtext>
                    </FileUploadArea>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'images')}
                      style={{ display: 'none' }}
                    />
                    <FileList>
                      {files.images.map((fileObj) => (
                        <FileItem key={fileObj.id}>
                          <FileIcon>{getFileIcon(fileObj.type)}</FileIcon>
                          <FileInfo>
                            <FileName>{fileObj.name}</FileName>
                            <FileSize>{formatFileSize(fileObj.size)}</FileSize>
                            <ProgressBar>
                              <ProgressFill progress={uploadProgress[fileObj.id] || 0} />
                            </ProgressBar>
                          </FileInfo>
                          <RemoveFile onClick={() => removeFile(fileObj.id, 'images')}>
                            ✕
                          </RemoveFile>
                        </FileItem>
                      ))}
                    </FileList>
                    {files.images.length === 0 && (
                      <ValidationMessage>
                        <i className="fas fa-exclamation-triangle"></i>
                        At least one project image is required
                      </ValidationMessage>
                    )}
                  </FormGroup>

                  {/* Videos */}
                  <FormGroup>
                    <Label>Project Videos</Label>
                    <FileUploadArea
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.multiple = true;
                        input.accept = 'video/*';
                        input.onchange = (e) => handleFileUpload(e, 'videos');
                        input.click();
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('video/'));
                        if (droppedFiles.length > 0) {
                          const event = { target: { files: droppedFiles } };
                          handleFileUpload(event, 'videos');
                        }
                      }}
                    >
                      <FileUploadIcon>
                        <i className="fas fa-video"></i>
                      </FileUploadIcon>
                      <FileUploadText>Click to upload videos or drag and drop</FileUploadText>
                      <FileUploadSubtext>MP4, MOV, AVI up to 100MB each</FileUploadSubtext>
                    </FileUploadArea>
                    <FileList>
                      {files.videos.map((fileObj) => (
                        <FileItem key={fileObj.id}>
                          <FileIcon>{getFileIcon(fileObj.type)}</FileIcon>
                          <FileInfo>
                            <FileName>{fileObj.name}</FileName>
                            <FileSize>{formatFileSize(fileObj.size)}</FileSize>
                            <ProgressBar>
                              <ProgressFill progress={uploadProgress[fileObj.id] || 0} />
                            </ProgressBar>
                          </FileInfo>
                          <RemoveFile onClick={() => removeFile(fileObj.id, 'videos')}>
                            ✕
                          </RemoveFile>
                        </FileItem>
                      ))}
                    </FileList>
                  </FormGroup>

                  {/* Documents */}
                  <FormGroup>
                    <Label>Additional Documents</Label>
                    <FileUploadArea
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.multiple = true;
                        input.accept = '.pdf,.doc,.docx,.ppt,.pptx';
                        input.onchange = (e) => handleFileUpload(e, 'documents');
                        input.click();
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const droppedFiles = Array.from(e.dataTransfer.files).filter(f => 
                          f.type.includes('pdf') || f.type.includes('document') || f.type.includes('presentation')
                        );
                        if (droppedFiles.length > 0) {
                          const event = { target: { files: droppedFiles } };
                          handleFileUpload(event, 'documents');
                        }
                      }}
                    >
                      <FileUploadIcon>
                        <i className="fas fa-file"></i>
                      </FileUploadIcon>
                      <FileUploadText>Click to upload documents or drag and drop</FileUploadText>
                      <FileUploadSubtext>PDF, DOC, PPT up to 20MB each</FileUploadSubtext>
                    </FileUploadArea>
                    <FileList>
                      {files.documents.map((fileObj) => (
                        <FileItem key={fileObj.id}>
                          <FileIcon>{getFileIcon(fileObj.type)}</FileIcon>
                          <FileInfo>
                            <FileName>{fileObj.name}</FileName>
                            <FileSize>{formatFileSize(fileObj.size)}</FileSize>
                            <ProgressBar>
                              <ProgressFill progress={uploadProgress[fileObj.id] || 0} />
                            </ProgressBar>
                          </FileInfo>
                          <RemoveFile onClick={() => removeFile(fileObj.id, 'documents')}>
                            ✕
                          </RemoveFile>
                        </FileItem>
                      ))}
                    </FileList>
                  </FormGroup>
                </FormSection>
              </FullWidthSection>

              <SubmitButton
                type="submit"
                disabled={!isFormValid() || isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <>
                    <span>Submitting...</span>
                    <div style={{ width: '20px', height: '20px', border: '2px solid transparent', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  </>
                ) : (
                  <>
                    <span>Submit Project</span>
                    <i className="fas fa-rocket"></i>
                  </>
                )}
              </SubmitButton>
            </form>
          )}
        </AnimatePresence>
      </FormCard>
    </FormContainer>
  );
};

export default FounderForm; 