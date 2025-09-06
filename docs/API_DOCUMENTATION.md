# API Documentation

## Overview

This document provides detailed API specifications for the Authoring TextUI backend integration. All endpoints follow RESTful conventions and return JSON responses.

## Base URL

```
Production: https://api.yourapp.com/api/v1
Staging: https://staging-api.yourapp.com/api/v1
Development: http://localhost:3000/api/v1
```

## Authentication

All API endpoints require authentication via JWT token in the Authorization header:

```http
Authorization: Bearer <jwt_token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": <response_data>,
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE",
  "details": {}
}
```

## Test Suites API

### GET /suites

Get all test suites for the authenticated user.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "suite-1",
      "suite_name": "E-commerce Checkout",
      "test_count": 5,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    },
    {
      "id": "suite-2",
      "suite_name": "API Endpoint Tests",
      "test_count": 8,
      "created_at": "2024-01-15T11:00:00Z",
      "updated_at": "2024-01-15T11:00:00Z"
    }
  ]
}
```

### POST /suites

Create a new test suite.

**Request Body:**
```json
{
  "suite_name": "New Test Suite"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "suite-3",
    "suite_name": "New Test Suite",
    "test_count": 0,
    "created_at": "2024-01-15T12:00:00Z",
    "updated_at": "2024-01-15T12:00:00Z"
  }
}
```

### GET /suites/{suite_id}

Get a specific test suite by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "suite-1",
    "suite_name": "E-commerce Checkout",
    "test_count": 5,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

### PUT /suites/{suite_id}

Update a test suite.

**Request Body:**
```json
{
  "suite_name": "Updated Suite Name"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "suite-1",
    "suite_name": "Updated Suite Name",
    "test_count": 5,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T12:30:00Z"
  }
}
```

### DELETE /suites/{suite_id}

Delete a test suite and all its tests.

**Response:**
```json
{
  "success": true,
  "message": "Suite deleted successfully"
}
```

## Tests API

### GET /suites/{suite_id}/tests

Get all tests for a specific suite.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "test-1",
      "test_id": "LOGIN_001",
      "test_title": "Valid Login Test",
      "test_description": "Test successful login with valid credentials",
      "assertion": "User should be redirected to dashboard",
      "type": "manual",
      "suite_id": "suite-1",
      "created_at": "2024-01-15T10:35:00Z",
      "updated_at": "2024-01-15T10:35:00Z"
    },
    {
      "id": "test-2",
      "test_id": "LOGIN_002",
      "test_title": "Invalid Login Test",
      "test_description": "Test login with invalid credentials",
      "assertion": "Error message should be displayed",
      "type": "csv",
      "suite_id": "suite-1",
      "created_at": "2024-01-15T10:40:00Z",
      "updated_at": "2024-01-15T10:40:00Z"
    }
  ]
}
```

### POST /suites/{suite_id}/tests

Create a manual test.

**Request Body:**
```json
{
  "test_id": "LOGIN_003",
  "test_title": "Password Reset Test",
  "test_description": "Test password reset functionality",
  "assertion": "Reset email should be sent",
  "type": "manual"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "test-3",
    "test_id": "LOGIN_003",
    "test_title": "Password Reset Test",
    "test_description": "Test password reset functionality",
    "assertion": "Reset email should be sent",
    "type": "manual",
    "suite_id": "suite-1",
    "created_at": "2024-01-15T12:00:00Z",
    "updated_at": "2024-01-15T12:00:00Z"
  }
}
```

### PUT /tests/{test_id}

Update an existing test.

**Request Body:**
```json
{
  "test_title": "Updated Test Title",
  "test_description": "Updated description",
  "assertion": "Updated assertion"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "test-1",
    "test_id": "LOGIN_001",
    "test_title": "Updated Test Title",
    "test_description": "Updated description",
    "assertion": "Updated assertion",
    "type": "manual",
    "suite_id": "suite-1",
    "created_at": "2024-01-15T10:35:00Z",
    "updated_at": "2024-01-15T12:30:00Z"
  }
}
```

### DELETE /tests/{test_id}

Delete a test.

**Response:**
```json
{
  "success": true,
  "message": "Test deleted successfully"
}
```

## File Upload API

### POST /suites/{suite_id}/tests/csv

Upload CSV file with multiple tests.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: FormData with 'file' field containing CSV file

**CSV Format:**
```csv
test_id,test_title,test_description,assertion
LOGIN_001,Valid Login Test,Test successful login with valid credentials,User should be redirected to dashboard
LOGIN_002,Invalid Login Test,Test login with invalid credentials,Error message should be displayed
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "test-4",
      "test_id": "LOGIN_001",
      "test_title": "Valid Login Test",
      "test_description": "Test successful login with valid credentials",
      "assertion": "User should be redirected to dashboard",
      "type": "csv",
      "suite_id": "suite-1",
      "created_at": "2024-01-15T12:30:00Z",
      "updated_at": "2024-01-15T12:30:00Z"
    },
    {
      "id": "test-5",
      "test_id": "LOGIN_002",
      "test_title": "Invalid Login Test",
      "test_description": "Test login with invalid credentials",
      "assertion": "Error message should be displayed",
      "type": "csv",
      "suite_id": "suite-1",
      "created_at": "2024-01-15T12:30:00Z",
      "updated_at": "2024-01-15T12:30:00Z"
    }
  ],
  "message": "2 tests imported successfully"
}
```

