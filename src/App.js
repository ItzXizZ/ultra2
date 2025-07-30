import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import GlassCard from './components/GlassCard';
import OpportunityCard from './components/OpportunityCard';
import UserToggle from './components/UserToggle';
import ProviderForm from './components/ProviderForm';
import FounderForm from './components/FounderForm';
import AdminPanel from './components/AdminPanel';
import NotificationContainer from './components/Notification';
import useNotifications from './hooks/useNotifications';
import { Galaxy } from './components/BackgroundPhysics';
import apiService from './services/api';

// Styled Components
const AppContainer = styled.div`
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
`;

const FloatingLogo = styled(motion.div)`
  position: fixed;
  top: 2rem;
  left: 2.5rem;
  z-index: 1000;
  font-size: 2rem;
  font-weight: 800;
  color: #FFFFFF;
  text-shadow: 0 0 5px rgba(255, 215, 0, 0.4), 0 0 10px rgba(255, 215, 0, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    text-shadow: 0 0 8px rgba(255, 215, 0, 0.6), 0 0 15px rgba(255, 215, 0, 0.3);
  }
`;

const FloatingAdminButton = styled(motion.button)`
  position: fixed;
  top: 2rem;
  right: 2.5rem;
  z-index: 1000;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #FFFFFF;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-shadow: 0 0 3px rgba(255, 215, 0, 0.3), 0 0 6px rgba(255, 215, 0, 0.2);
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 215, 0, 0.2), 0 0 15px rgba(255, 215, 0, 0.1);
  }
`;

const HeroSection = styled.section`
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 2rem;
  overflow: hidden;
`;

const HeroContent = styled.div`
  text-align: center;
  max-width: 1200px;
  position: relative;
  z-index: 2;
`;

const GlowEffect = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 150px;
  background: 
    radial-gradient(ellipse 80% 60% at 50% 100%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 215, 0, 0.2) 30%, transparent 70%),
    radial-gradient(ellipse 60% 40% at 30% 100%, rgba(255, 255, 255, 0.3) 0%, transparent 60%),
    radial-gradient(ellipse 60% 40% at 70% 100%, rgba(255, 255, 255, 0.3) 0%, transparent 60%);
  z-index: 1;
  pointer-events: none;
  filter: blur(1px);
`;

const HeroBadge = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
`;

const HeroTitle = styled(motion.h1)`
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 3rem;
  color: #FFFFFF;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.2);
`;

const Content = styled.div`
  padding: 0 2.5rem 5rem;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 5rem;
`;

const StatCard = styled(GlassCard)`
  padding: 2rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.02) !important;
  backdrop-filter: blur(15px) !important;
  -webkit-backdrop-filter: blur(15px) !important;
  border: 1px solid rgba(255, 255, 255, 0.05) !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2) !important;
`;

const StatNumber = styled.div`
  font-size: 3rem;
  font-weight: 900;
  color: #FFFFFF;
  text-shadow: 0 0 5px rgba(255, 215, 0, 0.4), 0 0 10px rgba(255, 215, 0, 0.2);
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
`;

const SectionHeader = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const SectionIcon = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  background: ${props => props.type === 'invest' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)'};
  color: ${props => props.type === 'invest' ? '#FFFFFF' : '#ffffff'};
  text-shadow: ${props => props.type === 'invest' 
    ? '0 0 3px rgba(255, 215, 0, 0.3), 0 0 6px rgba(255, 215, 0, 0.2)' 
    : 'none'};
  border: ${props => props.type === 'invest' 
    ? '1px solid rgba(255, 215, 0, 0.2)' 
    : 'none'};
`;

const SectionTitle = styled.h2`
  font-size: 2.25rem;
  font-weight: 800;
  color: #FFFFFF;
`;

const OpportunitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
  gap: 2rem;
  margin-bottom: 5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

// Dynamic data will be fetched from API - now handled by state





const FilterRow = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const FilterSelect = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
  color: #FFFFFF;
  font-size: 0.875rem;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: rgba(255, 215, 0, 0.6);
    box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
  }
  
  &:hover {
    border-color: rgba(255, 255, 255, 0.25);
    background: rgba(255, 255, 255, 0.1);
  }
  
  option {
    background: #1a1a1a;
    color: #FFFFFF;
  }
`;

