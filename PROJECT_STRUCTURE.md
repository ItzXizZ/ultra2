# Project Structure Guide

## 📁 Directory Organization

```
Ultra-Portal/
├── 📁 src/                          # React Frontend
│   ├── 📁 components/               # Reusable UI Components
│   │   ├── AdminPanel.js            # Admin dashboard interface
│   │   ├── BackgroundPhysics.js     # Animated background effects
│   │   ├── CustomCursor.js          # Custom cursor animations
│   │   ├── FounderForm.js           # Founder submission form
│   │   ├── GlassCard.js             # Glass morphism card component
│   │   ├── Notification.js          # Notification system
│   │   ├── OpportunityCard.js       # Opportunity display cards
│   │   ├── ProviderForm.js          # Provider submission form
│   │   └── UserToggle.js            # User type selector
│   ├── 📁 hooks/                    # Custom React Hooks
│   │   └── useNotifications.js      # Notification management hook
│   ├── 📁 services/                 # API and External Services
│   │   └── api.js                   # API client and service functions
│   ├── App.js                       # Main React application component
│   ├── index.js                     # React application entry point
│   └── index.css                    # Global styles and CSS variables
│
├── 📁 backend/                      # Node.js Backend
│   ├── 📁 src/                      # TypeScript Source Code
│   │   ├── 📁 config/               # Configuration Files
│   │   │   ├── ai.ts                # AI service configuration
│   │   │   ├── aws.ts               # AWS S3 configuration
│   │   │   ├── clerk.ts             # Clerk authentication config
│   │   │   ├── database.ts          # Database configuration
│   │   │   ├── redis.ts             # Redis cache configuration
│   │   │   └── stripe.ts            # Stripe payment configuration
│   │   ├── 📁 middleware/           # Express Middleware
│   │   │   ├── auth.ts              # JWT authentication middleware
│   │   │   └── errorHandler.ts      # Global error handling
│   │   ├── 📁 models/               # Data Models
│   │   │   └── OpportunitySubmission.ts
│   │   ├── 📁 routes/               # API Route Handlers
│   │   │   ├── opportunities.ts     # Opportunity-related routes
│   │   │   └── submissions.ts       # Submission management routes
│   │   ├── 📁 services/             # Business Logic Services
│   │   │   └── database.ts          # Database service layer
│   │   ├── server-simple.ts         # Main Express server (current)
│   │   └── server.ts                # Full-featured server (future)
│   ├── 📁 data/                     # JSON Data Storage
│   │   ├── assignments.json         # Assignment data
│   │   ├── opportunities.json       # Opportunity submissions
│   │   ├── students.json            # Student user data
│   │   ├── teachers.json            # Teacher user data
│   │   └── users.json               # User authentication data
│   ├── 📁 uploads/                  # File Upload Storage
│   ├── package.json                 # Backend dependencies
│   └── tsconfig.json                # TypeScript configuration
│
├── 📁 public/                       # Static Assets
│   ├── favicon.ico                  # Site favicon
│   ├── index.html                   # HTML template
│   ├── logo192.png                  # App logo
│   └── manifest.json                # PWA manifest
│
├── 📁 build/                        # Production Build Output
├── package.json                     # Root package.json with scripts
├── render.yaml                      # Render.com deployment config
├── .gitignore                       # Git ignore rules
├── LICENSE                          # MIT License
├── README.md                        # Main project documentation
└── PROJECT_STRUCTURE.md             # This file
```

## 🎯 Key Files Explained

### Frontend (React)
- **`src/App.js`**: Main application component with routing and state management
- **`src/services/api.js`**: Centralized API client for backend communication
- **`src/components/`**: Reusable UI components following atomic design principles
- **`src/hooks/`**: Custom React hooks for shared logic

### Backend (Node.js/Express)
- **`backend/src/server-simple.ts`**: Main Express server with all routes
- **`backend/src/config/`**: Environment-specific configurations
- **`backend/src/middleware/`**: Express middleware for authentication, error handling
- **`backend/src/routes/`**: API route handlers organized by feature
- **`backend/data/`**: JSON file storage (development) - easily migratable to MySQL

### Configuration
- **`package.json`**: Root package with workspace configuration and scripts
- **`render.yaml`**: Render.com deployment configuration
- **`.gitignore`**: Comprehensive ignore rules for Node.js development

## 🔄 Data Flow

```
Frontend (React) ←→ API Client ←→ Backend (Express) ←→ Data Storage
     ↓                    ↓              ↓                    ↓
  User Interface    HTTP Requests    Route Handlers    JSON Files/MySQL
```

## 📝 Development Workflow

1. **Frontend Changes**: Edit files in `src/` directory
2. **Backend Changes**: Edit files in `backend/src/` directory
3. **API Integration**: Use `src/services/api.js` for backend communication
4. **Data Management**: JSON files in `backend/data/` (development) or MySQL (production)

## 🚀 Deployment Structure

- **Frontend**: Built to `build/` directory, served by backend
- **Backend**: Serves both API and static files in production
- **Data**: Persistent disk storage on Render.com
- **Environment**: Configured via `render.yaml` and environment variables

## 🔧 Adding New Features

### Frontend Feature
1. Create component in `src/components/`
2. Add to `src/App.js` if needed
3. Update `src/services/api.js` for new API calls

### Backend Feature
1. Add route in `backend/src/routes/`
2. Add middleware in `backend/src/middleware/` if needed
3. Update data models in `backend/src/models/` if needed

### Database Changes
1. Update JSON schema in `backend/data/`
2. For production: Create MySQL migration scripts

This structure promotes:
- **Separation of Concerns**: Clear boundaries between frontend and backend
- **Scalability**: Easy to add new features and components
- **Maintainability**: Organized code that's easy to navigate
- **Deployment**: Simple deployment process with clear configuration 