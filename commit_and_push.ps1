Write-Host "========================================" -ForegroundColor Green
Write-Host "Committing and Pushing to GitHub" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Write-Host ""
Write-Host "1. Initializing git repository..." -ForegroundColor Yellow
git init

Write-Host ""
Write-Host "2. Adding all files..." -ForegroundColor Yellow
git add .

Write-Host ""
Write-Host "3. Creating initial commit..." -ForegroundColor Yellow
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

Write-Host ""
Write-Host "4. Adding remote repository..." -ForegroundColor Yellow
git remote add origin https://github.com/ItzXizZ/ultra2.git

Write-Host ""
Write-Host "5. Pushing to GitHub..." -ForegroundColor Yellow
git branch -M main
git push -u origin main

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Push completed successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Repository: https://github.com/ItzXizZ/ultra2" -ForegroundColor Cyan
Write-Host ""
Read-Host "Press Enter to continue" 