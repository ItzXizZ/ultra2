# Ultra Portal - Node.js Backend Migration

This is a **direct replacement** for the Flask backend that maintains **100% API compatibility** with the existing React frontend.

## 🎯 What This Does

- **Exact API Endpoint Matching**: All Flask routes are replicated exactly
- **Same Database Schema**: Uses the same SQLite database structure
- **Identical Response Format**: Frontend doesn't need any changes
- **File Upload Compatibility**: Same file handling as Flask
- **Authentication**: JWT-based auth (replaces Flask-Login)

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Build TypeScript
```bash
npm run build
```

### 3. Start the Server
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## 📋 API Endpoints (Exact Flask Match)

### Authentication
- `POST /api/login` - User login
- `POST /api/logout` - User logout

### Submissions
- `POST /api/submit/general` - Submit general opportunity
- `POST /api/submit/funding` - Submit funding opportunity  
- `POST /api/submit/founder` - Submit founder opportunity
- `POST /api/submit/job` - Submit job opportunity

### Public API
- `GET /api/opportunities` - Get approved opportunities
- `GET /api/opportunities/:id` - Get specific opportunity

### Admin API
- `GET /api/admin/submissions` - Get all submissions
- `POST /api/admin/submissions/:id/review` - Review submission
- `GET /api/submission/stats` - Get submission statistics

## 🔄 Migration Steps

### 1. Stop Flask Server
```bash
# Stop your current Flask server
```

### 2. Start Node.js Server
```bash
cd backend
npm start
```

### 3. Test Frontend
The React frontend should work exactly the same!

## 🗄️ Database

- Uses the same SQLite database (`instance/opportunities.db`)
- Automatically creates tables if they don't exist
- Creates default admin user: `admin` / `UltraAdmin2025!`

## 🔧 Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key-here
FRONTEND_URL=http://localhost:3000
```

## 📁 File Structure

```
backend/
├── src/
│   ├── models/
│   │   ├── User.ts              # User model (matches Flask)
│   │   └── OpportunitySubmission.ts  # Submission model (matches Flask)
│   └── server-simple.ts         # Main server file
├── uploads/                     # File uploads (matches Flask)
├── package.json
└── tsconfig.json
```

## ✅ Compatibility Checklist

- [x] Same API endpoints
- [x] Same request/response format
- [x] Same file upload handling
- [x] Same database schema
- [x] Same authentication flow
- [x] Same admin functionality
- [x] Same static file serving

## 🎉 Benefits

1. **Better Performance**: Node.js is generally faster than Flask
2. **TypeScript**: Better type safety and developer experience
3. **Modern Stack**: More maintainable and scalable
4. **Same Functionality**: Zero frontend changes needed

## 🚨 Important Notes

- The frontend **doesn't need any changes**
- All existing data will be preserved
- Same admin credentials work
- File uploads work exactly the same

## 🔍 Troubleshooting

If you encounter issues:

1. **Database Issues**: Delete `instance/opportunities.db` and restart
2. **Port Conflicts**: Change `PORT` in `.env`
3. **File Uploads**: Ensure `uploads/` directory exists
4. **CORS Issues**: Check `FRONTEND_URL` in `.env`

## 📞 Support

This is a drop-in replacement. If something doesn't work exactly like Flask, it's a bug! 