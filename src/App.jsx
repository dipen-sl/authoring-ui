import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import SuitesPage from './pages/SuitesPage'
import TestsPage from './pages/TestsPage'
import { TestProvider } from './context/TestContext'
import { ThemeProvider } from './context/ThemeContext'
import './index.css'

/**
 * Main App component with routing
 * Handles navigation between different pages
 */
function App() {
  return (
    <ThemeProvider>
      <TestProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Legacy route - redirect to suites */}
              <Route path="/" element={<Navigate to="/suites" replace />} />
              
              {/* Original home page (kept for compatibility) */}
              <Route path="/legacy" element={<Home />} />
              
              {/* New suite-based routes */}
              <Route path="/suites" element={<SuitesPage />} />
              <Route path="/suites/:suiteId/tests" element={<TestsPage />} />
              
              {/* Catch all - redirect to suites */}
              <Route path="*" element={<Navigate to="/suites" replace />} />
            </Routes>
          </div>
        </Router>
      </TestProvider>
    </ThemeProvider>
  )
}

export default App
