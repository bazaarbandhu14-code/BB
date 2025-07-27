@echo off
echo 🚀 Starting BazaarBandhu Development Environment...
echo.

echo 📦 Installing server dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install server dependencies
    pause
    exit /b 1
)

echo.
echo 🔧 Starting Backend Server...
start "Backend Server" cmd /k "npm run dev"

echo.
echo ⏳ Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo.
echo 🌐 Starting Frontend Server...
cd ..
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ✅ Development servers are starting...
echo 📡 Backend: http://localhost:5000
echo 🖥️  Frontend: http://localhost:3000
echo.
echo 🔍 Testing backend connection...
timeout /t 3 /nobreak > nul
curl -s http://localhost:5000/health > nul
if %errorlevel% equ 0 (
    echo ✅ Backend is running!
) else (
    echo ⚠️  Backend might still be starting...
)

echo.
echo 🎉 Setup complete! Check the opened terminal windows for server logs.
echo.
pause 