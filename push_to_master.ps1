Write-Host "========================================" -ForegroundColor Green
Write-Host "Pushing ESLint fix to master branch" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Write-Host ""
Write-Host "1. Adding all files..." -ForegroundColor Yellow
git add .

Write-Host ""
Write-Host "2. Creating commit for ESLint fix..." -ForegroundColor Yellow
git commit -m "Fix ESLint error: Remove unused scrollPosition variable"

Write-Host ""
Write-Host "3. Pushing to master branch..." -ForegroundColor Yellow
git push origin main:master

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Push to master completed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Read-Host "Press Enter to continue" 