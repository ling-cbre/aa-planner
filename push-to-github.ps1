# GitHub Push Script
# This script will push your AA Planner to GitHub

cd "C:\Users\lingx\Documents\Projects\Aurora's Project"

Write-Host "🚀 Pushing AA Planner to GitHub..." -ForegroundColor Green
Write-Host "When prompted, enter your GitHub credentials:" -ForegroundColor Cyan
Write-Host "  Username: ling-cbre" -ForegroundColor Yellow
Write-Host "  Password: (paste your personal access token)" -ForegroundColor Yellow
Write-Host ""

git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ SUCCESS! Your site will rebuild in 1-2 minutes." -ForegroundColor Green
    Write-Host "Visit: https://ling-cbre.github.io/aa-planner/" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "❌ Push failed. Please check your credentials and try again." -ForegroundColor Red
}
