from flask import Blueprint, request, jsonify, current_app
from flask_login import login_required, current_user, login_user, logout_user
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash
import os
import json
from datetime import datetime
from . import db
from .models import User, OpportunitySubmission
from .rate_limiter import rate_limit, get_client_stats

api_bp = Blueprint('api', __name__, url_prefix='/api')

# Helper function to save files
def save_file(file, folder='uploads'):
    if file and file.filename:
        filename = secure_filename(file.filename)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"{timestamp}_{filename}"
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        return filename
    return None

# Authentication endpoints
@api_bp.route('/login', methods=['POST'])
def api_login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password) and user.is_active:
        # Log the user in to Flask session
        login_user(user)
        user.last_login = datetime.utcnow()
        db.session.commit()
        return jsonify({
            'success': True,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role
            }
        })
    
    return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

@api_bp.route('/logout', methods=['POST'])
@login_required
def api_logout():
    logout_user()
    return jsonify({'success': True, 'message': 'Logged out successfully'})

# Submission endpoints
@api_bp.route('/submit/ultra', methods=['POST'])
@rate_limit(max_submissions=3, window_minutes=10)  # 3 submissions per 10 minutes
def submit_ultra():
    try:
        # Handle file upload
        file_attachment = None
        if 'file_attachment' in request.files:
            file_attachment = save_file(request.files['file_attachment'])
        
        # Create submission
        submission = OpportunitySubmission(
            source='ultra',
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
            priority=True,
            badge='Ultra Exclusive',
            submitter_role=request.form.get('submitter_role'),
            submitter_name=request.form.get('submitter_name'),
            submitter_email=request.form.get('submitter_email'),
            submitter_phone=request.form.get('submitter_phone'),
            company_website=request.form.get('company_website'),
            company_size=request.form.get('company_size'),
            industry=request.form.get('industry'),
            company_location=request.form.get('company_location'),
            application_link=request.form.get('application_link'),
            application_method=request.form.get('application_method'),
            application_instructions=request.form.get('application_instructions')
        )
        
        db.session.add(submission)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Ultra Exclusive opportunity submitted successfully!',
            'submission_id': submission.id
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@api_bp.route('/submit/general', methods=['POST'])
@rate_limit(max_submissions=5, window_minutes=10)  # 5 submissions per 10 minutes
def submit_general():
    try:
        # Handle file upload
        file_attachment = None
        if 'file_attachment' in request.files:
            file_attachment = save_file(request.files['file_attachment'])
        
        # Create submission
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
            badge='General',
            submitter_role=request.form.get('submitter_role'),
            submitter_name=request.form.get('submitter_name'),
            submitter_email=request.form.get('submitter_email'),
            submitter_phone=request.form.get('submitter_phone'),
            company_website=request.form.get('company_website'),
            company_size=request.form.get('company_size'),
            industry=request.form.get('industry'),
            company_location=request.form.get('company_location'),
            application_link=request.form.get('application_link'),
            application_method=request.form.get('application_method'),
            application_instructions=request.form.get('application_instructions')
        )
        
        db.session.add(submission)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'General opportunity submitted successfully!',
            'submission_id': submission.id
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@api_bp.route('/submit/funding', methods=['POST'])
@rate_limit(max_submissions=3, window_minutes=10)  # 3 submissions per 10 minutes
def submit_funding():
    try:
        # Handle file upload
        file_attachment = None
        if 'file_attachment' in request.files:
            file_attachment = save_file(request.files['file_attachment'])
        
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
            submitter_role=request.form.get('submitter_role'),
            submitter_name=request.form.get('submitter_name'),
            submitter_email=request.form.get('submitter_email'),
            submitter_phone=request.form.get('submitter_phone'),
            company_website=request.form.get('company_website'),
            company_size=request.form.get('company_size'),
            industry=request.form.get('industry'),
            company_location=request.form.get('company_location'),
            application_link=request.form.get('application_link'),
            application_method=request.form.get('application_method'),
            application_instructions=request.form.get('application_instructions')
        )
        
        db.session.add(submission)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Funding opportunity submitted successfully!',
            'submission_id': submission.id
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@api_bp.route('/submit/job', methods=['POST'])
@rate_limit(max_submissions=3, window_minutes=10)  # 3 submissions per 10 minutes
def submit_job():
    try:
        # Handle file upload
        file_attachment = None
        if 'file_attachment' in request.files:
            file_attachment = save_file(request.files['file_attachment'])
        
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
            submitter_role=request.form.get('submitter_role'),
            submitter_name=request.form.get('submitter_name'),
            submitter_email=request.form.get('submitter_email'),
            submitter_phone=request.form.get('submitter_phone'),
            company_website=request.form.get('company_website'),
            company_size=request.form.get('company_size'),
            industry=request.form.get('industry'),
            company_location=request.form.get('company_location'),
            application_link=request.form.get('application_link'),
            application_method=request.form.get('application_method'),
            application_instructions=request.form.get('application_instructions')
        )
        
        db.session.add(submission)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Job opportunity submitted successfully!',
            'submission_id': submission.id
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

