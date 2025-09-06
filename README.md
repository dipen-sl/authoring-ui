# Authoring TextUI

A comprehensive test management platform built with React, featuring test suite management, multiple test creation methods, and a beautiful AI-inspired design. This application provides a complete solution for creating, organizing, and managing test cases with support for manual entry, CSV uploads, and video-based test creation.

## ✨ Features

### Test Suite Management
- **Suite CRUD Operations**: Create, read, update, and delete test suites
- **Dynamic Test Counting**: Real-time test count updates per suite
- **Suite Organization**: Organize tests into logical groups
- **Suite Navigation**: Easy navigation between suites and their tests

### Test Creation Methods
- **Manual Entry**: Create tests through an intuitive form interface
- **CSV Upload**: Bulk import tests from CSV files with validation
- **Video Upload**: Upload video files for test creation with transcription support
- **Auto-fill Integration**: CSV data can auto-populate manual test forms

### Advanced Features
- **Multi-tab Interface**: Organized workflow with dedicated tabs for each function
- **Real-time Validation**: Form validation with helpful error messages
- **File Format Support**: CSV, video files (.mp4, .webm, .mov, etc.)
- **Data Persistence**: Local storage with backend-ready architecture
- **Error Handling**: Comprehensive error handling and user feedback

### UI/UX Excellence
- **AI-Style Design**: Modern gradient backgrounds and professional typography
- **Dark/Light Mode**: Seamless theme switching with custom color palettes
- **Custom Vogue Font**: Elegant typography for enhanced visual appeal
- **Smooth Animations**: Framer Motion powered transitions and micro-interactions
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Glass-morphism Effects**: Contemporary translucent design elements

## 🎨 Design System

