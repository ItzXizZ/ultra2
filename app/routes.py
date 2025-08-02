from flask import Blueprint, render_template, request, flash, redirect, url_for, send_from_directory, current_app
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename
import os
from datetime import datetime
from . import db, login_manager
from .models import User, OpportunitySubmission
from .cloud_storage import cloud_storage

bp = Blueprint('main', __name__)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@login_manager.unauthorized_handler
def unauthorized():
    flash('Please log in to access this page.')
    return redirect(url_for('main.login'))

# --- Home Page --- (Commented out to let React handle the root route)
# @bp.route('/')
# def home():
#     # Get approved opportunities for students (jobs, internships, general)
#     student_opportunities = OpportunitySubmission.query.filter(
#         OpportunitySubmission.status == 'approved',
#         OpportunitySubmission.source.in_(['job', 'general', 'ultra'])
#     ).order_by(OpportunitySubmission.priority.desc(), OpportunitySubmission.created_at.desc()).limit(6).all()
#     
#     # Get approved funding opportunities for investors
#     funding_opportunities = OpportunitySubmission.query.filter(
#         OpportunitySubmission.status == 'approved',
#         OpportunitySubmission.source == 'funding'
#     ).order_by(OpportunitySubmission.priority.desc(), OpportunitySubmission.created_at.desc()).limit(6).all()
#     
#     # Get statistics
#     total_opportunities = OpportunitySubmission.query.filter_by(status='approved').count()
#     total_students = OpportunitySubmission.query.filter(
#         OpportunitySubmission.status == 'approved',
#         OpportunitySubmission.source.in_(['job', 'general', 'ultra'])
#     ).count()
#     total_funding = OpportunitySubmission.query.filter(
#         OpportunitySubmission.status == 'approved',
#         OpportunitySubmission.source == 'funding'
#     ).count()
#     
#     return render_template('home.html', 
#                          student_opportunities=student_opportunities,
#                          funding_opportunities=funding_opportunities,
#                          total_opportunities=total_opportunities,
#                          total_students=total_students,
#                          total_funding=total_funding)

# --- Auth ---
@bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = User.query.filter_by(username=username).first()
        
        if user and user.check_password(password) and user.is_active:
            login_user(user)
            user.last_login = datetime.utcnow()
            db.session.commit()
            next_page = request.args.get('next')
            return redirect(next_page or url_for('main.admin_dashboard'))
        else:
            flash('Invalid username or password')
    
    return render_template('login.html')

@bp.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('main.home'))

# --- Admin Dashboard ---
@bp.route('/admin')
@login_required
def admin_dashboard():
    if not current_user.is_coordinator():
        flash('Access denied. Admin privileges required.')
        return redirect(url_for('main.home'))
    
    # Get basic stats
    pending_count = OpportunitySubmission.query.filter_by(status='pending').count()
    approved_count = OpportunitySubmission.query.filter_by(status='approved').count()
    rejected_count = OpportunitySubmission.query.filter_by(status='rejected').count()
    total_count = OpportunitySubmission.query.count()
    
    # Get recent submissions
    recent_submissions = OpportunitySubmission.query.order_by(
        OpportunitySubmission.created_at.desc()
    ).limit(5).all()
    
    return render_template('admin_dashboard.html', 
                         pending_count=pending_count,
                         approved_count=approved_count,
                         rejected_count=rejected_count,
                         total_count=total_count,
                         recent_submissions=recent_submissions)



