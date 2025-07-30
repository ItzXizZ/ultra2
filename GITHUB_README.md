# 🚀 Ultra Portal - Complete Opportunity Management System

A full-stack web application for managing and discovering opportunities for high school students and investors. Built with Flask (Python) backend and React (JavaScript) frontend.

## ✨ Features

### 🎯 Core Functionality
- **Opportunity Submission**: Students and organizations can submit opportunities (jobs, internships, projects)
- **Investment Platform**: Students can submit funding requests for innovative projects
- **Admin Moderation**: Complete admin panel for reviewing and approving submissions
- **Dynamic Display**: Real-time updates of approved opportunities on public pages

### 🖼️ Image Management
- **Required Image Uploads**: Both opportunity and investment forms require images
- **Smart Validation**: 
  - Minimum dimensions: 800x600 pixels
  - Recommended dimensions: 1200x800 pixels
  - Aspect ratio validation: Close to 3:2 (1.5 ± 0.3 tolerance)
  - File size limit: 5MB maximum
  - Supported formats: JPG, PNG, GIF
- **Fallback Display**: Shows "NO IMAGE PROVIDED" when no image is uploaded

### 🔄 Real-time Updates
- **Automatic Refresh**: Data refreshes every 30 seconds automatically
- **Manual Refresh**: Refresh button on both student and investor pages
- **Live Synchronization**: Approved submissions appear immediately

### 🎨 User Experience
- **Modern UI**: Dark theme with glassmorphism design
- **Responsive Design**: Works on desktop and mobile devices
- **Loading States**: Smooth loading indicators and error handling
- **Interactive Elements**: Hover effects, animations, and smooth transitions

## 🏗️ Architecture

### Backend (Flask + MongoDB)
```
app/
├── __init__.py          # Flask app initialization
├── models.py            # Database models (User, OpportunitySubmission)
├── routes.py            # Main routes and page rendering
├── api_routes.py        # API endpoints for React frontend
├── rate_limiter.py      # Rate limiting for form submissions
└── templates/           # Jinja2 templates for server-rendered pages
```

### Frontend (React)
```
src/
├── App.js               # Main React component
├── components/          # Reusable React components
│   ├── ProviderForm.js  # Opportunity submission form
│   ├── FounderForm.js   # Investment submission form
│   ├── OpportunityCard.js # Opportunity display component
│   └── ...
├── services/
│   └── api.js           # API service for backend communication
└── hooks/
    └── useNotifications.js # Notification system
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 14+
- MongoDB

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ItzXizZ/ultra2.git
   cd ultra2
   ```

2. **Backend Setup**
   ```bash
   pip install -r requirements.txt
   python setup_database.py
   python run.py
   ```

3. **Frontend Setup**
   ```bash
   npm install
   npm start
   ```

4. **Access the Application**
   - Backend: http://localhost:5000
   - Frontend: http://localhost:3000
   - Admin Panel: http://localhost:5000/admin

## 📋 API Endpoints

### Opportunities
- `GET /api/opportunities?source=all` - Get all approved opportunities
- `GET /api/opportunities?source=funding` - Get funding opportunities only
- `POST /api/submit/general` - Submit general opportunity
- `POST /api/submit/funding` - Submit funding request
- `POST /api/submit/ultra` - Submit ultra exclusive opportunity
- `POST /api/submit/job` - Submit job opportunity

### Admin
- `GET /admin` - Admin dashboard
- `POST /admin/approve/<id>` - Approve submission
- `POST /admin/reject/<id>` - Reject submission
- `DELETE /admin/delete/<id>` - Delete submission

## 🎯 Key Features Implemented

### 1. Image Requirements System
- **ProviderForm**: Requires image upload with validation
- **FounderForm**: Requires at least one project image
- **Validation**: Dimensions, aspect ratio, file size, and format checking
- **User Feedback**: Clear error messages and requirements display

### 2. Real-time Data Synchronization
- **Automatic Refresh**: 30-second intervals
- **Manual Refresh**: User-triggered updates
- **Loading States**: Visual feedback during data fetching
- **Error Handling**: Graceful error display and retry options

### 3. Dynamic Opportunity Display
- **Student Page**: Shows jobs, internships, and general opportunities
- **Investor Page**: Shows funding opportunities
- **Image Fallback**: "NO IMAGE PROVIDED" display for missing images
- **Filtering**: Category, type, and location filters

### 4. Admin Moderation System
- **Submission Review**: View and manage all submissions
- **Approval Workflow**: Approve/reject submissions with comments
- **Status Tracking**: Track submission status (pending/approved/rejected)
- **Bulk Operations**: Delete multiple submissions

## 🔧 Technical Implementation

### Image Validation Logic
```javascript
// Dimension validation
if (img.width < 800 || img.height < 600) {
  alert('Minimum dimensions: 800x600 pixels');
}

// Aspect ratio validation
const aspectRatio = img.width / img.height;
const recommendedAspectRatio = 1200 / 800; // 1.5
if (Math.abs(aspectRatio - recommendedAspectRatio) > 0.3) {
  alert('Aspect ratio should be close to 3:2');
}
```

### Real-time Refresh
```javascript
useEffect(() => {
  fetchOpportunities();
  
  // Auto-refresh every 30 seconds
  const interval = setInterval(fetchOpportunities, 30000);
  return () => clearInterval(interval);
}, []);
```

### Dynamic Data Fetching
```javascript
// Fetch student opportunities
const studentResponse = await apiService.getOpportunities({ source: 'all' });

// Fetch funding opportunities  
const fundingResponse = await apiService.getOpportunities({ source: 'funding' });
```

## 📊 Database Schema

### OpportunitySubmission Model
```python
class OpportunitySubmission(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    company = db.Column(db.String(100))
    description = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), default='pending')  # pending/approved/rejected
    source = db.Column(db.String(20))  # general/funding/ultra/job
    file_attachment = db.Column(db.String(255))  # Image file path
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    # ... additional fields
```

## 🎨 UI Components

### Opportunity Cards
- **Image Display**: Shows uploaded image or fallback
- **Status Indicators**: Visual status badges
- **Action Buttons**: Apply, save, view details
- **Responsive Layout**: Adapts to different screen sizes

### Form Components
- **Image Upload**: Drag-and-drop with preview
- **Validation Feedback**: Real-time validation messages
- **Progress Indicators**: Upload progress and loading states
- **Error Handling**: Clear error messages and recovery options

## 🚀 Deployment

### Environment Variables
```bash
MONGODB_URI=mongodb://localhost:27017/ultra_portal
SECRET_KEY=your-secret-key
FLASK_ENV=production
```

### Production Setup
1. Set up MongoDB database
2. Configure environment variables
3. Install dependencies
4. Run database migrations
5. Start the application

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Flask for the robust backend framework
- React for the dynamic frontend
- MongoDB for flexible data storage
- Framer Motion for smooth animations
- Styled Components for modern CSS-in-JS

---

**Repository**: [https://github.com/ItzXizZ/ultra2](https://github.com/ItzXizZ/ultra2)

**Live Demo**: Available after deployment 