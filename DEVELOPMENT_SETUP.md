# Development Setup Guide

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **Git**

## Initial Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Authoring_TextUI_2
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Development Workflow

### Project Structure Overview

```
Authoring_TextUI_2/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── suites/         # Test suite management
│   │   └── tests/          # Test management
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page components
│   ├── utils/              # Utility functions
│   ├── context/            # React contexts
│   └── config/             # Configuration files
├── assets/                 # Static assets
├── docs/                   # Documentation
└── dist/                   # Build output
```

### Key Development Files

#### Core Hooks
- `src/hooks/useSuites.js` - Main API hook with placeholder functions

#### Main Components
- `src/pages/SuitesPage.jsx` - Test suites listing and management
- `src/pages/TestsPage.jsx` - Tests management within a suite
- `src/components/suites/SuiteList.jsx` - Suite listing component

#### Utility Functions
- `src/utils/csvParser.js` - CSV file parsing and validation
- `src/utils/videoUtils.js` - Video file handling and validation

## Available Scripts

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Testing
```bash
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

## Code Style and Standards

### ESLint Configuration
The project uses ESLint for code quality. Key rules:
- Use functional components with hooks
- Prefer const over let
- Use meaningful variable names
- Follow React best practices

### Component Structure
```jsx
// Standard component structure
import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useSuites } from '../hooks/useSuites'

const ComponentName = ({ prop1, prop2, onCallback }) => {
  // State declarations
  const [state, setState] = useState(initialValue)
  
  // Hook calls
  const { data, loading, error } = useSuites()
  
  // Event handlers
  const handleEvent = useCallback((param) => {
    // Handler logic
  }, [dependencies])
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies])
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="component-class"
    >
      {/* Component JSX */}
    </motion.div>
  )
}

export default ComponentName
```

## State Management

### Local State
Use `useState` for component-specific state:
```jsx
const [isOpen, setIsOpen] = useState(false)
const [data, setData] = useState([])
```

### Global State
Use React Context for shared state:
```jsx
// Theme context
const { theme, toggleTheme } = useTheme()

// Test context (legacy)
const { tests, addTest } = useTests()
```

### API State
Use custom hooks for API state management:
```jsx
const { suites, loading, error, getSuites, createSuite } = useSuites()
```

## Styling Guidelines

### Tailwind CSS
- Use utility classes for styling
- Follow mobile-first responsive design
- Use consistent spacing and colors

### Custom CSS
- Define global styles in `src/index.css`
- Use CSS variables for theming
- Avoid inline styles

### Animation
- Use Framer Motion for animations
- Keep animations subtle and purposeful
- Follow the established animation patterns

## API Integration

### Placeholder Functions
All API calls are currently placeholder functions in `useSuites.js`:
```jsx
// Example placeholder function
const getSuites = useCallback(async () => {
  // TODO: Replace with actual API call
  // return await api.get('/suites')
  
  // Current mock implementation
  return mockData
}, [])
```

### Backend Integration
When integrating with a backend:
1. Install axios: `npm install axios`
2. Create API service layer
3. Replace placeholder functions
4. Update error handling
5. Test all endpoints

## File Organization

### Component Files
- Place components in appropriate directories
- Use PascalCase for component names
- Co-locate related components

### Utility Files
- Place utilities in `src/utils/`
- Use camelCase for function names
- Export functions individually

### Hook Files
- Place custom hooks in `src/hooks/`
- Use `use` prefix for hook names
- Document hook parameters and return values

## Testing Strategy

### Unit Tests
- Test individual components
- Test utility functions
- Test custom hooks

### Integration Tests
- Test component interactions
- Test API integration
- Test user workflows

### E2E Tests
- Test complete user journeys
- Test critical business flows
- Test cross-browser compatibility

## Performance Optimization

### React Performance
- Use `useCallback` for event handlers
- Use `useMemo` for expensive calculations
- Avoid unnecessary re-renders

### Bundle Optimization
- Code splitting with React.lazy
- Dynamic imports for heavy components
- Optimize asset loading

### Caching Strategy
- Implement proper caching headers
- Use React Query for server state
- Cache API responses appropriately

## Debugging

### Development Tools
- React Developer Tools
- Redux DevTools (if using Redux)
- Browser DevTools
- VS Code extensions

### Common Issues
- Infinite re-renders (check useEffect dependencies)
- Memory leaks (cleanup useEffect)
- State updates (use functional updates)

### Debugging Tips
- Use console.log strategically
- Use React DevTools Profiler
- Check network requests
- Validate component props

## Git Workflow

### Branch Naming
- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `hotfix/critical-fix` - Critical fixes
- `refactor/component-name` - Code refactoring

### Commit Messages
```
type(scope): description

feat(suites): add test suite creation modal
fix(tests): resolve CSV parsing error
refactor(components): extract reusable form component
```

### Pull Request Process
1. Create feature branch
2. Make changes with tests
3. Update documentation
4. Create pull request
5. Address review feedback
6. Merge after approval

## Environment Configuration

### Development Environment
```env
NODE_ENV=development
REACT_APP_API_BASE_URL=http://localhost:3000/api/v1
REACT_APP_ENABLE_LOGGING=true
```

### Staging Environment
```env
NODE_ENV=staging
REACT_APP_API_BASE_URL=https://staging-api.yourapp.com/api/v1
REACT_APP_ENABLE_LOGGING=true
```

### Production Environment
```env
NODE_ENV=production
REACT_APP_API_BASE_URL=https://api.yourapp.com/api/v1
REACT_APP_ENABLE_LOGGING=false
```

## Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

#### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Build Errors
```bash
# Clear cache and rebuild
npm run build -- --force
```

### Getting Help
- Check the documentation files
- Review the code comments
- Ask team members
- Check GitHub issues

## Best Practices

### Code Quality
- Write clean, readable code
- Use meaningful variable names
- Add comments for complex logic
- Follow established patterns

### Performance
- Optimize images and assets
- Use lazy loading for components
- Minimize bundle size
- Monitor performance metrics

### Security
- Validate all inputs
- Sanitize user data
- Use HTTPS in production
- Implement proper authentication

### Accessibility
- Use semantic HTML
- Add ARIA labels
- Ensure keyboard navigation
- Test with screen readers

---

This guide should help you get started with development. For more specific information, refer to the individual documentation files and inline comments in the code.
