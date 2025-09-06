import { useState, useEffect, useCallback } from 'react'

// Mock data for suites
const mockSuites = [
  {
    id: 'suite-1',
    suite_name: 'Login Flow Tests',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z',
    test_count: 5
  },
  {
    id: 'suite-2', 
    suite_name: 'E-commerce Checkout',
    created_at: '2024-01-14T14:20:00Z',
    updated_at: '2024-01-14T14:20:00Z',
    test_count: 8
  },
  {
    id: 'suite-3',
    suite_name: 'API Endpoint Tests',
    created_at: '2024-01-13T09:15:00Z',
    updated_at: '2024-01-13T09:15:00Z',
    test_count: 12
  }
]

// Mock data for tests by suite
const mockTests = {
  'suite-1': [
    {
      id: 'test-1-1',
      test_id: 'LOGIN_001',
      test_title: 'Valid Login',
      test_description: 'Test successful login with valid credentials',
      assertion: 'User should be redirected to dashboard',
      type: 'manual',
      created_at: '2024-01-15T10:35:00Z',
      updated_at: '2024-01-15T10:35:00Z'
    },
    {
      id: 'test-1-2',
      test_id: 'LOGIN_002',
      test_title: 'Invalid Login',
      test_description: 'Test login with invalid credentials',
      assertion: 'Error message should be displayed',
      type: 'manual',
      created_at: '2024-01-15T10:40:00Z',
      updated_at: '2024-01-15T10:40:00Z'
    }
  ],
  'suite-2': [
    {
      id: 'test-2-1',
      test_id: 'CHECKOUT_001',
      test_title: 'Add to Cart',
      test_description: 'Test adding product to cart',
      assertion: 'Product should appear in cart',
      type: 'csv',
      created_at: '2024-01-14T14:25:00Z',
      updated_at: '2024-01-14T14:25:00Z'
    }
  ],
  'suite-3': [
    {
      id: 'test-3-1',
      test_id: 'API_001',
      test_title: 'GET Users Endpoint',
      test_description: 'Test GET /api/users endpoint',
      assertion: 'Should return 200 status with users array',
      type: 'video',
      created_at: '2024-01-13T09:20:00Z',
      updated_at: '2024-01-13T09:20:00Z'
    }
  ]
}

