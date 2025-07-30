from datetime import datetime, timedelta
from flask import request, jsonify
from functools import wraps
import threading
import time

class RateLimiter:
    def __init__(self):
        self.submissions = {}
        self.lock = threading.Lock()
        self.cleanup_thread = None
        self.start_cleanup_thread()
    
    def start_cleanup_thread(self):
        """Start background thread to clean up old entries"""
        def cleanup():
            while True:
                time.sleep(300)  # Clean up every 5 minutes
                self.cleanup_old_entries()
        
        self.cleanup_thread = threading.Thread(target=cleanup, daemon=True)
        self.cleanup_thread.start()
    
    def cleanup_old_entries(self):
        """Remove entries older than 1 hour"""
        cutoff_time = datetime.now() - timedelta(hours=1)
        with self.lock:
            for ip in list(self.submissions.keys()):
                self.submissions[ip] = [
                    submission for submission in self.submissions[ip]
                    if submission > cutoff_time
                ]
                if not self.submissions[ip]:
                    del self.submissions[ip]
    
    def is_rate_limited(self, ip, max_submissions=5, window_minutes=10):
        """
        Check if IP is rate limited
        
        Args:
            ip: IP address
            max_submissions: Maximum submissions allowed in window
            window_minutes: Time window in minutes
        
        Returns:
            tuple: (is_limited, remaining_submissions, reset_time)
        """
        now = datetime.now()
        window_start = now - timedelta(minutes=window_minutes)
        
        with self.lock:
            if ip not in self.submissions:
                self.submissions[ip] = []
            
            # Remove old submissions outside the window
            self.submissions[ip] = [
                submission for submission in self.submissions[ip]
                if submission > window_start
            ]
            
            submission_count = len(self.submissions[ip])
            is_limited = submission_count >= max_submissions
            remaining = max(0, max_submissions - submission_count)
            
            # Calculate reset time (when the oldest submission will expire)
            reset_time = None
            if self.submissions[ip]:
                oldest_submission = min(self.submissions[ip])
                reset_time = oldest_submission + timedelta(minutes=window_minutes)
            
            return is_limited, remaining, reset_time
    
    def record_submission(self, ip):
        """Record a submission for the given IP"""
        with self.lock:
            if ip not in self.submissions:
                self.submissions[ip] = []
            self.submissions[ip].append(datetime.now())
    
    def get_submission_stats(self, ip):
        """Get submission statistics for an IP"""
        now = datetime.now()
        window_10min = now - timedelta(minutes=10)
        window_1hour = now - timedelta(hours=1)
        window_24hour = now - timedelta(hours=24)
        
        with self.lock:
            if ip not in self.submissions:
                return {
                    'last_10min': 0,
                    'last_hour': 0,
                    'last_24hours': 0,
                    'total': 0
                }
            
            submissions = self.submissions[ip]
            
            return {
                'last_10min': len([s for s in submissions if s > window_10min]),
                'last_hour': len([s for s in submissions if s > window_1hour]),
                'last_24hours': len([s for s in submissions if s > window_24hour]),
                'total': len(submissions)
            }

# Global rate limiter instance
rate_limiter = RateLimiter()

def rate_limit(max_submissions=5, window_minutes=10):
    """
    Decorator to rate limit form submissions
    
    Args:
        max_submissions: Maximum submissions allowed in window
        window_minutes: Time window in minutes
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Get client IP
            ip = request.remote_addr
            
            # Check if rate limited
            is_limited, remaining, reset_time = rate_limiter.is_rate_limited(
                ip, max_submissions, window_minutes
            )
            
            if is_limited:
                reset_seconds = int((reset_time - datetime.now()).total_seconds()) if reset_time else 0
                return jsonify({
                    'success': False,
                    'error': 'Rate limit exceeded',
                    'message': f'Too many submissions. Please wait {reset_seconds} seconds before trying again.',
                    'remaining_submissions': remaining,
                    'reset_time': reset_time.isoformat() if reset_time else None
                }), 429
            
            # Record submission
            rate_limiter.record_submission(ip)
            
            # Call the original function
            return f(*args, **kwargs)
        
        return decorated_function
    return decorator

def get_client_stats():
    """Get submission statistics for the current client"""
    ip = request.remote_addr
    return rate_limiter.get_submission_stats(ip) 