@echo off
echo ========================================
echo Committing and Pushing to GitHub
echo ========================================

echo.
echo 1. Initializing git repository...
git init

echo.
echo 2. Adding all files...
git add .

echo.
echo 3. Creating initial commit...
git commit -m "Initial commit: Ultra Portal - Complete opportunity management system

Features implemented:
- Flask backend with MongoDB integration
- React frontend with dynamic data fetching
- Admin panel for submission moderation
- Image upload with validation requirements
- Real-time refresh functionality
- Opportunity and funding submission forms
- Dynamic opportunity display with 'NO IMAGE PROVIDED' fallback
- Complete CRUD operations for submissions

Technical improvements:
- Added required image uploads with dimension validation
- Implemented automatic and manual refresh functionality
- Fixed data synchronization between backend and frontend
- Enhanced user experience with loading states and error handling"

echo.
echo 4. Adding remote repository...
git remote add origin https://github.com/ItzXizZ/ultra2.git

echo.
echo 5. Pushing to GitHub...
git branch -M main
git push -u origin main

echo.
echo ========================================
echo Push completed successfully!
echo ========================================
echo.
echo Repository: https://github.com/ItzXizZ/ultra2
echo.
pause 