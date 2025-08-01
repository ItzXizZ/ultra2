from flask import Flask, send_from_directory, request
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
    app = Flask(__name__, static_folder='../build', static_url_path='')
    
    # Configuration
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    
    # Database configuration - SQLite with fallback for local development
    database_url = os.environ.get('DATABASE_URL')
    if database_url:
        # Production: Use the provided database URL (persistent disk on Render)
        app.config['SQLALCHEMY_DATABASE_URI'] = database_url
        print("Using production database configuration")
    else:
        # Local development: Use local SQLite file
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///opportunities.db'
        print("Using local development database")
    
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    # Use persistent disk for uploads in production, local uploads in development
    if os.environ.get('RENDER'):
        # Production on Render - use persistent disk
        app.config['UPLOAD_FOLDER'] = '/opt/render/project/src/instance/uploads'
    else:
        # Development - use local uploads folder
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
    print(f"Upload folder configured: {app.config['UPLOAD_FOLDER']}")
    print(f"Upload folder exists: {os.path.exists(app.config['UPLOAD_FOLDER'])}")
    
    # Serve React build files - catch-all route for SPA
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        # Skip specific Flask routes
        if path.startswith('api/') or path.startswith('admin') or path.startswith('login') or path.startswith('submit') or path.startswith('moderate') or path.startswith('opportunities') or path.startswith('uploads') or path.startswith('static/'):
            from werkzeug.exceptions import NotFound
            raise NotFound()
        
        # Serve React build files
        build_path = os.path.join(app.root_path, '..', 'build')
        print(f"Build path: {build_path}")
        print(f"Path requested: {path}")
        print(f"Build path exists: {os.path.exists(build_path)}")
        
        # Serve React build files
        try:
            if path != "" and os.path.exists(os.path.join(build_path, path)):
                print(f"Serving file: {path}")
                return send_from_directory(build_path, path)
            else:
                print(f"Serving index.html")
                return send_from_directory(build_path, 'index.html')
        except Exception as e:
            print(f"Error serving React files: {e}")
            # Return a simple HTML response as fallback
            return '''
            <!DOCTYPE html>
            <html>
            <head>
                <title>Ultra Portal</title>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
            </head>
            <body>
                <h1>Ultra Portal</h1>
                <p>React app is loading...</p>
                <p>If you see this message, there might be an issue with the build files.</p>
            </body>
            </html>
            '''
    
    # Register blueprints AFTER React routes
    from .routes import bp
    from .api_routes import api_bp
    app.register_blueprint(bp)
    app.register_blueprint(api_bp)
    
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
        try:
            db.create_all()
            print("Database tables created/verified successfully")
            print("Using SQLite with persistent disk - data will survive restarts!")
            
            # Create admin user if it doesn't exist
            from .models import User
            admin_user = User.query.filter_by(username='admin').first()
            if not admin_user:
                admin_user = User(
                    username='admin',
                    email='admin@ultraportal.com',
                    role='admin'
                )
                admin_user.set_password('UltraAdmin2025!')
                db.session.add(admin_user)
                db.session.commit()
                print("Default admin user created: username='admin', password='UltraAdmin2025!'")
            else:
                print("Admin user already exists")
                
        except Exception as e:
            print(f"Database initialization error: {e}")
            # Continue without database if there's an error
            pass
    
    return app 