# --- General Submission ---
@bp.route('/submit/general', methods=['GET', 'POST'])
def submit_general():
    if request.method == 'POST':
        # Handle file upload
        file_attachment = None
        if 'file_attachment' in request.files:
            file = request.files['file_attachment']
            if file and file.filename:
                # Upload to cloud storage
                cloud_url = cloud_storage.upload_image(file)
                if cloud_url:
                    file_attachment = cloud_url
                else:
                    # Fallback to local storage if cloud upload fails
                    filename = secure_filename(file.filename)
                    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                    filename = f"{timestamp}_{filename}"
                    file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))
                    file_attachment = filename
        
        # Create submission with all optional fields
        submission = OpportunitySubmission(
            source='general',
            title=request.form['title'],
            description=request.form['description'],
            company=request.form['company'],
            location=request.form.get('location'),
            type=request.form.get('type'),
            application_deadline=request.form.get('application_deadline'),
            gpa_requirement=request.form.get('gpa_requirement'),
            skills=request.form.get('skills'),
            grade_levels=request.form.get('grade_levels'),
            compensation=request.form.get('compensation'),
            file_attachment=file_attachment,
            priority=False,
            badge='Opportunity',
            
            # Submitter information fields
            submitter_role=request.form.get('submitter_role'),
            submitter_name=request.form.get('submitter_name'),
            submitter_email=request.form.get('submitter_email'),
            submitter_phone=request.form.get('submitter_phone'),
            
            # Company information fields
            company_website=request.form.get('company_website'),
            company_size=request.form.get('company_size'),
            industry=request.form.get('industry'),
            company_location=request.form.get('company_location'),
            
            # Application information fields
            application_link=request.form.get('application_link'),
            application_method=request.form.get('application_method'),
            application_instructions=request.form.get('application_instructions')
        )
        
        db.session.add(submission)
        db.session.commit()
        flash('Opportunity submitted successfully! Our team will review it and make it available to students within 24-48 hours.')
        return redirect(url_for('main.submit_general'))
    
    return render_template('submit_general.html')

# --- Funding Submission ---
@bp.route('/submit/funding', methods=['GET', 'POST'])
def submit_funding():
    if request.method == 'POST':
        # Handle file upload
        file_attachment = None
        if 'file_attachment' in request.files:
            file = request.files['file_attachment']
            if file and file.filename:
                # Upload to cloud storage
                cloud_url = cloud_storage.upload_image(file)
                if cloud_url:
                    file_attachment = cloud_url
                else:
                    # Fallback to local storage if cloud upload fails
                    filename = secure_filename(file.filename)
                    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                    filename = f"{timestamp}_{filename}"
                    file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))
                    file_attachment = filename
        
        # Create submission
        submission = OpportunitySubmission(
            source='funding',
            title=request.form['title'],
            description=request.form['description'],
            company=request.form['company'],
            location=request.form.get('location'),
            type='Funding',
            application_deadline=request.form.get('application_deadline'),
            compensation=request.form.get('funding_amount'),
            file_attachment=file_attachment,
            priority=True,
            badge='Funding Opportunity',
            
            # Submitter information fields
            submitter_role=request.form.get('submitter_role'),
            submitter_name=request.form.get('submitter_name'),
            submitter_email=request.form.get('submitter_email'),
            submitter_phone=request.form.get('submitter_phone'),
            
            # Company information fields
            company_website=request.form.get('company_website'),
            company_size=request.form.get('company_size'),
            industry=request.form.get('industry'),
            company_location=request.form.get('company_location'),
            
            # Application information fields
            application_link=request.form.get('application_link'),
            application_method=request.form.get('application_method'),
            application_instructions=request.form.get('application_instructions')
        )
        
        db.session.add(submission)
        db.session.commit()
        flash('Funding opportunity submitted successfully!')
        return redirect(url_for('main.submit_funding'))
    
    return render_template('submit_funding.html')

# --- Job Submission ---
@bp.route('/submit/job', methods=['GET', 'POST'])
def submit_job():
    if request.method == 'POST':
        # Handle file upload
        file_attachment = None
        if 'file_attachment' in request.files:
            file = request.files['file_attachment']
            if file and file.filename:
                # Upload to cloud storage
                cloud_url = cloud_storage.upload_image(file)
                if cloud_url:
                    file_attachment = cloud_url
                else:
                    # Fallback to local storage if cloud upload fails
                    filename = secure_filename(file.filename)
                    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                    filename = f"{timestamp}_{filename}"
                    file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))
                    file_attachment = filename
        
        # Create submission
        submission = OpportunitySubmission(
            source='job',
            title=request.form['title'],
            description=request.form['description'],
            company=request.form['company'],
            location=request.form.get('location'),
            type='Job',
            application_deadline=request.form.get('application_deadline'),
            gpa_requirement=request.form.get('gpa_requirement'),
            skills=request.form.get('skills'),
            grade_levels=request.form.get('grade_levels'),
            compensation=request.form.get('compensation'),
            file_attachment=file_attachment,
            priority=False,
            badge='Job Opportunity',
            
            # Submitter information fields
            submitter_role=request.form.get('submitter_role'),
            submitter_name=request.form.get('submitter_name'),
            submitter_email=request.form.get('submitter_email'),
            submitter_phone=request.form.get('submitter_phone'),
            
            # Company information fields
            company_website=request.form.get('company_website'),
            company_size=request.form.get('company_size'),
            industry=request.form.get('industry'),
            company_location=request.form.get('company_location'),
            
            # Application information fields
            application_link=request.form.get('application_link'),
            application_method=request.form.get('application_method'),
            application_instructions=request.form.get('application_instructions')
        )
        
        db.session.add(submission)
        db.session.commit()
        flash('Job opportunity submitted successfully!')
        return redirect(url_for('main.submit_job'))
    
    return render_template('submit_job.html')