### POST /suites/{suite_id}/tests/video

Upload video file and create test.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: FormData with:
  - 'file': Video file
  - 'test_title': Test title
  - 'test_description': Test description

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "test-6",
    "test_id": "VIDEO_001",
    "test_title": "Video Test Title",
    "test_description": "Video test description",
    "assertion": "Processing transcription...",
    "type": "video",
    "suite_id": "suite-1",
    "video_url": "https://storage.yourapp.com/videos/test-6.mp4",
    "transcription_status": "processing",
    "created_at": "2024-01-15T12:45:00Z",
    "updated_at": "2024-01-15T12:45:00Z"
  },
  "message": "Video uploaded successfully. Transcription in progress."
}
```

## Error Codes

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| VALIDATION_ERROR | 400 | Request validation failed |
| UNAUTHORIZED | 401 | Authentication required |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Resource already exists |
| FILE_TOO_LARGE | 413 | File size exceeds limit |
| UNSUPPORTED_MEDIA | 415 | Unsupported file format |
| INTERNAL_ERROR | 500 | Internal server error |

### Validation Errors

```json
{
  "success": false,
  "message": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": {
    "suite_name": ["Suite name is required"],
    "test_id": ["Test ID must be unique"]
  }
}
```

## Rate Limiting

- **General API**: 1000 requests per hour per user
- **File Uploads**: 10 requests per hour per user
- **Rate Limit Headers**:
  ```
  X-RateLimit-Limit: 1000
  X-RateLimit-Remaining: 999
  X-RateLimit-Reset: 1640995200
  ```

## File Upload Limits

### CSV Files
- **Max Size**: 10MB
- **Max Rows**: 1000 tests per upload
- **Supported Formats**: .csv
- **Required Headers**: test_id, test_title, test_description, assertion

### Video Files
- **Max Size**: 100MB
- **Supported Formats**: .mp4, .webm, .ogg, .avi, .mov, .wmv, .flv, .mkv
- **Processing Time**: Up to 5 minutes for transcription

## Webhooks

### Test Processing Complete

```http
POST /webhooks/test-processing
Content-Type: application/json

{
  "event": "test.processing.complete",
  "data": {
    "test_id": "test-6",
    "suite_id": "suite-1",
    "transcription_status": "completed",
    "assertion": "User should complete the video tutorial successfully"
  }
}
```

## SDK Examples

### JavaScript/Node.js

```javascript
const axios = require('axios');

const api = axios.create({
  baseURL: 'https://api.yourapp.com/api/v1',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

// Get all suites
const suites = await api.get('/suites');

// Create a test
const test = await api.post('/suites/suite-1/tests', {
  test_id: 'LOGIN_001',
  test_title: 'Valid Login Test',
  test_description: 'Test successful login',
  assertion: 'User should be redirected',
  type: 'manual'
});

// Upload CSV
const formData = new FormData();
formData.append('file', csvFile);
const csvTests = await api.post('/suites/suite-1/tests/csv', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
```

### Python

```python
import requests

headers = {
    'Authorization': f'Bearer {token}',
    'Content-Type': 'application/json'
}

# Get all suites
response = requests.get('https://api.yourapp.com/api/v1/suites', headers=headers)
suites = response.json()

# Create a test
test_data = {
    'test_id': 'LOGIN_001',
    'test_title': 'Valid Login Test',
    'test_description': 'Test successful login',
    'assertion': 'User should be redirected',
    'type': 'manual'
}
response = requests.post('https://api.yourapp.com/api/v1/suites/suite-1/tests', 
                        json=test_data, headers=headers)
```

## Testing

### Postman Collection

Import the provided Postman collection for testing all endpoints:

1. Set up environment variables:
   - `base_url`: Your API base URL
   - `auth_token`: Your JWT token

2. Run the collection tests to verify all endpoints work correctly.

### cURL Examples

```bash
# Get all suites
curl -H "Authorization: Bearer <token>" \
     https://api.yourapp.com/api/v1/suites

# Create a test
curl -X POST \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{"test_id":"LOGIN_001","test_title":"Valid Login","test_description":"Test login","assertion":"Should redirect","type":"manual"}' \
     https://api.yourapp.com/api/v1/suites/suite-1/tests

# Upload CSV
curl -X POST \
     -H "Authorization: Bearer <token>" \
     -F "file=@tests.csv" \
     https://api.yourapp.com/api/v1/suites/suite-1/tests/csv
```
