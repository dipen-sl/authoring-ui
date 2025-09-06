import React, { createContext, useContext, useReducer, useEffect } from 'react'

// Test context for managing CRUD operations
const TestContext = createContext()

// Test reducer for state management
const testReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_TESTS':
      return {
        ...state,
        tests: action.payload,
        loading: false
      }
    case 'ADD_TEST':
      return {
        ...state,
        tests: [...state.tests, action.payload],
        currentTest: action.payload
      }
    case 'UPDATE_TEST':
      return {
        ...state,
        tests: state.tests.map(test => 
          test.id === action.payload.id ? action.payload : test
        ),
        currentTest: action.payload
      }
    case 'DELETE_TEST':
      return {
        ...state,
        tests: state.tests.filter(test => test.id !== action.payload),
        currentTest: null
      }
    case 'SET_CURRENT_TEST':
      return {
        ...state,
        currentTest: action.payload
      }
    case 'CLEAR_CURRENT_TEST':
      return {
        ...state,
        currentTest: null
      }
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      }
    default:
      return state
  }
}

// Initial state
const initialState = {
  tests: [],
  currentTest: null,
  loading: true
}

// Test provider component
export const TestProvider = ({ children }) => {
  const [state, dispatch] = useReducer(testReducer, initialState)

  // Load tests from localStorage on mount
  useEffect(() => {
    const savedTests = localStorage.getItem('authoring-textui-tests')
    if (savedTests) {
      try {
        const tests = JSON.parse(savedTests)
        dispatch({ type: 'LOAD_TESTS', payload: tests })
      } catch (error) {
        console.error('Error loading tests:', error)
        dispatch({ type: 'LOAD_TESTS', payload: [] })
      }
    } else {
      dispatch({ type: 'LOAD_TESTS', payload: [] })
    }
  }, [])

  // Save tests to localStorage whenever tests change
  useEffect(() => {
    if (!state.loading) {
      localStorage.setItem('authoring-textui-tests', JSON.stringify(state.tests))
    }
  }, [state.tests, state.loading])

  // CRUD operations
  const addTest = (testData) => {
    const newTest = {
      id: Date.now().toString(),
      ...testData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    dispatch({ type: 'ADD_TEST', payload: newTest })
    return newTest
  }

  const updateTest = (testData) => {
    const updatedTest = {
      ...testData,
      updatedAt: new Date().toISOString()
    }
    dispatch({ type: 'UPDATE_TEST', payload: updatedTest })
    return updatedTest
  }

  const deleteTest = (testId) => {
    dispatch({ type: 'DELETE_TEST', payload: testId })
  }

  const setCurrentTest = (test) => {
    dispatch({ type: 'SET_CURRENT_TEST', payload: test })
  }

  const clearCurrentTest = () => {
    dispatch({ type: 'CLEAR_CURRENT_TEST' })
  }

  const getTestById = (testId) => {
    return state.tests.find(test => test.id === testId)
  }

  const value = {
    ...state,
    addTest,
    updateTest,
    deleteTest,
    setCurrentTest,
    clearCurrentTest,
    getTestById
  }

  return (
    <TestContext.Provider value={value}>
      {children}
    </TestContext.Provider>
  )
}

// Custom hook to use test context
export const useTests = () => {
  const context = useContext(TestContext)
  if (!context) {
    throw new Error('useTests must be used within a TestProvider')
  }
  return context
}
