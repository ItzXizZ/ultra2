# Ultra Portal

A comprehensive educational platform connecting students with opportunities, built with React frontend and Node.js backend.

## 🚀 Features

### For Students
- **Browse Opportunities**: Discover internships, jobs, research positions, and more
- **Advanced Filtering**: Filter by category, location, type, and requirements
- **Save Favorites**: Bookmark opportunities for later review
- **Real-time Updates**: Get notified of new opportunities
- **Responsive Design**: Works seamlessly on all devices

### For Opportunity Providers
- **Submit Opportunities**: Easy form submission for various opportunity types
- **File Attachments**: Upload supporting documents and images
- **Status Tracking**: Monitor submission review status
- **Multiple Categories**: Submit jobs, funding, general opportunities, and founder projects

### For Administrators
- **Comprehensive Dashboard**: Review and manage all submissions
- **Approval System**: Approve, reject, or request changes
- **Analytics**: View submission statistics and trends
- **User Management**: Manage users and permissions

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **Styled Components** - CSS-in-JS styling
- **Framer Motion** - Smooth animations and transitions
- **React Hooks** - State management and side effects
- **Custom Components** - Reusable UI components

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type-safe development
- **JWT Authentication** - Secure user authentication
- **Multer** - File upload handling
- **Rate Limiting** - Protection against abuse
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security headers

### Data Storage
- **JSON Files** - Simple, fast development storage
- **MySQL Ready** - Easy migration path for production
- **File Uploads** - Secure file storage system

## 📦 Installation & Setup

### Prerequisites
- Node.js 18.17.0 or higher
- npm 8.0.0 or higher

### Quick Start
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Ultra-Portal
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Start development servers**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/health

## 🔧 Available Scripts

### Development
- `npm run dev` - Start both frontend and backend in development mode
- `npm run start` - Start React frontend only
- `npm run backend:dev` - Start Node.js backend in development mode

### Building
- `npm run build` - Build React frontend for production
- `npm run backend:build` - Build Node.js backend for production
- `npm run build:all` - Build both frontend and backend

### Installation
- `npm run install:all` - Install dependencies for both frontend and backend

### Testing
- `npm run test` - Run React tests

## 🌐 API Endpoints

### Authentication
- `POST /api/login` - User authentication
- `POST /api/logout` - User logout

### Form Submissions
- `POST /api/submit/general` - Submit general opportunities
- `POST /api/submit/funding` - Submit funding opportunities
- `POST /api/submit/founder` - Submit founder projects
- `POST /api/submit/job` - Submit job opportunities

### Public API
- `GET /api/opportunities` - Fetch approved opportunities
- `GET /api/opportunities/:id` - Get specific opportunity details
- `GET /api/submission/stats` - Get submission statistics

### Admin API (Authentication Required)
- `GET /api/admin/submissions` - Get all submissions
- `GET /api/admin/submissions/:id` - Get specific submission
- `POST /api/admin/submissions/:id/review` - Review submission
- `PUT /api/admin/submissions/:id` - Update submission
- `DELETE /api/admin/submissions/:id` - Delete submission
- `GET /api/admin/stats` - Get admin statistics

### User Management
- `GET /api/users/profile` - Get user profile
- `GET /api/students` - Get all students
- `POST /api/students` - Create new student
- `GET /api/teachers` - Get all teachers
- `POST /api/teachers` - Create new teacher

### System
- `GET /health` - Health check endpoint

## 🔐 Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Security
JWT_SECRET=your-super-secret-jwt-key-here

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Database (for future MySQL migration)
DATABASE_URL=mysql://user:password@localhost:3306/ultra_portal

# File Upload
MAX_FILE_SIZE=16777216
UPLOAD_PATH=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📁 Project Structure

