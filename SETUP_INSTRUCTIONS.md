# Ultra Portal - Complete Setup Instructions

## 🚀 Overview

Ultra Portal is a comprehensive opportunity management system with:
- **Flask Backend** with SQLite/MongoDB support
- **React Frontend** with modern glassmorphic UI
- **Admin Panel** for submission moderation
- **Working Forms** for all opportunity types
- **File Upload** support
- **Authentication** system

## 📋 Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn
- MongoDB (optional, SQLite is default)

## 🛠️ Installation & Setup

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd Ultra-Portal

# Install Python dependencies
pip install -r requirements.txt

# Install Node.js dependencies
npm install
```

### 2. Database Setup

```bash
# Run the database setup script
python setup_database.py
```

This will:
- Create all database tables
- Create default admin user (admin/admin123)
- Add sample data for testing

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Flask Configuration
SECRET_KEY=your-secret-key-here
FLASK_ENV=development
FLASK_DEBUG=1

# Database Configuration
DATABASE_URL=sqlite:///opportunities.db
# For MongoDB (optional):
# MONGO_URI=mongodb://localhost:27017/ultra_portal

# File Upload Configuration
UPLOAD_FOLDER=app/uploads
MAX_CONTENT_LENGTH=16777216
```

### 4. Start the Application

#### Start Flask Backend (Terminal 1)
```bash
python run.py
```
The backend will run on `http://localhost:5000`

#### Start React Frontend (Terminal 2)
```bash
npm start
```
The frontend will run on `http://localhost:3000`

## 🎯 Features

### 1. **Working Forms**
All forms now store data in the database:

- **Ultra Exclusive Submissions** (`/submit/ultra`)
- **General Submissions** (`/submit/general`)
- **Funding Submissions** (`/submit/funding`)
- **Job Submissions** (`/submit/job`)

Each form includes:
- Submitter information
- Company details
- Application instructions
- File upload support
- Comprehensive validation

### 2. **Admin Panel**
Access the admin panel at `http://localhost:3000` and click "Admin"

**Default Login:**
- Username: `admin`
- Password: `admin123`

**Features:**
- Dashboard with statistics
- Submission review and approval
- Filter by status and source
- Bulk actions
- File management

### 3. **API Endpoints**

#### Authentication
- `POST /api/login` - Admin login
- `POST /api/logout` - Admin logout

#### Form Submissions
- `POST /api/submit/ultra` - Ultra exclusive submissions
- `POST /api/submit/general` - General submissions
- `POST /api/submit/funding` - Funding submissions
- `POST /api/submit/job` - Job submissions

#### Admin Panel
- `GET /api/admin/submissions` - Get all submissions
- `GET /api/admin/submissions/<id>` - Get specific submission
- `POST /api/admin/submissions/<id>/review` - Review submission
- `PUT /api/admin/submissions/<id>` - Update submission
- `DELETE /api/admin/submissions/<id>` - Delete submission
- `GET /api/admin/stats` - Get admin statistics

#### Public API
- `GET /api/opportunities` - Get approved opportunities
- `GET /api/opportunities/<id>` - Get specific opportunity

## 🗄️ Database Schema

### User Model
```python
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), default='admin')
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
```

### OpportunitySubmission Model
```python
class OpportunitySubmission(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    source = db.Column(db.String(32), nullable=False)  # ultra, general, funding, job
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    company = db.Column(db.String(200))
    location = db.Column(db.String(200))
    type = db.Column(db.String(100))
    application_deadline = db.Column(db.String(100))
    gpa_requirement = db.Column(db.String(20))
    skills = db.Column(db.String(300))
    grade_levels = db.Column(db.String(100))
    compensation = db.Column(db.String(100))
    file_attachment = db.Column(db.String(300))
    status = db.Column(db.String(20), default='pending')
    feedback = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    priority = db.Column(db.Boolean, default=False)
    badge = db.Column(db.String(100))
    
    # Submitter information
    submitter_role = db.Column(db.String(100))
    submitter_name = db.Column(db.String(200))
    submitter_email = db.Column(db.String(200))
    submitter_phone = db.Column(db.String(50))
    
    # Company information
    company_website = db.Column(db.String(500))
    company_size = db.Column(db.String(100))
    industry = db.Column(db.String(200))
    company_location = db.Column(db.String(200))
    
    # Application information
    application_link = db.Column(db.String(500))
    application_method = db.Column(db.String(100))
    application_instructions = db.Column(db.Text)
    
    # Admin fields
    reviewed_by = db.Column(db.Integer, db.ForeignKey('user.id'))
    reviewed_at = db.Column(db.DateTime)
    admin_notes = db.Column(db.Text)
```

## 🔧 Configuration Options

### Flask Configuration
- `SECRET_KEY`: Secret key for session management
- `DATABASE_URL`: Database connection string
- `MONGO_URI`: MongoDB connection string (optional)
- `UPLOAD_FOLDER`: File upload directory
- `MAX_CONTENT_LENGTH`: Maximum file upload size

### React Configuration
- API base URL: `http://localhost:5000/api`
- CORS enabled for development
- File upload support

## 🚀 Deployment

### Development
```bash
# Backend
python run.py

# Frontend
npm start
```

### Production
```bash
# Backend (with Gunicorn)
gunicorn -c gunicorn.conf.py run:app

# Frontend
npm run build
```

## 🔒 Security Features

- Password hashing with bcrypt
- Session-based authentication
- File upload security
- Input validation and sanitization
- CORS configuration
- Role-based access control

## 📁 File Structure

```
Ultra-Portal/
├── app/                          # Flask backend
│   ├── __init__.py              # App factory
│   ├── models.py                # Database models
│   ├── routes.py                # Main routes
│   ├── api_routes.py            # API endpoints
│   ├── templates/               # HTML templates
│   └── uploads/                 # File uploads
├── src/                         # React frontend
│   ├── components/              # React components
│   ├── services/                # API services
│   └── App.js                   # Main app component
├── requirements.txt             # Python dependencies
├── package.json                 # Node.js dependencies
├── setup_database.py            # Database setup script
└── run.py                       # Flask entry point
```

## 🐛 Troubleshooting

### Common Issues

1. **Port 3000 already in use**
   ```bash
   # Kill the process using port 3000
   lsof -ti:3000 | xargs kill -9
   ```

2. **Database errors**
   ```bash
   # Recreate the database
   python setup_database.py
   ```

3. **CORS errors**
   - Ensure the Flask backend is running on port 5000
   - Check that CORS is properly configured in `app/__init__.py`

4. **File upload errors**
   - Ensure the `app/uploads` directory exists
   - Check file size limits in configuration

### Logs
- Flask logs: Check terminal where `python run.py` is running
- React logs: Check terminal where `npm start` is running
- Browser console: F12 → Console tab

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the logs
3. Ensure all dependencies are installed
4. Verify configuration settings

## 🎉 Success!

Once everything is set up:
1. Visit `http://localhost:3000`
2. Click "Admin" to access the admin panel
3. Login with `admin/admin123`
4. Test the forms and admin functionality
5. Change the default admin password

The system is now fully functional with working forms, database storage, and admin moderation capabilities! 