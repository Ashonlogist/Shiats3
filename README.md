# Shiats3 - Real Estate & Hospitality Platform

Shiats3 is a comprehensive real estate and hospitality platform designed specifically for the African market. The platform connects property owners, hotel managers, and customers in a seamless ecosystem for property sales, rentals, and hotel bookings.

## Key Features

- **Property Listings**: Browse and search residential and commercial properties for sale or rent
- **Hotel Bookings**: Discover and book hotel rooms across Africa
- **User Roles**: Differentiated experiences for property owners, hotel managers, and customers
- **Blog & Content**: Informative content about real estate and travel in Africa
- **Inquiry System**: Direct communication between users and property/hotel representatives
- **Admin Dashboard**: Comprehensive management interface for platform administration

## Technology Stack

### Backend
- **Framework**: Django 4.2 & Django REST Framework
- **Database**: PostgreSQL with PostGIS for geospatial queries
- **Authentication**: JWT (JSON Web Tokens)
- **Cache**: Redis
- **Task Queue**: Celery
- **API Documentation**: Swagger/ReDoc
- **File Storage**: AWS S3 (production) / Local storage (development)

### Frontend (Client)
- **Framework**: React.js
- **State Management**: Redux Toolkit
- **UI Components**: Material-UI
- **Maps Integration**: Google Maps API
- **Form Handling**: Formik & Yup
- **HTTP Client**: Axios

## Project Structure

```
Shiats3_project/
├── client/                      # React frontend
│   ├── public/                  # Static files
│   └── src/                     # React source code
│       ├── assets/              # Images, fonts, etc.
│       ├── components/          # Reusable UI components
│       ├── features/            # Feature-based modules
│       │   ├── auth/           # Authentication
│       │   ├── properties/     # Property listing and details
│       │   ├── bookings/       # Booking management
│       │   ├── hotels/         # Hotel management
│       │   └── dashboard/      # User dashboard
│       ├── hooks/              # Custom React hooks
│       ├── services/           # API service layer
│       ├── store/              # Redux store and slices
│       ├── utils/              # Utility functions
│       ├── App.jsx             # Main App component
│       └── main.jsx            # Application entry point
│
└── server/                     # Django backend
    ├── config/                # Project configuration
    │   ├── settings/          # Django settings
    │   ├── urls.py            # Main URL configuration
    │   └── asgi.py/wsgi.py    # ASGI/WSGI config
    │
    ├── properties/            # Properties app
    │   ├── migrations/        # Database migrations
    │   ├── models/           # Data models
    │   ├── serializers/      # API serializers
    │   ├── services/         # Business logic
    │   ├── tests/            # Tests
    │   ├── urls.py          # App URLs
    │   └── views.py         # View functions/classes
    │
    ├── users/                # Users app
    ├── bookings/             # Bookings app
    ├── hotels/               # Hotels app
    ├── media/                # Uploaded media files
    ├── static/               # Static files
    ├── manage.py             # Django management script
    ├── requirements.txt      # Python dependencies
    └── pytest.ini           # Test configuration
```

## Getting Started

### Prerequisites

- **Backend**:
  - Python 3.8+
  - PostgreSQL 12+
  - Redis
  - GDAL (for geospatial support)

- **Frontend**:
  - Node.js 16+
  - npm 8+ or yarn 1.22+

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/shiats3.git
   cd shiats3/server
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. Run migrations:
   ```bash
   python manage.py migrate
   ```

6. Create a superuser:
   ```bash
   python manage.py createsuperuser
   ```

7. Run the development server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd ../client
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

## Testing

### Backend Tests

```bash
# Run all tests
pytest

# Run tests with coverage
pytest --cov=.

# Run a specific test file
pytest path/to/test_file.py
```

### Frontend Tests

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## API Documentation

Comprehensive API documentation is available at `/api/docs/` when running the development server. This interactive documentation includes:

- All available endpoints
- Request/response examples
- Authentication methods
- Error codes and responses

## Deployment

### Backend (Production)

1. Set up a production-ready web server (e.g., Gunicorn with Nginx)
2. Configure environment variables in production
3. Set up a production database
4. Configure static and media file storage
5. Set up SSL/TLS certificates
6. Configure caching and background tasks

### Frontend (Production)

1. Build the production bundle:
   ```bash
   npm run build
   ```

2. Deploy the `build` directory to your static file server or CDN

## Environment Variables

See `.env.example` for a list of required environment variables.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@shiats3.com or open an issue in the GitHub repository.

2. Create and activate a virtual environment (recommended):
   ```bash
   # On Windows
   python -m venv venv
   .\venv\Scripts\activate
   
   # On macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install the required packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Run database migrations:
   ```bash
   python manage.py migrate
   ```

5. Create a superuser (optional, for admin access):
   ```bash
   python manage.py createsuperuser
   ```

6. Run the development server:
   ```bash
   python manage.py runserver
   ```

   The API will be available at `http://localhost:8000/api/`
   Admin interface: `http://localhost:8000/admin/`

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install the required packages:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:3000`

## API Endpoints

- `POST /api/files/` - Upload a new file
- `GET /api/files/list/` - List all uploaded files
- `GET /api/files/<id>/` - Get details of a specific file

## Development

- Backend runs on port 8000 by default
- Frontend runs on port 3000 by default
- CORS is configured to allow requests from the frontend development server

## Deployment

For production deployment, you should:
1. Set `DEBUG = False` in `server/config/settings.py`
2. Configure a production database (PostgreSQL recommended)
3. Set up a production web server (Nginx + Gunicorn recommended)
4. Configure proper security settings (HTTPS, CORS, etc.)
5. Set environment variables for sensitive information

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
