from . import db
from flask_login import UserMixin
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), default='admin')  # admin, coordinator, viewer
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def is_admin(self):
        return self.role == 'admin'
    
    def is_coordinator(self):
        return self.role in ['admin', 'coordinator']

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
    status = db.Column(db.String(20), default='pending')  # pending, approved, rejected
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
    
    def to_dict(self):
        """Convert submission to dictionary for API responses"""
        return {
            'id': self.id,
            'source': self.source,
            'title': self.title,
            'description': self.description,
            'company': self.company,
            'location': self.location,
            'type': self.type,
            'application_deadline': self.application_deadline,
            'gpa_requirement': self.gpa_requirement,
            'skills': self.skills,
            'grade_levels': self.grade_levels,
            'compensation': self.compensation,
            'file_attachment': self.file_attachment,
            'status': self.status,
            'feedback': self.feedback,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'priority': self.priority,
            'badge': self.badge,
            'submitter_role': self.submitter_role,
            'submitter_name': self.submitter_name,
            'submitter_email': self.submitter_email,
            'submitter_phone': self.submitter_phone,
            'company_website': self.company_website,
            'company_size': self.company_size,
            'industry': self.industry,
            'company_location': self.company_location,
            'application_link': self.application_link,
            'application_method': self.application_method,
            'application_instructions': self.application_instructions,
            'reviewed_by': self.reviewed_by,
            'reviewed_at': self.reviewed_at.isoformat() if self.reviewed_at else None,
            'admin_notes': self.admin_notes
        } 