# Admin panel endpoints
@api_bp.route('/admin/submissions', methods=['GET'])
@login_required
def get_submissions():
    if not current_user.is_coordinator():
        return jsonify({'success': False, 'message': 'Unauthorized'}), 403
    
    # Get query parameters
    status = request.args.get('status', 'all')
    source = request.args.get('source', 'all')
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 20))
    
    # Build query
    query = OpportunitySubmission.query
    
    if status != 'all':
        query = query.filter(OpportunitySubmission.status == status)
    
    if source != 'all':
        query = query.filter(OpportunitySubmission.source == source)
    
    # Order by creation date (newest first)
    query = query.order_by(OpportunitySubmission.created_at.desc())
    
    # Paginate
    pagination = query.paginate(
        page=page, per_page=per_page, error_out=False
    )
    
    submissions = [submission.to_dict() for submission in pagination.items]
    
    return jsonify({
        'success': True,
        'submissions': submissions,
        'pagination': {
            'page': page,
            'per_page': per_page,
            'total': pagination.total,
            'pages': pagination.pages,
            'has_next': pagination.has_next,
            'has_prev': pagination.has_prev
        }
    })

@api_bp.route('/admin/submissions/<int:submission_id>', methods=['GET'])
@login_required
def get_submission(submission_id):
    if not current_user.is_coordinator():
        return jsonify({'success': False, 'message': 'Unauthorized'}), 403
    
    submission = OpportunitySubmission.query.get_or_404(submission_id)
    return jsonify({
        'success': True,
        'submission': submission.to_dict()
    })

@api_bp.route('/admin/submissions/<int:submission_id>/review', methods=['POST'])
@login_required
def review_submission(submission_id):
    if not current_user.is_coordinator():
        return jsonify({'success': False, 'message': 'Unauthorized'}), 403
    
    data = request.get_json()
    status = data.get('status')  # 'approved' or 'rejected'
    feedback = data.get('feedback', '')
    admin_notes = data.get('admin_notes', '')
    
    if status not in ['approved', 'rejected']:
        return jsonify({'success': False, 'message': 'Invalid status'}), 400
    
    submission = OpportunitySubmission.query.get_or_404(submission_id)
    submission.status = status
    submission.feedback = feedback
    submission.admin_notes = admin_notes
    submission.reviewed_by = current_user.id
    submission.reviewed_at = datetime.utcnow()
    
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': f'Submission {status} successfully',
        'submission': submission.to_dict()
    })

@api_bp.route('/admin/submissions/<int:submission_id>', methods=['PUT'])
@login_required
def update_submission(submission_id):
    if not current_user.is_coordinator():
        return jsonify({'success': False, 'message': 'Unauthorized'}), 403
    
    data = request.get_json()
    submission = OpportunitySubmission.query.get_or_404(submission_id)
    
    # Update fields
    for field, value in data.items():
        if hasattr(submission, field) and field not in ['id', 'created_at', 'reviewed_by', 'reviewed_at']:
            # Handle datetime fields properly
            if field in ['updated_at'] and value:
                # Skip updating updated_at - let SQLAlchemy handle it automatically
                continue
            setattr(submission, field, value)
    
    # Let SQLAlchemy handle the updated_at field automatically
    submission.updated_at = datetime.utcnow()
    
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Submission updated successfully',
        'submission': submission.to_dict()
    })