// Generate UUID for new suites/tests
const generateId = () => `suite-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

/**
 * Custom hook for managing test suites
 * TODO: Replace with backend API calls
 */
export const useSuites = () => {
  const [suites, setSuites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  /**
   * Get all test suites with dynamic test counts
   * TODO: Replace with backend API call
   */
  const getSuites = useCallback(async () => {
    try {
      setError(null)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const savedSuites = localStorage.getItem('authoring-textui-suites')
      let suitesData = savedSuites ? JSON.parse(savedSuites) : mockSuites
      
      // Get test counts from localStorage
      const savedTests = localStorage.getItem('authoring-textui-tests')
      let allTests = []
      
      if (savedTests) {
        allTests = JSON.parse(savedTests)
      } else {
        // Initialize with mock data
        allTests = Object.entries(mockTests).flatMap(([suiteId, tests]) => 
          tests.map(test => ({ ...test, suite_id: suiteId }))
        )
        localStorage.setItem('authoring-textui-tests', JSON.stringify(allTests))
      }
      
      // Update test counts dynamically
      suitesData = suitesData.map(suite => ({
        ...suite,
        test_count: allTests.filter(test => test.suite_id === suite.id).length
      }))
      
      setSuites(suitesData)
      return suitesData
    } catch (err) {
      setError('Failed to fetch suites')
      throw err
    }
  }, [])

  // Load suites from localStorage or use mock data
  useEffect(() => {
    const loadSuites = async () => {
      try {
        setLoading(true)
        await getSuites()
      } catch (err) {
        setError('Failed to load suites')
        console.error('Error loading suites:', err)
      } finally {
        setLoading(false)
      }
    }

    loadSuites()
  }, [])

  // Save suites to localStorage whenever suites change
  useEffect(() => {
    if (!loading && suites.length > 0) {
      localStorage.setItem('authoring-textui-suites', JSON.stringify(suites))
    }
  }, [suites, loading])

  /**
   * Create a new test suite
   * TODO: Replace with backend API call
   */
  const createSuite = async (suiteData) => {
    try {
      setError(null)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const newSuite = {
        id: generateId(),
        suite_name: suiteData.suite_name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        test_count: 0
      }
      
      const updatedSuites = [...suites, newSuite]
      setSuites(updatedSuites)
      return newSuite
    } catch (err) {
      setError('Failed to create suite')
      throw err
    }
  }

  /**
   * Update an existing test suite
   * TODO: Replace with backend API call
   */
  const updateSuite = async (suiteId, suiteData) => {
    try {
      setError(null)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const updatedSuites = suites.map(suite => 
        suite.id === suiteId 
          ? { ...suite, ...suiteData, updated_at: new Date().toISOString() }
          : suite
      )
      
      setSuites(updatedSuites)
      return updatedSuites.find(suite => suite.id === suiteId)
    } catch (err) {
      setError('Failed to update suite')
      throw err
    }
  }

  /**
   * Delete a test suite
   * TODO: Replace with backend API call
   */
  const deleteSuite = async (suiteId) => {
    try {
      setError(null)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const updatedSuites = suites.filter(suite => suite.id !== suiteId)
      setSuites(updatedSuites)
      
      // Also delete associated tests
      const savedTests = localStorage.getItem('authoring-textui-tests')
      if (savedTests) {
        const allTests = JSON.parse(savedTests)
        const updatedTests = allTests.filter(test => test.suite_id !== suiteId)
        localStorage.setItem('authoring-textui-tests', JSON.stringify(updatedTests))
      }
      
      // Update suite test counts
      await getSuites()
      
      return true
    } catch (err) {
      setError('Failed to delete suite')
      throw err
    }
  }

  /**
   * Get suite by ID
   * TODO: Replace with backend API call
   */
  const getSuiteById = async (suiteId) => {
    try {
      // First try to find in current state
      let suite = suites.find(s => s.id === suiteId)
      
      // If not found, try to load from localStorage
      if (!suite) {
        const savedSuites = localStorage.getItem('authoring-textui-suites')
        if (savedSuites) {
          const allSuites = JSON.parse(savedSuites)
          suite = allSuites.find(s => s.id === suiteId)
        }
        
        // If still not found, try mock data
        if (!suite) {
          suite = mockSuites.find(s => s.id === suiteId)
        }
      }
      
      if (!suite) {
        throw new Error('Suite not found')
      }
      return suite
    } catch (err) {
      setError('Failed to fetch suite')
      throw err
    }
  }

  return {
    suites,
    loading,
    error,
    getSuites,
    createSuite,
    updateSuite,
    deleteSuite,
    getSuiteById
  }
}

/**
 * Custom hook for managing tests within suites
 * TODO: Replace with backend API calls
 */
export const useTestOperations = () => {
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Generate test ID
  const generateTestId = () => `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  /**
   * Fetch tests by suite ID
   * TODO: Replace with backend API call
   */
  const fetchTestsBySuite = useCallback(async (suiteId) => {
    try {
      setLoading(true)
      setError(null)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const savedTests = localStorage.getItem('authoring-textui-tests')
      let allTests = []
      
      if (savedTests) {
        allTests = JSON.parse(savedTests)
      } else {
        // Initialize with mock data
        allTests = Object.entries(mockTests).flatMap(([suiteId, tests]) => 
          tests.map(test => ({ ...test, suite_id: suiteId }))
        )
        localStorage.setItem('authoring-textui-tests', JSON.stringify(allTests))
      }
      
      const suiteTests = allTests.filter(test => test.suite_id === suiteId)
      setTests(suiteTests)
      return suiteTests
    } catch (err) {
      setError('Failed to fetch tests')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Add a manual test to a suite
   * TODO: Replace with backend API call
   */
  const addManualTest = useCallback(async (suiteId, testData) => {
    try {
      setLoading(true)
      setError(null)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const newTest = {
        id: generateTestId(),
        suite_id: suiteId,
        test_id: testData.test_id || `TEST_${Date.now()}`,
        test_title: testData.test_title,
        test_description: testData.test_description,
        assertion: testData.assertion,
        type: 'manual',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      const savedTests = localStorage.getItem('authoring-textui-tests')
      const allTests = savedTests ? JSON.parse(savedTests) : []
      const updatedTests = [...allTests, newTest]
      
      localStorage.setItem('authoring-textui-tests', JSON.stringify(updatedTests))
      setTests(prevTests => [...prevTests, newTest])
      
      return newTest
    } catch (err) {
      setError('Failed to add manual test')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Upload CSV and create tests
   * TODO: Replace with backend API call
   */
  const uploadCsv = useCallback(async (suiteId, file) => {
    try {
      setLoading(true)
      setError(null)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Parse CSV file (this would be handled by backend)
      const csvData = await parseCSV(file)
      
      const newTests = csvData.map((row, index) => ({
        id: generateTestId(),
        suite_id: suiteId,
        test_id: row.test_id || `CSV_${Date.now()}_${index}`,
        test_title: row.test_title,
        test_description: row.test_description,
        assertion: row.assertion,
        type: 'csv',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }))
      
      const savedTests = localStorage.getItem('authoring-textui-tests')
      const allTests = savedTests ? JSON.parse(savedTests) : []
      const updatedTests = [...allTests, ...newTests]
      
      localStorage.setItem('authoring-textui-tests', JSON.stringify(updatedTests))
      setTests(prevTests => [...prevTests, ...newTests])
      
      return newTests
    } catch (err) {
      setError('Failed to upload CSV')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Upload video and create test
   * TODO: Replace with backend API call
   */
  const uploadVideo = useCallback(async (suiteId, file) => {
    try {
      setLoading(true)
      setError(null)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const newTest = {
        id: generateTestId(),
        suite_id: suiteId,
        test_id: `VIDEO_${Date.now()}`,
        test_title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
        test_description: 'Video test case - transcription pending',
        assertion: 'To be determined from video transcription',
        type: 'video',
        video_file: file.name,
        video_url: URL.createObjectURL(file), // Temporary URL for preview
        transcription_status: 'processing',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      const savedTests = localStorage.getItem('authoring-textui-tests')
      const allTests = savedTests ? JSON.parse(savedTests) : []
      const updatedTests = [...allTests, newTest]
      
      localStorage.setItem('authoring-textui-tests', JSON.stringify(updatedTests))
      setTests(prevTests => [...prevTests, newTest])
      
      return newTest
    } catch (err) {
      setError('Failed to upload video')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Update an existing test
   * TODO: Replace with backend API call
   */
  const updateTest = async (testId, testData) => {
    try {
      setLoading(true)
      setError(null)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const updatedTest = {
        ...testData,
        id: testId,
        updated_at: new Date().toISOString()
      }
      
      const savedTests = localStorage.getItem('authoring-textui-tests')
      const allTests = savedTests ? JSON.parse(savedTests) : []
      const updatedTests = allTests.map(test => 
        test.id === testId ? updatedTest : test
      )
      
      localStorage.setItem('authoring-textui-tests', JSON.stringify(updatedTests))
      setTests(tests.map(test => test.id === testId ? updatedTest : test))
      
      return updatedTest
    } catch (err) {
      setError('Failed to update test')
      throw err
    } finally {
      setLoading(false)
    }
  }

  /**
   * Delete a test
   * TODO: Replace with backend API call
   */
  const deleteTest = async (testId) => {
    try {
      setLoading(true)
      setError(null)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const savedTests = localStorage.getItem('authoring-textui-tests')
      const allTests = savedTests ? JSON.parse(savedTests) : []
      const updatedTests = allTests.filter(test => test.id !== testId)
      
      localStorage.setItem('authoring-textui-tests', JSON.stringify(updatedTests))
      setTests(prevTests => prevTests.filter(test => test.id !== testId))
      
      return true
    } catch (err) {
      setError('Failed to delete test')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    tests,
    loading,
    error,
    fetchTestsBySuite,
    addManualTest,
    uploadCsv,
    uploadVideo,
    updateTest,
    deleteTest
  }
}

// Helper function to parse CSV (placeholder)
const parseCSV = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target.result
        const lines = text.split('\n')
        const headers = lines[0].split(',').map(h => h.trim())
        const data = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim())
          const obj = {}
          headers.forEach((header, index) => {
            obj[header] = values[index] || ''
          })
          return obj
        }).filter(row => row.test_id) // Filter out empty rows
        
        resolve(data)
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = reject
    reader.readAsText(file)
  })
}
