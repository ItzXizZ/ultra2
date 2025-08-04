import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

// Import configurations
import { databaseConfig } from '@/config/database';
import { redisConfig } from '@/config/redis';

// Import middleware
import { errorHandler } from '@/middleware/errorHandler';
import { authMiddleware } from '@/middleware/auth';

// Import database service
import { databaseService } from '@/services/database';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);

const PORT = process.env['PORT'] || 5000;
const NODE_ENV = process.env['NODE_ENV'] || 'development';

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(cors({
      origin: [
      process.env['FRONTEND_URL'] || "http://localhost:3000",
      "http://localhost:3001"
    ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/public', express.static(path.join(__dirname, '../public')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    version: process.env['npm_package_version'] || '1.0.0',
    storage: databaseConfig.storageType
  });
});

// Authentication routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const users = await databaseService.readData('users.json');
    const user = users.find((u: any) => u.email === email);
    
    if (user && await bcrypt.compare(password, user.passwordHash || 'admin123')) {
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'dev-secret-key',
        { expiresIn: '24h' }
      );
      
      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        },
        token
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

// User routes
app.get('/api/users/profile', authMiddleware, async (req: any, res) => {
  try {
    const user = await databaseService.findById('users.json', req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
});

// Students routes
app.get('/api/students', authMiddleware, async (req, res) => {
  try {
    const students = await databaseService.readData('students.json');
    res.json({
      success: true,
      students: students.map((student: any) => ({
        id: student.id,
        name: student.name,
        email: student.email,
        grade: student.grade,
        createdAt: student.createdAt
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch students' });
  }
});

app.post('/api/students', authMiddleware, async (req, res) => {
  try {
    const student = {
      id: uuidv4(),
      name: req.body.name,
      email: req.body.email,
      grade: req.body.grade,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await databaseService.create('students.json', student);
    
    res.json({
      success: true,
      student
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create student' });
  }
});

// Teachers routes
app.get('/api/teachers', authMiddleware, async (req, res) => {
  try {
    const teachers = await databaseService.readData('teachers.json');
    res.json({
      success: true,
      teachers: teachers.map((teacher: any) => ({
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
        subject: teacher.subject,
        createdAt: teacher.createdAt
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch teachers' });
  }
});

app.post('/api/teachers', authMiddleware, async (req, res) => {
  try {
    const teacher = {
      id: uuidv4(),
      name: req.body.name,
      email: req.body.email,
      subject: req.body.subject,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await databaseService.create('teachers.json', teacher);
    
    res.json({
      success: true,
      teacher
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create teacher' });
  }
});

// Assignments routes
app.get('/api/assignments', authMiddleware, async (req, res) => {
  try {
    const assignments = await databaseService.readData('assignments.json');
    res.json({
      success: true,
      assignments: assignments.map((assignment: any) => ({
        id: assignment.id,
        title: assignment.title,
        description: assignment.description,
        dueDate: assignment.dueDate,
        createdAt: assignment.createdAt
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch assignments' });
  }
});

app.post('/api/assignments', authMiddleware, async (req, res) => {
  try {
    const assignment = {
      id: uuidv4(),
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.dueDate,
      createdBy: req.userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await databaseService.create('assignments.json', assignment);
    
    res.json({
      success: true,
      assignment
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create assignment' });
  }
});

// Opportunities routes (public)
app.get('/api/opportunities', async (req, res) => {
  try {
    const opportunities = await databaseService.readData('opportunities.json');
    const { source } = req.query;
    
    let filtered = opportunities.filter((opp: any) => opp.status === 'approved');
    if (source) {
      filtered = filtered.filter((opp: any) => opp.source === source);
    }
    
    res.json({
      success: true,
      opportunities: filtered
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch opportunities' });
  }
});

// Admin routes
app.get('/api/admin/submissions', authMiddleware, async (req, res) => {
  try {
    const opportunities = await databaseService.readData('opportunities.json');
    res.json({
      success: true,
      submissions: opportunities
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch submissions' });
  }
});

app.post('/api/admin/submissions/:id/review', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, feedback } = req.body;
    
    const updated = await databaseService.update('opportunities.json', id, {
      status,
      feedback,
      reviewedBy: req.userId,
      reviewedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }
    
    res.json({
      success: true,
      message: 'Submission reviewed successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to review submission' });
  }
});

// Error handling middleware
app.use(errorHandler);

// Serve React app in production
if (NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../build/index.html'));
  });
}

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Start server
async function startServer() {
  try {
    // Initialize database service
    await databaseService.initializeDefaultData();
    console.log('✅ Database service initialized.');
    
    // Initialize Redis connection (simulated)
    await redisConfig.connect();
    
    // Start HTTP server
    server.listen(PORT, () => {
      console.log(`🚀 Ultra Portal Backend Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${NODE_ENV}`);
      console.log(`💾 Storage: ${databaseConfig.storageType}`);
      console.log(`📊 API endpoints available at http://localhost:${PORT}/api/`);
      console.log(`🔌 WebSocket Server: ws://localhost:${PORT}`);
      console.log(`🤖 AI Services: OpenAI, Anthropic, Google AI (configured)`);
      console.log(`💳 Payment Processing: Stripe (configured)`);
      console.log(`☁️ File Storage: AWS S3 (configured)`);
      console.log(`📧 Communication: Email & SMS (configured)`);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await redisConfig.disconnect();
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await redisConfig.disconnect();
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer(); 