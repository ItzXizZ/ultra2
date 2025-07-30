from flask import Flask, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_cors import CORS
from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize extensions
db = SQLAlchemy()
login_manager = LoginManager()

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL') or 'sqlite:///opportunities.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['UPLOAD_FOLDER'] = os.path.join(app.root_path, 'uploads')
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
    
    # MongoDB Configuration
    app.config['MONGO_URI'] = os.environ.get('MONGO_URI') or 'mongodb://localhost:27017/ultra_portal'
    
    # Initialize extensions
    db.init_app(app)
    login_manager.init_app(app)
    # Initialize CORS
    CORS(app, origins=['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:3001', 'http://127.0.0.1:3001'], supports_credentials=True)
    
    # Configure login manager
    login_manager.login_view = 'main.login'
    login_manager.login_message = 'Please log in to access this page.'
    login_manager.login_message_category = 'info'
    
    # Ensure upload directory exists
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
    # Register blueprints
    from .routes import bp
    from .api_routes import api_bp
    app.register_blueprint(bp)
    app.register_blueprint(api_bp)
    
    # Serve React build files
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        if path != "" and os.path.exists(os.path.join(app.root_path, '..', 'build', path)):
            return send_from_directory(os.path.join(app.root_path, '..', 'build'), path)
        else:
            return send_from_directory(os.path.join(app.root_path, '..', 'build'), 'index.html')
    
    # Initialize MongoDB connection
    try:
        app.mongo_client = MongoClient(app.config['MONGO_URI'])
        app.mongo_db = app.mongo_client.get_default_database()
        print("MongoDB connected successfully")
    except Exception as e:
        print(f"MongoDB connection failed: {e}")
        app.mongo_client = None
        app.mongo_db = None
    
    # Initialize database tables
    with app.app_context():
        db.create_all()
        
        # Create admin user if it doesn't exist
        from .models import User
        admin_user = User.query.filter_by(username='admin').first()
        if not admin_user:
            admin_user = User(
                username='admin',
                email='admin@ultraportal.com',
                role='admin'
            )
            admin_user.set_password('UltraAdmin2024!')
            db.session.add(admin_user)
            db.session.commit()
            print("Default admin user created: username='admin', password='UltraAdmin2024!'")
    
    return app 