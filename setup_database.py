#!/usr/bin/env python3
"""
Ultra Portal Database Setup Script
This script initializes the database with the new schema and creates the default admin user.
"""

import os
import sys
from datetime import datetime

# Add the app directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'app'))

from app import create_app, db
from app.models import User, OpportunitySubmission

def setup_database():
    """Initialize the database and create default admin user"""
    app = create_app()
    
    with app.app_context():
        print("🚀 Setting up Ultra Portal Database...")
        
        # Drop all tables and recreate them to ensure clean schema
        print("📋 Dropping existing tables...")
        db.drop_all()
        
        print("📋 Creating database tables...")
        db.create_all()
        print("✅ Database tables created successfully!")
        
        # Create default admin user
        print("👤 Creating default admin user...")
        admin_user = User(
            username='admin',
            email='admin@ultraportal.com',
            role='admin'
        )
        admin_user.set_password('UltraAdmin2024!')
        
        db.session.add(admin_user)
        db.session.commit()
        
        print("✅ Default admin user created successfully!")
        print("   Username: admin")
        print("   Password: UltraAdmin2024!")
        print("   Email: admin@ultraportal.com")
        print("   ⚠️  Please change the password after first login!")
        
        # Create some sample data for testing
        print("📝 Creating sample data...")
        
        # Sample Ultra Exclusive submission
        ultra_submission = OpportunitySubmission(
            source='ultra',
            title='Software Engineering Internship at TechCorp',
            description='Join our innovative team for a summer internship in software engineering. Work on real projects and learn from industry experts.',
            company='TechCorp',
            location='San Francisco, CA',
            type='Internship',
            application_deadline='March 31, 2024',
            gpa_requirement='3.5+',
            skills='Python, JavaScript, React',
            grade_levels='11th-12th',
            compensation='$25/hour',
            status='pending',
            priority=True,
            badge='Ultra Exclusive',
            submitter_role='company_representative',
            submitter_name='John Smith',
            submitter_email='john.smith@techcorp.com',
            submitter_phone='(555) 123-4567',
            company_website='https://techcorp.com',
            company_size='large',
            industry='Technology',
            company_location='San Francisco, CA',
            application_link='https://techcorp.com/careers/internship',
            application_method='online_form',
            application_instructions='Submit resume, cover letter, and coding portfolio through our online portal.'
        )
        
        # Sample Funding submission
        funding_submission = OpportunitySubmission(
            source='funding',
            title='Innovation Grant for High School Entrepreneurs',
            description='$10,000 grant to support innovative business ideas from high school students. Mentorship and resources included.',
            company='Youth Innovation Foundation',
            location='Remote',
            type='Funding',
            application_deadline='April 15, 2024',
            compensation='$10,000',
            status='pending',
            priority=True,
            badge='Funding Opportunity',
            submitter_role='faculty',
            submitter_name='Dr. Sarah Johnson',
            submitter_email='sarah.johnson@yif.org',
            submitter_phone='(555) 987-6543',
            company_website='https://youthinnovation.org',
            company_size='nonprofit',
            industry='Education',
            company_location='New York, NY',
            application_link='https://youthinnovation.org/apply',
            application_method='online_form',
            application_instructions='Submit business plan, video pitch, and letters of recommendation.'
        )
        
        # Sample Job submission
        job_submission = OpportunitySubmission(
            source='job',
            title='Part-time Marketing Assistant',
            description='Support our marketing team with social media management, content creation, and campaign coordination.',
            company='Local Business Solutions',
            location='Remote',
            type='Job',
            application_deadline='Rolling',
            gpa_requirement='3.0+',
            skills='Social Media, Communication, Creativity',
            grade_levels='11th-12th',
            compensation='$15/hour',
            status='pending',
            priority=False,
            badge='Job Opportunity',
            submitter_role='hiring_manager',
            submitter_name='Mike Davis',
            submitter_email='mike.davis@lbs.com',
            submitter_phone='(555) 456-7890',
            company_website='https://localbusinesssolutions.com',
            company_size='small',
            industry='Marketing',
            company_location='Austin, TX',
            application_link='https://lbs.com/careers',
            application_method='email',
            application_instructions='Send resume and cover letter to careers@lbs.com with subject line "Marketing Assistant Application".'
        )
        
        # Add sample submissions to database
        db.session.add(ultra_submission)
        db.session.add(funding_submission)
        db.session.add(job_submission)
        db.session.commit()
        
        print("✅ Sample data created successfully!")
        print(f"   Created {OpportunitySubmission.query.count()} sample submissions")
        
        # Print database statistics
        print("\n📊 Database Statistics:")
        print(f"   Total Users: {User.query.count()}")
        print(f"   Total Submissions: {OpportunitySubmission.query.count()}")
        print(f"   Pending Submissions: {OpportunitySubmission.query.filter_by(status='pending').count()}")
        print(f"   Approved Submissions: {OpportunitySubmission.query.filter_by(status='approved').count()}")
        print(f"   Rejected Submissions: {OpportunitySubmission.query.filter_by(status='rejected').count()}")
        
        print("\n🎉 Database setup completed successfully!")
        print("\n📝 Next Steps:")
        print("   1. Start the Flask backend: python run.py")
        print("   2. Start the React frontend: npm start")
        print("   3. Access the admin panel at: http://localhost:3000")
        print("   4. Login with: admin / UltraAdmin2024!")
        print("   5. Change the default password immediately!")

if __name__ == '__main__':
    try:
        setup_database()
    except Exception as e:
        print(f"❌ Error setting up database: {e}")
        sys.exit(1) 