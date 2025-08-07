@echo off
REM Create a virtual environment
python -m venv venv

REM Activate the virtual environment
call venv\Scripts\activate

REM Install requirements
pip install -r requirements.txt

REM Create .env file if it doesn't exist
if not exist .env (
    echo DEBUG=True > .env
    echo SECRET_KEY=your-secret-key-here >> .env
    echo ALLOWED_HOSTS=localhost,127.0.0.1 >> .env
)

echo Setup complete. Run the following commands to get started:
echo 1. venv\Scripts\activate
echo 2. python manage.py runserver
