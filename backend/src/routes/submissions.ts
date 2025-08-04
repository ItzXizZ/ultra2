import { Router, Request, Response } from 'express';
import { OpportunitySubmission } from '@/models/OpportunitySubmission';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Configure multer for file uploads (matches Flask file handling)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const uniqueName = `${timestamp}_${uuidv4()}_${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 16 * 1024 * 1024 // 16MB limit (matches Flask)
  }
});

// Helper function to save file (matches Flask save_file function)
const saveFile = (file: Express.Multer.File | undefined): string | null => {
  if (file) {
    return file.filename;
  }
  return null;
};

// POST /api/submit/general - Submit general opportunity (exactly matches Flask endpoint)
router.post('/general', upload.single('file_attachment'), async (req: Request, res: Response) => {
  try {
    const file_attachment = saveFile(req.file);
    
    const submission = await OpportunitySubmission.create({
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
      application_instructions: req.body.application_instructions
    });
    
    res.json({
      success: true,
      message: 'General opportunity submitted successfully',
      submission_id: submission.id
    });
    
  } catch (error) {
    console.error('Error submitting general opportunity:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit opportunity'
    });
  }
});

// POST /api/submit/funding - Submit funding opportunity (exactly matches Flask endpoint)
router.post('/funding', upload.single('file_attachment'), async (req: Request, res: Response) => {
  try {
    const file_attachment = saveFile(req.file);
    
    const submission = await OpportunitySubmission.create({
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
      application_instructions: req.body.application_instructions
    });
    
    res.json({
      success: true,
      message: 'Funding opportunity submitted successfully',
      submission_id: submission.id
    });
    
  } catch (error) {
    console.error('Error submitting funding opportunity:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit funding opportunity'
    });
  }
});

// POST /api/submit/founder - Submit founder opportunity (exactly matches Flask endpoint)
router.post('/founder', upload.single('file_attachment'), async (req: Request, res: Response) => {
  try {
    const file_attachment = saveFile(req.file);
    
    const submission = await OpportunitySubmission.create({
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
      application_instructions: req.body.application_instructions
    });
    
    res.json({
      success: true,
      message: 'Founder opportunity submitted successfully',
      submission_id: submission.id
    });
    
  } catch (error) {
    console.error('Error submitting founder opportunity:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit founder opportunity'
    });
  }
});

// POST /api/submit/job - Submit job opportunity (exactly matches Flask endpoint)
router.post('/job', upload.single('file_attachment'), async (req: Request, res: Response) => {
  try {
    const file_attachment = saveFile(req.file);
    
    const submission = await OpportunitySubmission.create({
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
      application_instructions: req.body.application_instructions
    });
    
    res.json({
      success: true,
      message: 'Job opportunity submitted successfully',
      submission_id: submission.id
    });
    
  } catch (error) {
    console.error('Error submitting job opportunity:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit job opportunity'
    });
  }
});

export default router; 