### Color Palettes
- **Dark Mode**: Cool blue-green family with teal accents
- **Light Mode**: Cream background (#fdf0d5) with dark blue highlights (#003049)

### Typography
- **Title**: Custom Vogue font for elegant appearance
- **Body**: Inter font family for readability
- **Code**: JetBrains Mono for technical elements

## 🛠 Tech Stack

- **React 18** with Vite for fast development
- **React Router DOM** for client-side routing
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for smooth animations
- **React Hook Form** for form handling and validation
- **Lucide React** for beautiful icons
- **React Context API** for global state management
- **Local Storage** for data persistence (backend-ready)

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser and navigate to `http://localhost:5173`**

## 📖 Usage

### Test Suite Management

#### Creating Test Suites
1. Navigate to the main Suites page
2. Click "Create Suite" button
3. Enter a descriptive suite name
4. Click "Create Suite" to save

#### Managing Test Suites
- **View**: Click on a suite tile to view its tests
- **Edit**: Use the edit button to modify suite details
- **Delete**: Remove a suite and all its tests

### Test Creation

#### Manual Entry
1. Open a test suite
2. Click "Manual Entry" tab
3. Fill in the required fields:
   - **Test ID**: Unique identifier (e.g., LOGIN_001)
   - **Test Title**: Descriptive name for your test
   - **Test Description**: Detailed test description
   - **Assertion**: Expected result or validation criteria
4. Click "Create Test" to save

#### CSV Upload
1. Open a test suite
2. Click "CSV Upload" tab
3. Upload a CSV file with the following headers:
   ```csv
   test_id,test_title,test_description,assertion
   LOGIN_001,Valid Login Test,Test successful login,User redirected to dashboard
   ```
4. Preview the parsed tests
5. Click "Upload Tests" to import all tests
6. Optionally click "Auto-Fill Manual Form" to populate the manual form

#### Video Upload
1. Open a test suite
2. Click "Video Upload" tab
3. Upload a video file (.mp4, .webm, .mov, etc.)
4. Add test title and description
5. Click "Create Video Test" to process

### Test Management

#### Viewing Tests
- Navigate to any test suite
- Click "All Tests" tab to see all tests in the suite
- Tests are displayed with their details and actions

#### Editing Tests
- Click the edit button on any test
- Modify the test details in the modal
- Click "Update Test" to save changes

#### Deleting Tests
- Click the delete button on any test
- Confirm deletion in the modal
- Test will be removed from the suite

## 📁 File Formats

### CSV Format for Bulk Import
```csv
test_id,test_title,test_description,assertion
LOGIN_001,Valid Login Test,Test successful login with valid credentials,User should be redirected to dashboard
LOGIN_002,Invalid Login Test,Test login with invalid credentials,Error message should be displayed
LOGIN_003,Password Reset Test,Test password reset functionality,Reset email should be sent
```

### Supported Video Formats
- **MP4** (.mp4) - Recommended for best compatibility
- **WebM** (.webm) - Modern web format
- **QuickTime** (.mov) - Apple format
- **AVI** (.avi) - Windows format
- **WMV** (.wmv) - Windows Media Video
- **FLV** (.flv) - Flash Video
- **MKV** (.mkv) - Matroska format

## 📂 Project Structure

```
src/
├── components/
│   ├── suites/                   # Test suite management components
│   │   ├── CreateSuiteModal.jsx  # Suite creation modal
│   │   ├── DeleteSuiteModal.jsx  # Suite deletion confirmation
│   │   ├── EditSuiteModal.jsx    # Suite editing modal
│   │   └── SuiteList.jsx         # Suite listing component
│   ├── tests/                    # Test management components
│   │   ├── csv/
│   │   │   └── CSVUploadForm.jsx # CSV upload and parsing
│   │   ├── manual/
│   │   │   └── ManualTestForm.jsx # Manual test creation form
│   │   ├── video/
│   │   │   └── VideoUploadForm.jsx # Video upload component
│   │   ├── DeleteTestModal.jsx   # Test deletion confirmation
│   │   ├── EditTestModal.jsx     # Test editing modal
│   │   └── TestsList.jsx         # Test listing component
│   ├── TextField.jsx             # Reusable input component
│   └── ThemeToggle.jsx           # Dark/light mode toggle
├── context/
│   ├── TestContext.jsx           # Legacy test context
│   └── ThemeContext.jsx          # Theme state management
├── hooks/
│   └── useSuites.js              # Main API hook with placeholder functions
├── pages/
│   ├── Home.jsx                  # Legacy home page
│   ├── SuitesPage.jsx            # Test suites management page
│   └── TestsPage.jsx             # Tests management page
├── utils/
│   ├── csvParser.js              # CSV parsing utilities
│   └── videoUtils.js             # Video handling utilities
├── App.jsx                       # Root component with routing
├── main.jsx                      # Application entry point
└── index.css                     # Global styles and themes
```

## 🎯 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Design Features

- **AI-Style Background**: Subtle radial gradients with theme-aware colors
- **Glass-morphism Cards**: Translucent elements with backdrop blur
- **Smooth Transitions**: Framer Motion powered animations
- **Custom Typography**: Vogue font for titles, Inter for body text
- **Theme Persistence**: User preferences saved to localStorage
- **Responsive Layout**: Optimized for all screen sizes

## 🔗 Backend Integration

This application is designed to be backend-ready with placeholder API functions. For backend integration:

1. **Read the Integration Guide**: See `docs/BACKEND_INTEGRATION_GUIDE.md` for detailed instructions
2. **API Documentation**: Refer to `docs/API_DOCUMENTATION.md` for endpoint specifications
3. **Development Setup**: Follow `docs/DEVELOPMENT_SETUP.md` for environment setup
4. **Replace Placeholder Functions**: Update functions in `src/hooks/useSuites.js`

### Quick Integration Steps
1. Install axios: `npm install axios`
2. Create API service layer
3. Replace placeholder functions in `useSuites.js`
4. Configure environment variables
5. Test all endpoints

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Environment Variables
Create `.env` file:
```env
REACT_APP_API_BASE_URL=http://localhost:3000/api/v1
REACT_APP_ENVIRONMENT=development
```

## 🔧 Customization

### Adding New Themes
Modify the CSS variables in `src/index.css` to create custom color schemes.

### Extending Test Schema
Update the validation rules in form components to support additional fields.

### Styling Components
All components use Tailwind CSS classes and can be customized by modifying the component files.

### Adding New Test Types
1. Create new component in `src/components/tests/`
2. Add new tab to `TestsPage.jsx`
3. Update `useSuites.js` with new API functions

## 📚 Documentation

- **Project Summary**: `PROJECT_SUMMARY.md` - Complete project overview
- **Backend Integration Guide**: `docs/BACKEND_INTEGRATION_GUIDE.md` - Detailed integration instructions
- **API Documentation**: `docs/API_DOCUMENTATION.md` - Complete API specifications
- **Development Setup**: `docs/DEVELOPMENT_SETUP.md` - Development environment guide
- **Component Documentation**: Inline comments in component files

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.