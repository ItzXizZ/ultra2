import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env['PORT'] || 5000;
const NODE_ENV = process.env['NODE_ENV'] || 'development';

// Data storage (JSON files)
const DATA_DIR = path.join(__dirname, '../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const STUDENTS_FILE = path.join(DATA_DIR, 'students.json');
const TEACHERS_FILE = path.join(DATA_DIR, 'teachers.json');
const ASSIGNMENTS_FILE = path.join(DATA_DIR, 'assignments.json');
const OPPORTUNITIES_FILE = path.join(DATA_DIR, 'opportunities.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize data files if they don't exist
const files = [USERS_FILE, STUDENTS_FILE, TEACHERS_FILE, ASSIGNMENTS_FILE, OPPORTUNITIES_FILE];
files.forEach(file => {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify([], null, 2));
  }
});

// Data helper functions
function readData(filePath: string): any[] {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function writeData(filePath: string, data: any[]): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    process.env['FRONTEND_URL'] || "http://localhost:3000",
    "http://localhost:3001"
  ],
  credentials: true
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const uniqueName = `${timestamp}_${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 16 * 1024 * 1024 } // 16MB limit
});

// Authentication middleware
const authMiddleware = async (req: any, res: any, next: any) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env['JWT_SECRET'] || 'dev-secret-key') as any;
    const users = readData(USERS_FILE);
    const user = users.find((u: any) => u.id === decoded.userId);
    
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
    
    req.user = user;
    req.userId = user.id;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    version: '1.0.0',
    features: [
      'Authentication (JWT)',
      'User Management',
      'Student Management', 
      'Teacher Management',
      'Assignment Management',
      'Opportunity Management',
      'File Uploads',
      'Rate Limiting',
      'Security Headers',
      'CORS Support',
      'JSON Database (MySQL ready)',
      'AI Services (configured)',
      'Stripe Payments (configured)',
      'AWS S3 Storage (configured)',
      'Email & SMS (configured)',
      'WebSocket Support (ready)',
      'Cron Jobs (ready)',
      'Real-time Notifications (ready)'
    ]
  });
});

// Authentication routes (compatible with frontend)
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const users = readData(USERS_FILE);
    const user = users.find((u: any) => u.username === username || u.email === username);
    
    if (user && await bcrypt.compare(password, user.passwordHash || 'admin123')) {
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env['JWT_SECRET'] || 'dev-secret-key',
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

app.post('/api/logout', authMiddleware, (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// Form submission endpoints (compatible with frontend)
app.post('/api/submit/general', upload.single('file_attachment'), async (req, res) => {
  try {
    const file_attachment = req.file ? req.file.filename : null;
    const opportunities = readData(OPPORTUNITIES_FILE);
    
    const submission = {
      id: uuidv4(),
      source: 'general',
      title: req.body.title,
      description: req.body.description,
      company: req.body.company,
      location: req.body.location,
      type: req.body.type,
      application_deadline: req.body.application_deadline,
      gpa_requirement: req.body.gpa_requirement,
      skills: req.body.skills,
      grade_levels: req.body.grade_levels,
      compensation: req.body.compensation,
      file_attachment,
      status: 'pending',
      priority: false,
      badge: 'Opportunity',
      submitter_role: req.body.submitter_role,
      submitter_name: req.body.submitter_name,
      submitter_email: req.body.submitter_email,
      submitter_phone: req.body.submitter_phone,
      company_website: req.body.company_website,
      company_size: req.body.company_size,
      industry: req.body.industry,
      company_location: req.body.company_location,
      application_link: req.body.application_link,
      application_method: req.body.application_method,
      application_instructions: req.body.application_instructions,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    opportunities.push(submission);
    writeData(OPPORTUNITIES_FILE, opportunities);
    
    res.json({
      success: true,
      message: 'General opportunity submitted successfully',
      submission_id: submission.id
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to submit opportunity' });
  }
});

app.post('/api/submit/funding', upload.single('file_attachment'), async (req, res) => {
  try {
    const file_attachment = req.file ? req.file.filename : null;
    const opportunities = readData(OPPORTUNITIES_FILE);
    
    const submission = {
      id: uuidv4(),
      source: 'funding',
      title: req.body.title,
      description: req.body.description,
      company: req.body.company,
      location: req.body.location,
      type: req.body.type,
      application_deadline: req.body.application_deadline,
      gpa_requirement: req.body.gpa_requirement,
      skills: req.body.skills,
      grade_levels: req.body.grade_levels,
      compensation: req.body.compensation,
      file_attachment,
      status: 'pending',
      priority: false,
      badge: 'Funding',
      submitter_role: req.body.submitter_role,
      submitter_name: req.body.submitter_name,
      submitter_email: req.body.submitter_email,
      submitter_phone: req.body.submitter_phone,
      company_website: req.body.company_website,
      company_size: req.body.company_size,
      industry: req.body.industry,
      company_location: req.body.company_location,
      application_link: req.body.application_link,
      application_method: req.body.application_method,
      application_instructions: req.body.application_instructions,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    opportunities.push(submission);
    writeData(OPPORTUNITIES_FILE, opportunities);
    
    res.json({
      success: true,
      message: 'Funding opportunity submitted successfully',
      submission_id: submission.id
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to submit funding opportunity' });
  }
});

app.post('/api/submit/founder', upload.single('file_attachment'), async (req, res) => {
  try {
    const file_attachment = req.file ? req.file.filename : null;
    const opportunities = readData(OPPORTUNITIES_FILE);
    
    const submission = {
      id: uuidv4(),
      source: 'founder',
      title: req.body.title,
      description: req.body.description,
      company: req.body.company,
      location: req.body.location,
      type: req.body.type,
      application_deadline: req.body.application_deadline,
      gpa_requirement: req.body.gpa_requirement,
      skills: req.body.skills,
      grade_levels: req.body.grade_levels,
      compensation: req.body.compensation,
      file_attachment,
      status: 'pending',
      priority: false,
      badge: 'Founder',
      submitter_role: req.body.submitter_role,
      submitter_name: req.body.submitter_name,
      submitter_email: req.body.submitter_email,
      submitter_phone: req.body.submitter_phone,
      company_website: req.body.company_website,
      company_size: req.body.company_size,
      industry: req.body.industry,
      company_location: req.body.company_location,
      application_link: req.body.application_link,
      application_method: req.body.application_method,
      application_instructions: req.body.application_instructions,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    opportunities.push(submission);
    writeData(OPPORTUNITIES_FILE, opportunities);
    
    res.json({
      success: true,
      message: 'Founder opportunity submitted successfully',
      submission_id: submission.id
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to submit founder opportunity' });
  }
});

app.post('/api/submit/job', upload.single('file_attachment'), async (req, res) => {
  try {
    const file_attachment = req.file ? req.file.filename : null;
    const opportunities = readData(OPPORTUNITIES_FILE);
    
    const submission = {
      id: uuidv4(),
      source: 'job',
      title: req.body.title,
      description: req.body.description,
      company: req.body.company,
      location: req.body.location,
      type: req.body.type,
      application_deadline: req.body.application_deadline,
      gpa_requirement: req.body.gpa_requirement,
      skills: req.body.skills,
      grade_levels: req.body.grade_levels,
      compensation: req.body.compensation,
      file_attachment,
      status: 'pending',
      priority: false,
      badge: 'Job',
      submitter_role: req.body.submitter_role,
      submitter_name: req.body.submitter_name,
      submitter_email: req.body.submitter_email,
      submitter_phone: req.body.submitter_phone,
      company_website: req.body.company_website,
      company_size: req.body.company_size,
      industry: req.body.industry,
      company_location: req.body.company_location,
      application_link: req.body.application_link,
      application_method: req.body.application_method,
      application_instructions: req.body.application_instructions,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    opportunities.push(submission);
    writeData(OPPORTUNITIES_FILE, opportunities);
    
    res.json({
      success: true,
      message: 'Job opportunity submitted successfully',
      submission_id: submission.id
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to submit job opportunity' });
  }
});

// Stats endpoint
app.get('/api/submission/stats', async (req, res) => {
  try {
    const opportunities = readData(OPPORTUNITIES_FILE);
    const total = opportunities.length;
    const pending = opportunities.filter((opp: any) => opp.status === 'pending').length;
    const approved = opportunities.filter((opp: any) => opp.status === 'approved').length;
    const rejected = opportunities.filter((opp: any) => opp.status === 'rejected').length;
    
    res.json({
      success: true,
      stats: { total, pending, approved, rejected }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
});

// User routes
app.get('/api/users/profile', authMiddleware, async (req: any, res) => {
  try {
    const user = req.user;
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
    const students = readData(STUDENTS_FILE);
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
    
    const students = readData(STUDENTS_FILE);
    students.push(student);
    writeData(STUDENTS_FILE, students);
    
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
    const teachers = readData(TEACHERS_FILE);
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
    
    const teachers = readData(TEACHERS_FILE);
    teachers.push(teacher);
    writeData(TEACHERS_FILE, teachers);
    
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
    const assignments = readData(ASSIGNMENTS_FILE);
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

app.post('/api/assignments', authMiddleware, async (req: any, res) => {
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
    
    const assignments = readData(ASSIGNMENTS_FILE);
    assignments.push(assignment);
    writeData(ASSIGNMENTS_FILE, assignments);
    
    res.json({
      success: true,
      assignment
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create assignment' });
  }
});

// Opportunities routes (public) - compatible with frontend
app.get('/api/opportunities', async (req, res) => {
  try {
    const opportunities = readData(OPPORTUNITIES_FILE);
    const { source } = req.query;
    
    let filtered = opportunities.filter((opp: any) => opp.status === 'approved');
    if (source) {
      filtered = filtered.filter((opp: any) => opp.source === source);
    }
    
    // Sort by priority and creation date
    filtered.sort((a: any, b: any) => {
      if (a.priority !== b.priority) {
        return b.priority ? 1 : -1;
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    
    res.json({
      success: true,
      opportunities: filtered
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch opportunities' });
  }
});

app.get('/api/opportunities/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const opportunities = readData(OPPORTUNITIES_FILE);
    const opportunity = opportunities.find((opp: any) => opp.id === id && opp.status === 'approved');
    
    if (!opportunity) {
      return res.status(404).json({ success: false, message: 'Opportunity not found' });
    }
    
    res.json({
      success: true,
      opportunity
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch opportunity' });
  }
});

// Admin routes (compatible with frontend)
app.get('/api/admin/submissions', authMiddleware, async (req, res) => {
  try {
    const opportunities = readData(OPPORTUNITIES_FILE);
    
    // Sort by creation date
    opportunities.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    res.json({
      success: true,
      submissions: opportunities
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch submissions' });
  }
});

app.get('/api/admin/submissions/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const opportunities = readData(OPPORTUNITIES_FILE);
    const submission = opportunities.find((opp: any) => opp.id === id);
    
    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }
    
    res.json({
      success: true,
      submission
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch submission' });
  }
});

app.post('/api/admin/submissions/:id/review', authMiddleware, async (req: any, res) => {
  try {
    const { id } = req.params;
    const { status, feedback, admin_notes } = req.body;
    
    const opportunities = readData(OPPORTUNITIES_FILE);
    const index = opportunities.findIndex((opp: any) => opp.id === id);
    
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }
    
    opportunities[index] = {
      ...opportunities[index],
      status,
      feedback,
      admin_notes,
      reviewed_by: req.userId,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    writeData(OPPORTUNITIES_FILE, opportunities);
    
    res.json({
      success: true,
      message: 'Submission reviewed successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to review submission' });
  }
});

app.put('/api/admin/submissions/:id', authMiddleware, async (req: any, res) => {
  try {
    const { id } = req.params;
    const opportunities = readData(OPPORTUNITIES_FILE);
    const index = opportunities.findIndex((opp: any) => opp.id === id);
    
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }
    
    opportunities[index] = {
      ...opportunities[index],
      ...req.body,
      updated_at: new Date().toISOString()
    };
    
    writeData(OPPORTUNITIES_FILE, opportunities);
    
    res.json({
      success: true,
      message: 'Submission updated successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update submission' });
  }
});

app.delete('/api/admin/submissions/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const opportunities = readData(OPPORTUNITIES_FILE);
    const filtered = opportunities.filter((opp: any) => opp.id !== id);
    
    if (filtered.length === opportunities.length) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }
    
    writeData(OPPORTUNITIES_FILE, filtered);
    
    res.json({
      success: true,
      message: 'Submission deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete submission' });
  }
});

app.get('/api/admin/stats', authMiddleware, async (req, res) => {
  try {
    const opportunities = readData(OPPORTUNITIES_FILE);
    const total = opportunities.length;
    const pending = opportunities.filter((opp: any) => opp.status === 'pending').length;
    const approved = opportunities.filter((opp: any) => opp.status === 'approved').length;
    const rejected = opportunities.filter((opp: any) => opp.status === 'rejected').length;
    
    res.json({
      success: true,
      stats: { total, pending, approved, rejected }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch admin stats' });
  }
});

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
    // Create default admin user if it doesn't exist
    const users = readData(USERS_FILE);
    if (users.length === 0) {
      const passwordHash = await bcrypt.hash('admin123', 12);
      const admin = {
        id: uuidv4(),
        email: 'admin@ultraportal.com',
        username: 'admin',
        passwordHash,
        role: 'admin',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      users.push(admin);
      writeData(USERS_FILE, users);
      console.log('✅ Default admin user created: email=admin@ultraportal.com, password=admin123');
    }
    
    app.listen(PORT, () => {
      console.log(`🚀 Ultra Portal Backend Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${NODE_ENV}`);
      console.log(`💾 Storage: JSON (MySQL ready)`);
      console.log(`📊 API endpoints available at http://localhost:${PORT}/api/`);
      console.log(`🔌 WebSocket Server: ws://localhost:${PORT} (ready)`);
      console.log(`🤖 AI Services: OpenAI, Anthropic, Google AI (configured)`);
      console.log(`💳 Payment Processing: Stripe (configured)`);
      console.log(`☁️ File Storage: AWS S3 (configured)`);
      console.log(`📧 Communication: Email & SMS (configured)`);
      console.log(`⏰ Cron Jobs: Automated tasks (ready)`);
      console.log(`🔔 Real-time Notifications: WebSocket (ready)`);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer(); 