@api_bp.route('/admin/submissions/<int:submission_id>', methods=['DELETE'])
@login_required
def delete_submission(submission_id):
    if not current_user.is_admin():
        return jsonify({'success': False, 'message': 'Unauthorized'}), 403
    
    submission = OpportunitySubmission.query.get_or_404(submission_id)
    
    # Delete associated file if exists
    if submission.file_attachment:
        try:
            file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], submission.file_attachment)
            if os.path.exists(file_path):
                os.remove(file_path)
        except Exception as e:
            print(f"Error deleting file: {e}")
    
    db.session.delete(submission)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Submission deleted successfully'
    })

# Public endpoints for approved submissions
@api_bp.route('/opportunities', methods=['GET'])
def get_public_opportunities():
    source = request.args.get('source', 'all')
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 20))
    
    query = OpportunitySubmission.query.filter(OpportunitySubmission.status == 'approved')
    
    if source != 'all':
        query = query.filter(OpportunitySubmission.source == source)
    
    query = query.order_by(OpportunitySubmission.priority.desc(), OpportunitySubmission.created_at.desc())
    
    pagination = query.paginate(
        page=page, per_page=per_page, error_out=False
    )
    
    opportunities = [submission.to_dict() for submission in pagination.items]
    
    return jsonify({
        'success': True,
        'opportunities': opportunities,
        'pagination': {
            'page': page,
            'per_page': per_page,
            'total': pagination.total,
            'pages': pagination.pages,
            'has_next': pagination.has_next,
            'has_prev': pagination.has_prev
        }
    })

@api_bp.route('/opportunities/<int:opportunity_id>', methods=['GET'])
def get_public_opportunity(opportunity_id):
    opportunity = OpportunitySubmission.query.filter_by(
        id=opportunity_id, status='approved'
    ).first_or_404()
    
    return jsonify({
        'success': True,
        'opportunity': opportunity.to_dict()
    })

# Statistics endpoints
@api_bp.route('/submission/stats', methods=['GET'])
def get_submission_stats():
    """Get submission statistics for the current client"""
    stats = get_client_stats()
    return jsonify({
        'success': True,
        'stats': stats
    })

@api_bp.route('/admin/stats', methods=['GET'])
@login_required
def get_admin_stats():
    if not current_user.is_coordinator():
        return jsonify({'success': False, 'message': 'Unauthorized'}), 403
    
    # Get counts by status
    pending_count = OpportunitySubmission.query.filter_by(status='pending').count()
    approved_count = OpportunitySubmission.query.filter_by(status='approved').count()
    rejected_count = OpportunitySubmission.query.filter_by(status='rejected').count()
    total_count = OpportunitySubmission.query.count()
    
    # Get counts by source
    ultra_count = OpportunitySubmission.query.filter_by(source='ultra').count()
    general_count = OpportunitySubmission.query.filter_by(source='general').count()
    funding_count = OpportunitySubmission.query.filter_by(source='funding').count()
    job_count = OpportunitySubmission.query.filter_by(source='job').count()
    
    # Get recent submissions (last 7 days)
    from datetime import timedelta
    week_ago = datetime.utcnow() - timedelta(days=7)
    recent_count = OpportunitySubmission.query.filter(
        OpportunitySubmission.created_at >= week_ago
    ).count()
    
    return jsonify({
        'success': True,
        'stats': {
            'total_submissions': total_count,
            'pending': pending_count,
            'approved': approved_count,
            'rejected': rejected_count,
            'by_source': {
                'ultra': ultra_count,
                'general': general_count,
                'funding': funding_count,
                'job': job_count
            },
            'recent_submissions': recent_count
        }
    }) 