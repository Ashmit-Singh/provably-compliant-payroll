@echo off
echo Quick Fix for CompliantPay Backend
echo.

echo Step 1: Cleaning previous build...
call mvn clean

echo.
echo Step 2: Compiling the project...
call mvn compile

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Compilation successful!
    echo.
    echo Step 3: Starting the application...
    call mvn spring-boot:run
) else (
    echo.
    echo ❌ Compilation failed. Please check the errors above.
    echo.
    pause
)