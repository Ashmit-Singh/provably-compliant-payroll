@echo off
echo Setting up Provably Compliant Payroll Frontend...
echo.

echo Step 1: Creating root package.json...
echo {
echo   "name": "provably-compliant-payroll",
echo   "version": "1.0.0",
echo   "description": "Provably Compliant Enterprise Payroll System",
echo   "scripts": {
echo     "dev": "concurrently \"npm run backend\" \"npm run frontend\"",
echo     "backend": "cd backend && mvn spring-boot:run",
echo     "frontend": "cd frontend && npm start",
echo     "build": "cd frontend && npm run build",
echo     "install-deps": "cd frontend && npm install"
echo   },
echo   "keywords": [
echo     "payroll",
echo     "blockchain",
echo     "compliance",
echo     "react",
echo     "spring-boot"
echo   ],
echo   "author": "Your Name",
echo   "license": "MIT"
echo } > package.json

echo Step 2: Installing frontend dependencies...
cd frontend
npm install

echo.
echo ✅ Frontend setup complete!
echo.
echo To start the frontend, run:
echo npm start
echo.
pause