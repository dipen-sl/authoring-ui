# Backend Integration Guide

## Overview

This guide provides comprehensive instructions for integrating the Authoring TextUI frontend with a backend API. The frontend is currently using mock data and local storage, and all API calls are placeholder functions that need to be replaced with actual HTTP requests.

## Table of Contents

1. [Project Architecture](#project-architecture)
2. [API Endpoints](#api-endpoints)
3. [Data Models](#data-models)
4. [Integration Steps](#integration-steps)
5. [Error Handling](#error-handling)
6. [Authentication](#authentication)
7. [File Uploads](#file-uploads)
8. [Testing](#testing)
9. [Deployment](#deployment)

## Project Architecture

### Current Frontend Structure
```
src/
├── hooks/
│   └── useSuites.js          # Main API hook with placeholder functions
├── components/
│   ├── suites/               # Test suite management components
│   └── tests/                # Test management components
├── utils/
│   ├── csvParser.js          # CSV parsing utilities
│   └── videoUtils.js         # Video handling utilities
└── pages/
    ├── SuitesPage.jsx        # Test suites listing page
    └── TestsPage.jsx         # Tests management page
```

### Key Integration Points
- **`src/hooks/useSuites.js`**: Contains all API placeholder functions
- **`src/utils/csvParser.js`**: Handles CSV file parsing
- **`src/utils/videoUtils.js`**: Handles video file validation and processing

## API Endpoints

### Base URL
```
https://your-api-domain.com/api/v1
```

### Test Suites Endpoints

#### 1. Get All Test Suites
```http
GET /suites
```

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
    }
  ]
}
```

#### 2. Create Test Suite
```http
POST /suites
Content-Type: application/json

{
  "suite_name": "New Test Suite"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "suite-2",
    "suite_name": "New Test Suite",
    "test_count": 0,
    "created_at": "2024-01-15T11:00:00Z",
    "updated_at": "2024-01-15T11:00:00Z"
  }
}
```

#### 3. Update Test Suite
```http
PUT /suites/{suite_id}
Content-Type: application/json

{
  "suite_name": "Updated Suite Name"
}
```

#### 4. Delete Test Suite
```http
DELETE /suites/{suite_id}
```

#### 5. Get Test Suite by ID
```http
GET /suites/{suite_id}
```

### Tests Endpoints

#### 1. Get Tests by Suite
```http
GET /suites/{suite_id}/tests
```

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
    }
  ]
}
```

#### 2. Create Manual Test
```http
POST /suites/{suite_id}/tests
Content-Type: application/json

{
  "test_id": "LOGIN_002",
  "test_title": "Invalid Login Test",
  "test_description": "Test login with invalid credentials",
  "assertion": "Error message should be displayed",
  "type": "manual"
}
```

#### 3. Update Test
```http
PUT /tests/{test_id}
Content-Type: application/json

{
  "test_title": "Updated Test Title",
  "test_description": "Updated description",
  "assertion": "Updated assertion"
}
```

#### 4. Delete Test
```http
DELETE /tests/{test_id}
```

#### 5. Upload CSV Tests
```http
POST /suites/{suite_id}/tests/csv
Content-Type: multipart/form-data

FormData:
- file: CSV file
```

**CSV Format Expected:**
```csv
test_id,test_title,test_description,assertion
LOGIN_001,Valid Login Test,Test successful login with valid credentials,User should be redirected to dashboard
LOGIN_002,Invalid Login Test,Test login with invalid credentials,Error message should be displayed
```

#### 6. Upload Video Test
```http
POST /suites/{suite_id}/tests/video
Content-Type: multipart/form-data

FormData:
- file: Video file
- test_title: "Video Test Title"
- test_description: "Video test description"
```

## Data Models

### Test Suite Model
```typescript
interface TestSuite {
  id: string;
  suite_name: string;
  test_count: number;
  created_at: string;
  updated_at: string;
}
```

### Test Model
```typescript
interface Test {
  id: string;
  test_id: string;
  test_title: string;
  test_description: string;
  assertion: string;
  type: 'manual' | 'csv' | 'video';
  suite_id: string;
  created_at: string;
  updated_at: string;
}
```

## Integration Steps

### Step 1: Set Up API Configuration

Create a new file `src/config/api.js`:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api/v1';

export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Add authentication token if needed
export const setAuthToken = (token) => {
  apiConfig.headers.Authorization = `Bearer ${token}`;
};
```

### Step 2: Create API Service Layer

Create `src/services/api.js`:

```javascript
import axios from 'axios';
import { apiConfig } from '../config/api';

const api = axios.create(apiConfig);

// Request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message;
    throw new Error(message);
  }
);

export default api;
```

### Step 3: Update useSuites Hook

Replace the placeholder functions in `src/hooks/useSuites.js`:

```javascript
import api from '../services/api';

// Replace getSuites function
const getSuites = useCallback(async () => {
  try {
    setError(null);
    const response = await api.get('/suites');
    setSuites(response.data);
    return response.data;
  } catch (err) {
    setError('Failed to fetch suites');
    throw err;
  }
}, []);

// Replace createSuite function
const createSuite = useCallback(async (suiteData) => {
  try {
    setError(null);
    const response = await api.post('/suites', suiteData);
    const newSuite = response.data;
    setSuites(prev => [...prev, newSuite]);
    return newSuite;
  } catch (err) {
    setError('Failed to create suite');
    throw err;
  }
}, []);

// Replace addManualTest function
const addManualTest = useCallback(async (suiteId, testData) => {
  try {
    setLoading(true);
    setError(null);
    const response = await api.post(`/suites/${suiteId}/tests`, {
      ...testData,
      type: 'manual'
    });
    const newTest = response.data;
    setTests(prev => [...prev, newTest]);
    return newTest;
  } catch (err) {
    setError('Failed to create test');
    throw err;
  } finally {
    setLoading(false);
  }
}, []);

// Replace uploadCsv function
const uploadCsv = useCallback(async (suiteId, file) => {
  try {
    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post(`/suites/${suiteId}/tests/csv`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    const newTests = response.data;
    setTests(prev => [...prev, ...newTests]);
    return newTests;
  } catch (err) {
    setError('Failed to upload CSV');
    throw err;
  } finally {
    setLoading(false);
  }
}, []);

// Replace uploadVideo function
const uploadVideo = useCallback(async (suiteId, file, testData) => {
  try {
    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('test_title', testData.test_title);
    formData.append('test_description', testData.test_description);
    
    const response = await api.post(`/suites/${suiteId}/tests/video`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    const newTest = response.data;
    setTests(prev => [...prev, newTest]);
    return newTest;
  } catch (err) {
    setError('Failed to upload video');
    throw err;
  } finally {
    setLoading(false);
  }
}, []);
```

### Step 4: Install Required Dependencies

```bash
npm install axios
```

### Step 5: Environment Variables

Create `.env` file:

```env
REACT_APP_API_BASE_URL=http://localhost:3000/api/v1
REACT_APP_ENVIRONMENT=development
```

## Error Handling

### Frontend Error Handling

The current implementation includes error handling in the hooks. Ensure your API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE",
  "details": {}
}
```

### Common Error Scenarios

1. **Network Errors**: Handle offline scenarios
2. **Authentication Errors**: Redirect to login
3. **Validation Errors**: Display field-specific errors
4. **File Upload Errors**: Handle size limits and format validation

## Authentication

### JWT Token Implementation

```javascript
// Add to src/services/api.js
const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('authToken', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('authToken');
  }
};

// Login function
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  const { token, user } = response.data;
  setAuthToken(token);
  return { token, user };
};

// Logout function
export const logout = () => {
  setAuthToken(null);
  localStorage.removeItem('authToken');
};
```

## File Uploads

### CSV Upload Requirements

- **File Size Limit**: 10MB
- **Supported Formats**: .csv
- **Required Headers**: test_id, test_title, test_description, assertion
- **Validation**: Server-side validation of CSV structure

### Video Upload Requirements

- **File Size Limit**: 100MB
- **Supported Formats**: .mp4, .webm, .ogg, .avi, .mov, .wmv, .flv, .mkv
- **Processing**: Server should handle video transcription and test generation
- **Progress Tracking**: Implement upload progress indicators

## Testing

### Unit Tests

Create tests for API functions:

```javascript
// src/hooks/__tests__/useSuites.test.js
import { renderHook, act } from '@testing-library/react-hooks';
import { useSuites } from '../useSuites';

describe('useSuites', () => {
  it('should fetch suites successfully', async () => {
    const { result } = renderHook(() => useSuites());
    
    await act(async () => {
      await result.current.getSuites();
    });
    
    expect(result.current.suites).toHaveLength(2);
    expect(result.current.loading).toBe(false);
  });
});
```

### Integration Tests

Test the complete flow:

```javascript
// src/components/__tests__/SuitesPage.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SuitesPage from '../SuitesPage';

describe('SuitesPage', () => {
  it('should create a new suite', async () => {
    render(<SuitesPage />);
    
    fireEvent.click(screen.getByText('Create Suite'));
    fireEvent.change(screen.getByLabelText('Suite Name'), {
      target: { value: 'New Test Suite' }
    });
    fireEvent.click(screen.getByText('Create Suite'));
    
    await waitFor(() => {
      expect(screen.getByText('New Test Suite')).toBeInTheDocument();
    });
  });
});
```

## Deployment

### Environment Configuration

Create environment-specific configurations:

```javascript
// src/config/environment.js
const config = {
  development: {
    apiBaseUrl: 'http://localhost:3000/api/v1',
    enableLogging: true,
  },
  staging: {
    apiBaseUrl: 'https://staging-api.yourapp.com/api/v1',
    enableLogging: true,
  },
  production: {
    apiBaseUrl: 'https://api.yourapp.com/api/v1',
    enableLogging: false,
  },
};

export default config[process.env.NODE_ENV || 'development'];
```

### Build Configuration

Update `vite.config.js`:

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: process.env.NODE_ENV !== 'production',
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL || 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
```

## Migration Checklist

- [ ] Set up API configuration
- [ ] Install axios dependency
- [ ] Create API service layer
- [ ] Replace placeholder functions in useSuites.js
- [ ] Update error handling
- [ ] Implement authentication
- [ ] Test all endpoints
- [ ] Set up environment variables
- [ ] Configure build settings
- [ ] Deploy to staging environment
- [ ] Perform integration testing
- [ ] Deploy to production

## Support

For questions or issues during integration, please refer to:
- API documentation
- Frontend component documentation
- Error logs and debugging tools
- Backend team communication channels

---

**Note**: This guide assumes a RESTful API architecture. Adjust the endpoints and data structures according to your backend implementation.
