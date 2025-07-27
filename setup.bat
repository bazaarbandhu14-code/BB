@echo off
echo ========================================
echo    BazaarBandhu Setup Script
echo ========================================
echo.

echo [1/6] Installing root dependencies...
npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install root dependencies
    pause
    exit /b 1
)

echo [2/6] Installing client dependencies...
cd client
npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install client dependencies
    pause
    exit /b 1
)

echo [3/6] Installing server dependencies...
cd ../server
npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install server dependencies
    pause
    exit /b 1
)

echo [4/6] Creating environment files...
cd ..

if not exist ".env" (
    echo Creating .env file...
    (
        echo # Database
        echo MONGODB_URI=mongodb://localhost:27017/bazaarbandhu
        echo.
        echo # JWT
        echo JWT_SECRET=bazaarbandhu_secret_key_2024
        echo.
        echo # Google Maps
        echo REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
        echo.
        echo # Razorpay
        echo RAZORPAY_KEY_ID=your-razorpay-key-id
        echo RAZORPAY_KEY_SECRET=your-razorpay-key-secret
        echo.
        echo # Twilio
        echo TWILIO_ACCOUNT_SID=your-twilio-account-sid
        echo TWILIO_AUTH_TOKEN=your-twilio-auth-token
        echo TWILIO_PHONE_NUMBER=your-twilio-phone-number
        echo.
        echo # Hugging Face
        echo HUGGINGFACE_API_KEY=your-huggingface-api-key
        echo.
        echo # Email
        echo EMAIL_USER=your-email@gmail.com
        echo EMAIL_PASS=your-email-app-password
        echo.
        echo # Server
        echo PORT=5000
        echo NODE_ENV=development
    ) > .env
    echo Created .env file
)

if not exist "server\.env" (
    echo Creating server .env file...
    (
        echo # Database
        echo MONGODB_URI=mongodb://localhost:27017/bazaarbandhu
        echo.
        echo # JWT
        echo JWT_SECRET=bazaarbandhu_secret_key_2024
        echo.
        echo # Razorpay
        echo RAZORPAY_KEY_ID=your-razorpay-key-id
        echo RAZORPAY_KEY_SECRET=your-razorpay-key-secret
        echo.
        echo # Twilio
        echo TWILIO_ACCOUNT_SID=your-twilio-account-sid
        echo TWILIO_AUTH_TOKEN=your-twilio-auth-token
        echo TWILIO_PHONE_NUMBER=your-twilio-phone-number
        echo.
        echo # Hugging Face
        echo HUGGINGFACE_API_KEY=your-huggingface-api-key
        echo.
        echo # Email
        echo EMAIL_USER=your-email@gmail.com
        echo EMAIL_PASS=your-email-app-password
        echo.
        echo # Server
        echo PORT=5000
        echo NODE_ENV=development
    ) > server\.env
    echo Created server .env file
)

echo [5/6] Checking MongoDB...
echo Please ensure MongoDB is running on your system
echo If MongoDB is not installed, please install it first
echo.

echo [6/6] Setup complete!
echo.
echo ========================================
echo    Next Steps:
echo ========================================
echo 1. Update .env files with your API keys
echo 2. Start MongoDB service
echo 3. Run: npm run seed (to populate database)
echo 4. Run: npm run dev (to start development servers)
echo.
echo ========================================
echo    API Keys Required:
echo ========================================
echo - Google Maps API Key
echo - Twilio Account SID and Auth Token
echo - Razorpay Key ID and Secret
echo - Hugging Face API Key
echo - Email credentials (for OTP)
echo.
echo ========================================
echo    Test Credentials:
echo ========================================
echo Supplier: rajesh@freshfarms.com / password123
echo Vendor: suresh@streetfood.com / password123
echo.
pause 