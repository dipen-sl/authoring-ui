# Quick Reference Card

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

## 📁 Key Files

### Main Components
- `src/pages/SuitesPage.jsx` - Test suites management
- `src/pages/TestsPage.jsx` - Tests management within suite
- `src/hooks/useSuites.js` - Main API hook (replace for backend)

### Test Creation Components
- `src/components/tests/manual/ManualTestForm.jsx` - Manual test entry
- `src/components/tests/csv/CSVUploadForm.jsx` - CSV bulk upload
- `src/components/tests/video/VideoUploadForm.jsx` - Video upload

### Utility Functions
- `src/utils/csvParser.js` - CSV parsing and validation
- `src/utils/videoUtils.js` - Video file handling

## 🔧 Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues
npm run format          # Format code with Prettier

# Maintenance
npm run clean           # Clean build cache
```

## 🔗 Backend Integration

### 1. Install Dependencies
```bash
npm install axios
```

### 2. Replace API Functions
Update functions in `src/hooks/useSuites.js`:
- `getSuites()` → API call to `GET /suites`
- `createSuite()` → API call to `POST /suites`
- `addManualTest()` → API call to `POST /suites/{id}/tests`
- `uploadCsv()` → API call to `POST /suites/{id}/tests/csv`
- `uploadVideo()` → API call to `POST /suites/{id}/tests/video`

### 3. Environment Variables
Create `.env`:
```env
REACT_APP_API_BASE_URL=http://localhost:3000/api/v1
```

## 📊 Data Models

### Test Suite
```javascript
{
  id: string,
  suite_name: string,
  test_count: number,
  created_at: string,
  updated_at: string
}
```

### Test
```javascript
{
  id: string,
  test_id: string,
  test_title: string,
  test_description: string,
  assertion: string,
  type: 'manual' | 'csv' | 'video',
  suite_id: string,
  created_at: string,
  updated_at: string
}
```

## 📁 File Formats

### CSV Template
```csv
test_id,test_title,test_description,assertion
LOGIN_001,Valid Login Test,Test successful login,User redirected to dashboard
```

### Supported Video Formats
- `.mp4`, `.webm`, `.ogg`, `.avi`, `.mov`, `.wmv`, `.flv`, `.mkv`

## 🎨 Styling

### Tailwind CSS Classes
- `bg-gradient-to-br` - Gradient backgrounds
- `backdrop-blur-md` - Glass-morphism effects
- `text-ai-primary` - Custom AI theme colors
- `animate-fade-in` - Custom animations

### Theme Colors
- **Light**: `#fdf0d5` (background), `#003049` (text)
- **Dark**: `#0a0a0a` (background), `#ffffff` (text)

## 🐛 Common Issues

### Blank White Page
- Check browser console for errors
- Verify all imports are correct
- Check for infinite loops in useEffect

### CSV Upload Errors
- Ensure headers match: `test_id,test_title,test_description,assertion`
- Check file encoding (UTF-8)
- Verify file size (max 10MB)

### Video Upload Errors
- Check supported formats
- Verify file size (max 100MB)
- Ensure proper MIME type

## 📚 Documentation

- **Project Overview**: `PROJECT_SUMMARY.md`
- **Backend Integration**: `docs/BACKEND_INTEGRATION_GUIDE.md`
- **API Documentation**: `docs/API_DOCUMENTATION.md`
- **Development Setup**: `docs/DEVELOPMENT_SETUP.md`

## 🔍 Debugging

### Browser Console
- Check for JavaScript errors
- Monitor network requests
- Use React DevTools

### Common Debug Steps
1. Check component props
2. Verify state updates
3. Check useEffect dependencies
4. Monitor API calls
5. Validate data formats

## 🚀 Deployment

### Build
```bash
npm run build
```

### Environment Variables
```env
NODE_ENV=production
REACT_APP_API_BASE_URL=https://api.yourapp.com/api/v1
```

### Static Hosting
- Deploy `dist/` folder to any static host
- Configure routing for SPA
- Set up environment variables
