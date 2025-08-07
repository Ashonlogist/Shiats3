# Shiats3 API Documentation

Welcome to the Shiats3 API documentation! This document provides detailed information about the available API endpoints, request/response formats, and authentication methods.

## Table of Contents

1. [Authentication](#authentication)
2. [Base URL](#base-url)
3. [Response Format](#response-format)
4. [Error Handling](#error-handling)
5. [Pagination](#pagination)
6. [Endpoints](#endpoints)
   - [Authentication](#authentication-endpoints)
   - [Properties](#properties-endpoints)
   - [Hotels](#hotels-endpoints)
   - [Bookings](#bookings-endpoints)
   - [Users](#users-endpoints)
   - [Blogs](#blogs-endpoints)
   - [Amenities](#amenities-endpoints)
7. [Webhooks](#webhooks)
8. [Rate Limiting](#rate-limiting)
9. [Best Practices](#best-practices)

## Authentication

Shiats3 API uses JWT (JSON Web Tokens) for authentication. To authenticate your requests, include the JWT token in the `Authorization` header:

```
Authorization: Bearer your_jwt_token_here
```

### Obtaining a Token

1. **Login**
   - Endpoint: `/api/v1/auth/jwt/create/`
   - Method: `POST`
   - Request Body:
     ```json
     {
       "email": "user@example.com",
       "password": "yourpassword"
     }
     ```
   - Response:
     ```json
     {
       "refresh": "your_refresh_token",
       "access": "your_access_token"
     }
     ```

2. **Refresh Token**
   - Endpoint: `/api/v1/auth/jwt/refresh/`
   - Method: `POST`
   - Request Body:
     ```json
     {
       "refresh": "your_refresh_token"
     }
     ```
   - Response:
     ```json
     {
       "access": "new_access_token"
     }
     ```

## Base URL

All API endpoints are prefixed with `/api/v1/`.

## Response Format

All API responses are in JSON format and follow this structure:

```json
{
  "count": 100,
  "next": "https://api.shiats3.com/api/v1/endpoint/?page=2",
  "previous": null,
  "results": [
    // Array of resources
  ]
}
```

## Error Handling

Errors follow the JSON:API error format:

```json
{
  "errors": [
    {
      "status": "400",
      "code": "invalid_input",
      "title": "Invalid Input",
      "detail": "The provided input was invalid.",
      "source": {
        "pointer": "/data/attributes/email"
      }
    }
  ]
}
```

## Pagination

All list endpoints are paginated. The default page size is 12 items per page. You can control pagination using the following query parameters:

- `page`: Page number to retrieve (default: 1)
- `page_size`: Number of items per page (default: 12, max: 100)

## Endpoints

### Authentication Endpoints

#### Register a New User
- **URL**: `/api/v1/auth/users/`
- **Method**: `POST`
- **Authentication**: Not required
- **Request Body**:
  ```json
  {
    "email": "newuser@example.com",
    "password": "securepassword123",
    "password_confirm": "securepassword123",
    "first_name": "John",
    "last_name": "Doe",
    "phone_number": "+1234567890"
  }
  ```
- **Response**: `201 Created`

### Properties Endpoints

#### List Properties
- **URL**: `/api/v1/properties/`
- **Method**: `GET`
- **Query Parameters**:
  - `property_type`: Filter by property type (house, apartment, etc.)
  - `listing_type`: Filter by listing type (sale, rent)
  - `min_price`: Minimum price
  - `max_price`: Maximum price
  - `bedrooms`: Number of bedrooms
  - `bathrooms`: Number of bathrooms
  - `city`: Filter by city
  - `is_featured`: Filter featured properties

#### Get Property Details
- **URL**: `/api/v1/properties/{slug}/`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "id": 1,
    "title": "Luxury Villa in Lagos",
    "slug": "luxury-villa-lagos",
    "description": "A beautiful luxury villa with ocean view",
    "property_type": "house",
    "listing_type": "sale",
    "price": "250000.00",
    "bedrooms": 4,
    "bathrooms": 3,
    "area": 350.5,
    "address": "123 Lekki Phase 1",
    "city": "Lagos",
    "country": "Nigeria",
    "is_featured": true,
    "is_published": true,
    "created_at": "2023-01-01T12:00:00Z",
    "updated_at": "2023-01-01T12:00:00Z",
    "owner": 1,
    "images": [
      {
        "id": 1,
        "image": "https://example.com/media/properties/1/image1.jpg",
        "is_primary": true
      }
    ],
    "amenities": [1, 2, 3]
  }
  ```

### Hotels Endpoints

#### List Hotels
- **URL**: `/api/v1/hotels/`
- **Method**: `GET`
- **Query Parameters**:
  - `city`: Filter by city
  - `min_rating`: Minimum star rating (1-5)
  - `has_pool`: Boolean
  - `has_restaurant`: Boolean
  - `has_free_wifi`: Boolean
  - `has_parking`: Boolean

#### Get Hotel Details
- **URL**: `/api/v1/hotels/{slug}/`
- **Method**: `GET`

### Bookings Endpoints

#### Create a Booking
- **URL**: `/api/v1/bookings/`
- **Method**: `POST`
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "room_type": 1,
    "check_in": "2023-12-15",
    "check_out": "2023-12-20",
    "num_guests": 2,
    "guest_name": "John Doe",
    "guest_email": "john@example.com",
    "guest_phone": "+1234567890",
    "special_requests": "Late check-in requested"
  }
  ```

## Webhooks

Shiats3 provides webhooks for the following events:

- `booking.created`: Triggered when a new booking is created
- `booking.updated`: Triggered when a booking is updated
- `property.published`: Triggered when a property is published
- `user.registered`: Triggered when a new user registers

## Rate Limiting

- **Unauthenticated**: 100 requests per day
- **Authenticated**: 1,000 requests per day
- **Burst Limit**: 5 requests per second

## Best Practices

1. Always use HTTPS for all API requests
2. Never expose your API keys or tokens in client-side code
3. Handle errors gracefully and display user-friendly messages
4. Cache responses when appropriate to reduce server load
5. Implement proper input validation on the client side
6. Use the `Accept` header to specify response format
7. Follow RESTful principles for endpoint design
8. Implement proper error handling for network issues
9. Use pagination for large datasets
10. Implement proper authentication and authorization checks

## Support

For support, please contact our developer support team at [dev-support@shiats3.com](mailto:dev-support@shiats3.com).
