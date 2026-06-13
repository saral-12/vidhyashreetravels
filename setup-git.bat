@echo off
title Vidhyashree Travels - GitHub Auto-Sync Setup
cls
echo =======================================================
echo     VIDHYASHREE TRAVELS - GITHUB AUTO-SYNC SETUP
echo =======================================================
echo.

:: 1. Check if Git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed or not added to your system PATH.
    echo Please install Git from https://git-scm.com/ and try again.
    pause
    exit /b 1
)

:: 2. Initialize Git Repository if not already done
if not exist .git (
    echo [1/4] Initializing Git repository...
    git init
    git branch -M main
    echo.
) else (
    echo [1/4] Git repository already initialized.
    echo.
)

:: 3. Check and Configure Git User Details
git config user.name >nul 2>&1
if %errorlevel% neq 0 (
    echo [2/4] Git Username and Email are not set on this machine.
    set /p gitname="Enter your Git Username (e.g., John Doe): "
    set /p gitmail="Enter your Git Email (e.g., john@example.com): "
    
    git config user.name "%gitname%"
    git config user.email "%gitmail%"
    echo [SUCCESS] Configured local Git username and email.
    echo.
) else (
    echo [2/4] Git credentials already configured.
    echo.
)

:: 4. Configure Remote Repository Link
git remote -v | findstr "origin" >nul 2>&1
if %errorlevel% neq 0 (
    echo [3/4] No GitHub remote repository link found.
    echo Please create a NEW repository on GitHub (https://github.com/new).
    echo Do NOT add a README, LICENSE, or gitignore file when creating it.
    echo.
    set /p repourl="Enter your GitHub Repository URL (e.g., https://github.com/username/repo-name.git): "
    
    if not "%repourl%"=="" (
        git remote add origin %repourl%
        echo [SUCCESS] Remote repository linked.
        echo.
    ) else (
        echo [WARNING] No repository URL was entered. Remote link was skipped.
        echo.
    )
) else (
    echo [3/4] GitHub remote link already exists:
    git remote -v
    echo.
    echo To change it, run: git remote set-url origin NEW_URL
    echo.
)

:: 5. Create Initial Commit
echo [4/4] Creating initial commit and uploading...
git add .
git commit -m "Initial commit: website files and sync watcher" >nul 2>&1

git remote -v | findstr "origin" >nul 2>&1
if %errorlevel% equ 0 (
    echo.
    echo [IMPORTANT] Uploading files to GitHub. 
    echo If this is your first time, a GitHub login popup may appear.
    echo Please sign in to authenticate and complete the push.
    echo.
    git push -u origin main
    if %errorlevel% neq 0 (
        echo.
        echo [WARNING] Initial upload failed.
        echo Make sure you created the repository on GitHub and have internet access.
        echo.
    ) else (
        echo [SUCCESS] Initial upload successful!
        echo.
    )
) else (
    echo [INFO] Skipped upload because no remote repository URL was configured.
    echo.
)

echo =======================================================
echo            SETUP COMPLETE & WATCHER LAUNCHING
echo =======================================================
echo.
echo Now starting the background file watcher (watch.js).
echo Any changes you save to index.html, styles.css, or script.js
echo will be automatically committed and pushed to GitHub!
echo.
echo (To stop the watcher, close this command prompt window.)
echo.
node watch.js
pause