```
Ultra-Portal/
├── src/                          # React frontend
│   ├── components/               # React components
│   │   ├── AdminPanel.js         # Admin dashboard
│   │   ├── BackgroundPhysics.js  # Animated background
│   │   ├── CustomCursor.js       # Custom cursor effects
│   │   ├── FounderForm.js        # Founder submission form
│   │   ├── GlassCard.js          # Glass morphism cards
│   │   ├── Notification.js       # Notification system
│   │   ├── OpportunityCard.js    # Opportunity display cards
│   │   ├── ProviderForm.js       # Provider submission form
│   │   └── UserToggle.js         # User type selector
│   ├── hooks/                    # Custom React hooks
│   │   └── useNotifications.js   # Notification hook
│   ├── services/                 # API services
│   │   └── api.js               # API client
│   ├── App.js                   # Main React component
│   ├── index.js                 # React entry point
│   └── index.css                # Global styles
├── backend/                      # Node.js backend
│   ├── src/                     # TypeScript source
│   │   ├── config/              # Configuration files
│   │   │   ├── ai.ts            # AI service config
│   │   │   ├── aws.ts           # AWS config
│   │   │   ├── clerk.ts         # Clerk auth config
│   │   │   ├── database.ts      # Database config
│   │   │   ├── redis.ts         # Redis config
│   │   │   └── stripe.ts        # Stripe config
│   │   ├── middleware/          # Express middleware
│   │   │   ├── auth.ts          # Authentication middleware
│   │   │   └── errorHandler.ts  # Error handling
│   │   ├── models/              # Data models
│   │   │   └── OpportunitySubmission.ts
│   │   ├── routes/              # API routes
│   │   │   ├── opportunities.ts # Opportunity routes
│   │   │   └── submissions.ts   # Submission routes
│   │   ├── services/            # Business logic
│   │   │   └── database.ts      # Database service
│   │   ├── server-simple.ts     # Main server file
│   │   └── server.ts            # Full server implementation
│   ├── data/                    # JSON data storage
│   │   ├── assignments.json     # Assignment data
│   │   ├── opportunities.json   # Opportunity data
│   │   ├── students.json        # Student data
│   │   ├── teachers.json        # Teacher data
│   │   └── users.json           # User data
│   ├── uploads/                 # File uploads
│   ├── package.json             # Backend dependencies
│   └── tsconfig.json            # TypeScript config
├── public/                      # Static assets
│   ├── favicon.ico
│   ├── index.html
│   ├── logo192.png
│   └── manifest.json
├── build/                       # Production build
├── package.json                 # Root package.json
├── render.yaml                  # Deployment config
└── README.md                    # This file
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Configured for specific origins
- **Security Headers**: Helmet.js for enhanced security
- **Input Validation**: Server-side validation for all inputs
- **File Upload Restrictions**: 16MB file size limit
- **SQL Injection Protection**: Parameterized queries (when using MySQL)

## 🚀 Deployment

### Render.com Deployment
The project is configured for deployment on Render.com using the `render.yaml` file.

1. **Connect your repository** to Render.com
2. **Environment variables** will be automatically configured
3. **Build process** is handled automatically
4. **Persistent disk** is configured for data storage

### Manual Deployment
1. **Build the application**:
   ```bash
   npm run build:all
   ```

2. **Set environment variables** in your hosting platform

3. **Start the server**:
   ```bash
   npm run backend:start
   ```

## 📊 Data Management

### Default Admin User
- **Email**: admin@ultraportal.com
- **Password**: admin123
- **Role**: admin

### Data Storage
- **Development**: JSON files in `backend/data/`
- **Production**: MySQL database (configurable)
- **File Uploads**: Local storage in `backend/uploads/`

## 🔧 Development Guidelines

### Code Style
- **Frontend**: Use functional components with hooks
- **Backend**: Use TypeScript for type safety
- **API**: RESTful design principles
- **Error Handling**: Comprehensive error handling throughout

### Adding New Features
1. **Frontend**: Add components in `src/components/`
2. **Backend**: Add routes in `backend/src/routes/`
3. **API**: Follow existing endpoint patterns
4. **Testing**: Add tests for new functionality

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Test thoroughly**
5. **Submit a pull request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Check the documentation above
- Review the code comments
- Create an issue in the repository

---

**Ultra Portal** - Connecting students with opportunities, one submission at a time. 🚀
