@echo off
REM Change directory to the specified path
cd /d "C:\xampp2\htdocs\timetable2\backend" 

REM Activate the virtual environment
call venv\Scripts\activate

REM Run the Django development server on port 8015
py manage.py runserver 8015

REM Check if the previous command was successful
if %ERRORLEVEL% NEQ 0 (
    echo "The Django server failed to start. Error code: %ERRORLEVEL%"
    exit /b %ERRORLEVEL%
) else (
    echo "Django server started successfully on port 8015."
)
