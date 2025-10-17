@echo off
echo Fixing and starting CompliantPay Backend...
echo.

REM Clean and compile
echo Cleaning previous build...
mvn clean compile

IF %ERRORLEVEL% NEQ 0 (
    echo.
    echo Compilation failed! Checking for common issues...
    echo.
    goto :check_issues
)

echo.
echo Build successful! Starting application...
mvn spring-boot:run

goto :eof

:check_issues
echo Common issues to check:
echo 1. Make sure Java 17 is installed and in PATH
echo 2. Check if Maven is properly installed
echo 3. Verify all required imports in Java files
echo 4. Check for missing dependencies in pom.xml
echo.
echo Press any key to exit...
pause >nul