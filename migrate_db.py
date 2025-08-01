#!/usr/bin/env python3
"""
Database Migration Script
This script helps migrate data from SQLite to PostgreSQL or reset the database.
"""

import os
import sys
from datetime import datetime

# Add the app directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'app'))

from app import create_app, db
from app.models import User, OpportunitySubmission

def migrate_database():
    """Migrate database or reset it"""
    app = create_app()
    
    with app.app_context():
        print("🔄 Database Migration Tool")
        print("=" * 50)
        
        # Check current database
        database_url = app.config['SQLALCHEMY_DATABASE_URI']
        print(f"📊 Current Database: {database_url}")
        
        if 'sqlite' in database_url:
            print("💡 You're using SQLite (local development)")
        elif 'postgresql' in database_url:
            print("💡 You're using PostgreSQL (production)")
        else:
            print("⚠️  Unknown database type")
        
        # Show current data
        try:
            user_count = User.query.count()
            submission_count = OpportunitySubmission.query.count()
            print(f"\n📈 Current Data:")
            print(f"   Users: {user_count}")
            print(f"   Submissions: {submission_count}")
        except Exception as e:
            print(f"❌ Error reading database: {e}")
            return
        
        # Ask user what they want to do
        print("\n🔧 Available Actions:")
        print("1. Reset database (delete all data and recreate)")
        print("2. Create admin user only")
        print("3. Show database info")
        print("4. Exit")
        
        choice = input("\nEnter your choice (1-4): ").strip()
        
        if choice == '1':
            print("\n⚠️  WARNING: This will delete ALL existing data!")
            confirm = input("Are you sure? Type 'YES' to confirm: ").strip()
            
            if confirm == 'YES':
                print("🗑️  Dropping all tables...")
                db.drop_all()
                
                print("📋 Creating new tables...")
                db.create_all()
                
                print("👤 Creating admin user...")
                admin_user = User(
                    username='admin',
                    email='admin@ultraportal.com',
                    role='admin'
                )
                admin_user.set_password('UltraAdmin2025!')
                db.session.add(admin_user)
                db.session.commit()
                
                print("✅ Database reset complete!")
                print("   Admin credentials: admin / UltraAdmin2025!")
                
        elif choice == '2':
            print("\n👤 Creating admin user...")
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
                print("✅ Admin user created: admin / UltraAdmin2025!")
            else:
                print("ℹ️  Admin user already exists")
                
        elif choice == '3':
            print("\n📊 Database Information:")
            print(f"   Database URL: {database_url}")
            print(f"   Users: {User.query.count()}")
            print(f"   Submissions: {OpportunitySubmission.query.count()}")
            
            # Show recent submissions
            recent_submissions = OpportunitySubmission.query.order_by(
                OpportunitySubmission.created_at.desc()
            ).limit(5).all()
            
            if recent_submissions:
                print(f"\n📝 Recent Submissions:")
                for sub in recent_submissions:
                    print(f"   - {sub.title} ({sub.status}) - {sub.created_at.strftime('%Y-%m-%d')}")
                    
        elif choice == '4':
            print("👋 Goodbye!")
            
        else:
            print("❌ Invalid choice")

if __name__ == '__main__':
    try:
        migrate_database()
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1) 