# --- Moderation ---
@bp.route('/moderate', methods=['GET', 'POST'])
@login_required
def moderate():
    if not current_user.is_coordinator():
        flash('Access denied. Coordinator privileges required.')
        return redirect(url_for('main.home'))
    
    if request.method == 'POST':
        submission_id = request.form.get('submission_id')
        action = request.form.get('action')  # 'approve' or 'reject'
        feedback = request.form.get('feedback', '')
        admin_notes = request.form.get('admin_notes', '')
        
        submission = OpportunitySubmission.query.get_or_404(submission_id)
        
        if action == 'approve':
            submission.status = 'approved'
            flash('Submission approved successfully!')
        elif action == 'reject':
            submission.status = 'rejected'
            flash('Submission rejected.')
        
        submission.feedback = feedback
        submission.admin_notes = admin_notes
        submission.reviewed_by = current_user.id
        submission.reviewed_at = datetime.utcnow()
        
        db.session.commit()
        return redirect(url_for('main.moderate'))
    
    # Get submissions with filters
    status_filter = request.args.get('status', 'pending')
    source_filter = request.args.get('source', 'all')
    
    query = OpportunitySubmission.query
    
    if status_filter != 'all':
        query = query.filter(OpportunitySubmission.status == status_filter)
    
    if source_filter != 'all':
        query = query.filter(OpportunitySubmission.source == source_filter)
    
    submissions = query.order_by(OpportunitySubmission.created_at.desc()).all()
    
    return render_template('moderate.html', 
                         submissions=submissions,
                         status_filter=status_filter,
                         source_filter=source_filter)

# --- File Downloads ---
@bp.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(current_app.config['UPLOAD_FOLDER'], filename)

# --- Public Opportunities ---
@bp.route('/opportunities')
def opportunities():
    source_filter = request.args.get('source', 'all')
    page = request.args.get('page', 1, type=int)
    per_page = 20
    
    query = OpportunitySubmission.query.filter(OpportunitySubmission.status == 'approved')
    
    if source_filter != 'all':
        query = query.filter(OpportunitySubmission.source == source_filter)
    
    query = query.order_by(OpportunitySubmission.priority.desc(), OpportunitySubmission.created_at.desc())
    
    pagination = query.paginate(
        page=page, per_page=per_page, error_out=False
    )
    
    return render_template('opportunities.html', 
                         opportunities=pagination.items,
                         pagination=pagination,
                         source_filter=source_filter)

# --- Setup Admin User ---
@bp.route('/setup-admin', methods=['GET', 'POST'])
def setup_admin():
    # Check if admin already exists
    admin_user = User.query.filter_by(username='admin').first()
    if admin_user:
        flash('Admin user already exists!')
        return redirect(url_for('main.login'))
    
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        confirm_password = request.form['confirm_password']
        
        if password != confirm_password:
            flash('Passwords do not match!')
            return render_template('setup_admin.html')
        
        # Create admin user
        admin_user = User(
            username=username,
            email=email,
            role='admin'
        )
        admin_user.set_password(password)
        
        db.session.add(admin_user)
        db.session.commit()
        
        flash('Admin user created successfully! You can now log in.')
        return redirect(url_for('main.login'))
    
    return render_template('setup_admin.html') 