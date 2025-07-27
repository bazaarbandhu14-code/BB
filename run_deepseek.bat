@echo off
echo DeepSeek-R1 Model Runner
echo ========================
echo.

:menu
echo Choose an option:
echo 1. Install dependencies
echo 2. Run simple demo
echo 3. Run full demo
echo 4. Run advanced demo
echo 5. Start web application
echo 6. Exit
echo.

set /p choice=Enter your choice (1-6): 

if "%choice%"=="1" goto install
if "%choice%"=="2" goto simple
if "%choice%"=="3" goto full
if "%choice%"=="4" goto advanced
if "%choice%"=="5" goto webapp
if "%choice%"=="6" goto end

echo Invalid choice. Please try again.
echo.
goto menu

:install
echo.
echo Installing dependencies...
pip install -r requirements_deepseek.txt
echo.
echo Dependencies installed.
echo.
pause
goto menu

:simple
echo.
echo Running simple demo...
python deepseek_simple.py
echo.
pause
goto menu

:full
echo.
echo Running full demo...
python deepseek_demo.py
echo.
pause
goto menu

:advanced
echo.
echo Running advanced demo...
echo.
echo Options:
echo 1. Default (CUDA if available)
echo 2. Use 8-bit quantization
echo 3. Use 4-bit quantization
echo 4. Force CPU usage
echo.
set /p adv_choice=Enter your choice (1-4): 

if "%adv_choice%"=="1" (
    python deepseek_advanced.py
) else if "%adv_choice%"=="2" (
    python deepseek_advanced.py --8bit
) else if "%adv_choice%"=="3" (
    python deepseek_advanced.py --4bit
) else if "%adv_choice%"=="4" (
    python deepseek_advanced.py --cpu
) else (
    echo Invalid choice.
)

echo.
pause
goto menu

:webapp
echo.
echo Starting web application...
echo The web interface will be available at http://127.0.0.1:5000
echo Press Ctrl+C to stop the server when done.
echo.
python deepseek_web_app.py --load-model-on-startup
echo.
pause
goto menu

:end
echo.
echo Thank you for using DeepSeek-R1 Model Runner!
echo.