const FilterInput = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
  color: #FFFFFF;
  font-size: 0.875rem;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: rgba(255, 215, 0, 0.6);
    box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
  }
  
  &:hover {
    border-color: rgba(255, 255, 255, 0.25);
    background: rgba(255, 255, 255, 0.1);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const SearchBar = styled.div`
  position: relative;
  margin-bottom: 2rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1.25rem 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.08);
  color: #FFFFFF;
  font-size: 1rem;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  transition: all 0.3s ease;
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  
  &:focus {
    outline: none;
    border-color: rgba(255, 215, 0, 0.6);
    box-shadow: 
      0 0 0 3px rgba(255, 215, 0, 0.1),
      0 8px 25px rgba(0, 0, 0, 0.15);
    background: rgba(255, 255, 255, 0.12);
  }
  
  &:hover {
    border-color: rgba(255, 255, 255, 0.25);
    background: rgba(255, 255, 255, 0.1);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ActionButton = styled(motion.button)`
  padding: 0.875rem 1.75rem;
  border: none;
  border-radius: 12px;
  background: ${props => props.primary ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.9) 0%, rgba(255, 165, 0, 0.8) 100%)' : 'rgba(255, 255, 255, 0.08)'};
  color: ${props => props.primary ? '#000000' : '#FFFFFF'};
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid ${props => props.primary ? 'rgba(255, 215, 0, 0.3)' : 'rgba(255, 255, 255, 0.15)'};
  box-shadow: ${props => props.primary 
    ? '0 4px 15px rgba(255, 215, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.1)' 
    : '0 4px 15px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'};
  
  &:hover {
    transform: translateY(-2px);
    background: ${props => props.primary 
      ? 'linear-gradient(135deg, rgba(255, 215, 0, 1) 0%, rgba(255, 165, 0, 0.9) 100%)' 
      : 'rgba(255, 255, 255, 0.12)'};
    box-shadow: ${props => props.primary 
      ? '0 8px 25px rgba(255, 215, 0, 0.4), 0 4px 12px rgba(0, 0, 0, 0.15)' 
      : '0 8px 25px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.15)'};
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const PageContent = styled.div`
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 2rem;
  margin-top: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const FiltersSidebar = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  height: fit-content;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 2rem;
`;

const FilterTitle = styled.h3`
  color: #FFFFFF;
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  &::before {
    content: '';
    width: 4px;
    height: 24px;
    background: linear-gradient(to bottom, rgba(255, 215, 0, 0.8), rgba(255, 215, 0, 0.4));
    border-radius: 2px;
  }
`;

const FilterGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FilterLabel = styled.label`
  display: block;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  letter-spacing: 0.025em;
`;

const Checkbox = styled.input`
  margin-right: 0.75rem;
  accent-color: rgba(255, 215, 0, 0.8);
`;

const CheckboxLabel = styled.label`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: color 0.3s ease;
  
  &:hover {
    color: rgba(255, 255, 255, 0.9);
  }
`;

function App() {
  const [showGlow, setShowGlow] = useState(false);
  const [glowDisabled, setGlowDisabled] = useState(false);
  const [currentUserType, setCurrentUserType] = useState(0); // 0: Student, 1: Provider, 2: Investor, 3: Founder
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'All categories',
    type: 'All types',
    location: 'All locations',
    minFunding: 0,
    maxFunding: 100000,
    savedOnly: false
  });
  const [savedItems, setSavedItems] = useState({
    opportunities: [],
    projects: []
  });
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'saved'
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showProviderForm, setShowProviderForm] = useState(false);
  
  // Dynamic opportunities state
  const [applyOpportunities, setApplyOpportunities] = useState([]);
  const [investOpportunities, setInvestOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Notification system
  const notifications = useNotifications();

  const handleToggle = (index) => {
    setCurrentUserType(index);
    // Close admin panel when toggle is used
    if (showAdminPanel) {
      setShowAdminPanel(false);
    }
    if (!glowDisabled) {
      setShowGlow(true);
      setTimeout(() => setShowGlow(false), 600);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveItem = (item, type) => {
    if (type === 'opportunity') {
      setSavedItems(prev => ({
        ...prev,
        opportunities: prev.opportunities.some(saved => saved.id === item.id) 
          ? prev.opportunities.filter(saved => saved.id !== item.id)
          : [...prev.opportunities, item]
      }));
    } else if (type === 'project') {
      setSavedItems(prev => ({
        ...prev,
        projects: prev.projects.some(saved => saved.id === item.id) 
          ? prev.projects.filter(saved => saved.id !== item.id)
          : [...prev.projects, item]
      }));
    }
  };

  const isItemSaved = (item, type) => {
    if (type === 'opportunity') {
      return savedItems.opportunities.some(saved => saved.id === item.id);
    } else if (type === 'project') {
      return savedItems.projects.some(saved => saved.id === item.id);
    }
    return false;
  };

  const filteredOpportunities = (opportunities) => {
    let filtered = opportunities;
    
    // Filter by saved items if "Saved Only" is checked or if we're in saved tab
    if (filters.savedOnly || activeTab === 'saved') {
      filtered = opportunities.filter(opp => isItemSaved(opp, 'opportunity'));
    }
    
    // Filter by search term
    const searchFiltered = filtered.filter(opp => {
      const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           opp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           opp.company.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = filters.category === 'All categories' || opp.category === filters.category;
      const matchesType = filters.type === 'All types' || opp.type === filters.type;
      const matchesLocation = filters.location === 'All locations' || opp.location === filters.location;
      
      return matchesSearch && matchesCategory && matchesType && matchesLocation;
    });
    
    return searchFiltered;
  };

  const filteredProjects = (projects) => {
    let filtered = projects;
    
    // Filter by saved items if "Saved Only" is checked or if we're in saved tab
    if (filters.savedOnly || activeTab === 'saved') {
      filtered = projects.filter(proj => isItemSaved(proj, 'project'));
    }
    
    // Filter by search term
    const searchFiltered = filtered.filter(proj => {
      const matchesSearch = proj.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           proj.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           proj.company.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = filters.category === 'All categories' || proj.category === filters.category;
      const matchesType = filters.type === 'All types' || proj.type === filters.type;
      const matchesLocation = filters.location === 'All locations' || proj.location === filters.location;
      
      return matchesSearch && matchesCategory && matchesType && matchesLocation;
    });
    
    return searchFiltered;
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0 && !glowDisabled) {
        setGlowDisabled(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [glowDisabled]);

  // Fetch opportunities from API
  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch student opportunities (jobs, general, ultra)
      const studentResponse = await apiService.getOpportunities({ source: 'all' });
      
      if (studentResponse.success && studentResponse.opportunities) {
        // Transform API data to match the expected format
        const transformedOpportunities = studentResponse.opportunities.map(opp => ({
          id: opp.id,
          title: opp.title,
          company: opp.company || 'N/A',
          description: opp.description,
          location: opp.location || 'Remote',
          deadline: opp.application_deadline || 'No deadline',
          stats: opp.compensation || 'Contact for details',
          tags: opp.skills ? opp.skills.split(',').map(s => s.trim()) : [],
          category: opp.type || 'General',
          type: opp.source === 'ultra' ? 'Ultra Exclusive' : opp.source === 'job' ? 'Job' : 'General',
          imageUrl: opp.file_attachment ? `/uploads/${opp.file_attachment}` : null, // Use uploaded file if available
          badge: opp.badge,
          priority: opp.priority,
          application_link: opp.application_link
        }));
        
        setApplyOpportunities(transformedOpportunities);
      }
      
      // Fetch funding opportunities
      const fundingResponse = await apiService.getOpportunities({ source: 'funding' });
      
      if (fundingResponse.success && fundingResponse.opportunities) {
        // Transform API data to match the expected format
        const transformedFunding = fundingResponse.opportunities.map(opp => ({
          id: opp.id,
          title: opp.title,
          company: `by ${opp.submitter_name || opp.company || 'Anonymous'}`,
          description: opp.description,
          location: opp.location || 'Remote',
          deadline: opp.application_deadline || 'No deadline',
          stats: opp.compensation || 'Contact for details',
          progress: Math.floor(Math.random() * 40) + 60, // Random progress for demo
          tags: opp.skills ? opp.skills.split(',').map(s => s.trim()) : [],
          category: opp.type || 'Funding',
          type: opp.source === 'funding' ? 'Funding' : 'General',
          imageUrl: opp.file_attachment ? `/uploads/${opp.file_attachment}` : null, // Use uploaded file if available
          badge: opp.badge,
          priority: opp.priority,
          application_link: opp.application_link
        }));
        
        setInvestOpportunities(transformedFunding);
      }
    } catch (err) {
      console.error('Error fetching opportunities:', err);
      setError('Failed to load opportunities. Please try again later.');
      // Fallback to empty arrays
      setApplyOpportunities([]);
      setInvestOpportunities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
    
    // Set up automatic refresh every 30 seconds
    const interval = setInterval(() => {
      fetchOpportunities();
    }, 30000); // 30 seconds
    
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const renderStudentPage = () => (
    <Content>
      <SectionHeader
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <SectionIcon type="apply">
          <i className="fas fa-briefcase"></i>
        </SectionIcon>
        <SectionTitle>Opportunities</SectionTitle>
      </SectionHeader>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '2rem' }}
      >
        {activeTab === 'saved' 
          ? `Viewing your saved opportunities. Displaying ${filteredOpportunities(applyOpportunities).length} saved opportunities • Your bookmarked items.`
          : `Discover and apply for amazing opportunities. Displaying ${filteredOpportunities(applyOpportunities).length} opportunities • Find your next big break.`
        }
      </motion.p>

      <ActionButtons>
        <ActionButton primary whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <i className="fas fa-trophy"></i>
          Leaderboard
        </ActionButton>
        <ActionButton 
          onClick={() => setActiveTab(activeTab === 'all' ? 'saved' : 'all')}
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }}
        >
          <i className="fas fa-bookmark"></i>
          {activeTab === 'all' ? 'Saved' : 'All'}
        </ActionButton>
        <ActionButton 
          onClick={fetchOpportunities}
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }}
          style={{ background: 'rgba(255, 255, 255, 0.1)' }}
        >
          <i className="fas fa-sync-alt"></i>
          Refresh
        </ActionButton>
      </ActionButtons>

      <PageContent>
        {/* Loading and Error States */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ 
              textAlign: 'center', 
              padding: '2rem',
              color: 'rgba(255, 255, 255, 0.8)'
            }}
          >
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '1rem' }}></i>
            <p>Loading opportunities...</p>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ 
              textAlign: 'center', 
              padding: '2rem',
              color: '#ff6b6b'
            }}
          >
            <i className="fas fa-exclamation-triangle" style={{ fontSize: '2rem', marginBottom: '1rem' }}></i>
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                marginTop: '1rem'
              }}
            >
              Try Again
            </button>
          </motion.div>
        )}

        {!loading && !error && (
          <>
            <FiltersSidebar>
          <FilterTitle>Filters</FilterTitle>
          
          <FilterGroup>
            <FilterLabel>Opportunity Type</FilterLabel>
            <FilterSelect 
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option>All types</option>
              <option>Internship</option>
              <option>Part-time</option>
              <option>Research</option>
              <option>Mentorship</option>
              <option>Competition</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Work Type</FilterLabel>
            <FilterSelect 
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option>All work types</option>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Remote</option>
              <option>On-site</option>
              <option>Hybrid</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Location</FilterLabel>
            <FilterSelect 
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            >
              <option>All locations</option>
              <option>San Francisco, CA</option>
              <option>Remote</option>
              <option>Boston, MA</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <CheckboxLabel>
              <Checkbox 
                type="checkbox"
                checked={filters.savedOnly}
                onChange={(e) => handleFilterChange('savedOnly', e.target.checked)}
              />
              Saved Opportunities Only
            </CheckboxLabel>
          </FilterGroup>
        </FiltersSidebar>

        <div>
          <SearchBar>
            <SearchInput
              type="text"
              placeholder="Search opportunities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBar>

          <OpportunitiesGrid>
            {filteredOpportunities(applyOpportunities).map((opportunity, index) => (
              <OpportunityCard
                key={index}
                opportunity={opportunity}
                type="apply"
                delay={index}
                onClick={() => handleSaveItem(opportunity, 'opportunity')}
                onSave={() => handleSaveItem(opportunity, 'opportunity')}
                isSaved={isItemSaved(opportunity, 'opportunity')}
              />
            ))}
          </OpportunitiesGrid>
        </div>
          </>
        )}
      </PageContent>
    </Content>
  );

  const renderInvestorPage = () => (
    <Content>
      <SectionHeader
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <SectionIcon type="invest">
          <i className="fas fa-chart-line"></i>
        </SectionIcon>
        <SectionTitle>Investment Opportunities</SectionTitle>
      </SectionHeader>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '2rem' }}
      >
        {activeTab === 'saved' 
          ? `Viewing your saved projects. Displaying ${filteredProjects(investOpportunities).length} saved projects • Your bookmarked investments.`
          : `Discover and invest in innovative student projects. Displaying ${filteredProjects(investOpportunities).length} projects • Support the next generation of innovators.`
        }
      </motion.p>

      <ActionButtons>
        <ActionButton primary whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <i className="fas fa-trophy"></i>
          Leaderboard
        </ActionButton>
        <ActionButton 
          onClick={() => setActiveTab(activeTab === 'all' ? 'saved' : 'all')}
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }}
        >
          <i className="fas fa-bookmark"></i>
          {activeTab === 'all' ? 'Saved' : 'All'}
        </ActionButton>
        <ActionButton 
          onClick={fetchOpportunities}
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }}
          style={{ background: 'rgba(255, 255, 255, 0.1)' }}
        >
          <i className="fas fa-sync-alt"></i>
          Refresh
        </ActionButton>
      </ActionButtons>

      <PageContent>
        {/* Loading and Error States */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ 
              textAlign: 'center', 
              padding: '2rem',
              color: 'rgba(255, 255, 255, 0.8)'
            }}
          >
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '1rem' }}></i>
            <p>Loading investment opportunities...</p>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ 
              textAlign: 'center', 
              padding: '2rem',
              color: '#ff6b6b'
            }}
          >
            <i className="fas fa-exclamation-triangle" style={{ fontSize: '2rem', marginBottom: '1rem' }}></i>
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                marginTop: '1rem'
              }}
            >
              Try Again
            </button>
          </motion.div>
        )}

        {!loading && !error && (
          <>
            <FiltersSidebar>
          <FilterTitle>Filters</FilterTitle>
          
          <FilterGroup>
            <FilterLabel>Category</FilterLabel>
            <FilterSelect 
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option>All categories</option>
              <option>Environmental Tech</option>
              <option>Mobile App</option>
              <option>Food Tech</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Type</FilterLabel>
            <FilterSelect 
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option>All types</option>
              <option>Hardware</option>
              <option>Software</option>
              <option>Service</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Location</FilterLabel>
            <FilterSelect 
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            >
              <option>All locations</option>
              <option>Hawaii</option>
              <option>Stanford, CA</option>
              <option>New York, NY</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Funding Goal Range</FilterLabel>
            <FilterRow>
              <FilterInput
                type="number"
                placeholder="From ($)"
                value={filters.minFunding}
                onChange={(e) => handleFilterChange('minFunding', parseInt(e.target.value) || 0)}
              />
              <FilterInput
                type="number"
                placeholder="To ($)"
                value={filters.maxFunding}
                onChange={(e) => handleFilterChange('maxFunding', parseInt(e.target.value) || 100000)}
              />
            </FilterRow>
          </FilterGroup>

          <FilterGroup>
            <CheckboxLabel>
              <Checkbox 
                type="checkbox"
                checked={filters.savedOnly}
                onChange={(e) => handleFilterChange('savedOnly', e.target.checked)}
              />
              Saved Projects Only
            </CheckboxLabel>
          </FilterGroup>
        </FiltersSidebar>

        <div>
          <SearchBar>
            <SearchInput
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBar>

          <OpportunitiesGrid>
            {filteredProjects(investOpportunities).map((opportunity, index) => (
              <OpportunityCard
                key={index}
                opportunity={opportunity}
                type="invest"
                delay={index}
                onClick={() => handleSaveItem(opportunity, 'project')}
                onSave={() => handleSaveItem(opportunity, 'project')}
                isSaved={isItemSaved(opportunity, 'project')}
              />
            ))}
          </OpportunitiesGrid>
        </div>
          </>
        )}
      </PageContent>
    </Content>
  );

  // Form submission handler with notifications
  const handleFormSubmission = async (formType, formData) => {
    try {
      // Show loading notification
      notifications.showInfo('Submitting...', 'Please wait while we process your submission.');
      
      let response;
      switch (formType) {
        case 'ultra':
          response = await apiService.submitUltra(formData);
          break;
        case 'general':
          response = await apiService.submitGeneral(formData);
          break;
        case 'funding':
          response = await apiService.submitFunding(formData);
          break;
        case 'job':
          response = await apiService.submitJob(formData);
          break;
        default:
          throw new Error('Unknown form type');
      }
      
      // Show success notification
      notifications.showSuccess(
        'Submission Successful!', 
        response.message || 'Your submission has been received and is under review.'
      );
      
      // Reset form state if needed
      if (showProviderForm) {
        setShowProviderForm(false);
      }
      
    } catch (error) {
      console.error('Form submission error:', error);
      
      // Show error notification
      if (error.message.includes('Rate limit')) {
        notifications.showWarning(
          'Rate Limit Exceeded', 
          error.message
        );
      } else {
        notifications.showError(
          'Submission Failed', 
          error.message || 'An error occurred while submitting your form. Please try again.'
        );
      }
    }
  };

  return (
    <AppContainer>
      <Galaxy />
      
      {/* Notification Container */}
      <NotificationContainer 
        notifications={notifications.notifications} 
        onClose={notifications.removeNotification} 
      />

      <FloatingLogo
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Ultra
      </FloatingLogo>
      
      <FloatingAdminButton
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowAdminPanel(true)}
      >
        <i className="fas fa-shield-alt"></i>
        Admin
      </FloatingAdminButton>

      <HeroSection>
        {showGlow && (
          <GlowEffect
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: [0, 1, 0.8, 0],
              scale: [0.8, 1.1, 1, 0.9]
            }}
            transition={{ 
              duration: 0.6,
              ease: "easeInOut",
              times: [0, 0.3, 0.7, 1]
            }}
          />
        )}
        <HeroContent>
          <HeroTitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            Ultra Portal
          </HeroTitle>
          
          <UserToggle
            onToggle={handleToggle}
            initialValue={0}
          />
        </HeroContent>
      </HeroSection>

      <AnimatePresence mode="wait">
        {showAdminPanel ? (
          <AdminPanel key="admin" onClose={() => setShowAdminPanel(false)} />
        ) : showProviderForm ? (
          <ProviderForm key="provider" onSubmit={handleFormSubmission} />
        ) : currentUserType === 1 ? (
          <ProviderForm key="provider" onSubmit={handleFormSubmission} />
        ) : currentUserType === 3 ? (
          <FounderForm key="founder" onSubmit={handleFormSubmission} />
        ) : currentUserType === 2 ? (
          <motion.div
            key="investor"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderInvestorPage()}
          </motion.div>
        ) : (
          <motion.div
            key="student"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderStudentPage()}
          </motion.div>
        )}
      </AnimatePresence>
    </AppContainer>
  );
}

export default App; 