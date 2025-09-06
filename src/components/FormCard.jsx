import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import TextField from './TextField'
import FileUpload from './FileUpload'
import ModeToggle from './ModeToggle'
import TestList from './TestList'
import ThemeToggle from './ThemeToggle'
import { useTests } from '../context/TestContext'
import { Send, RotateCcw, Sparkles, List, Plus } from 'lucide-react'

/**
 * Main form card component that orchestrates input modes and form handling
 * Manages state for manual input vs file upload modes
 */
const FormCard = () => {
  const [mode, setMode] = useState('manual')
  const [fileError, setFileError] = useState(null)
  const [showTestList, setShowTestList] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingTestId, setEditingTestId] = useState(null)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  
  const { addTest, updateTest, getTestById } = useTests()
  
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    clearErrors,
    formState: { errors }
  } = useForm({
    mode: 'onSubmit', // Only validate on submit, not on change or blur
    reValidateMode: 'onSubmit', // Only re-validate on submit
    defaultValues: {
      testName: '',
      url: '',
      description: '',
      assertion: ''
    }
  })

  // Handle form submission
  const onSubmit = (data) => {
    console.log('Form submitted with data:', data)
    setHasSubmitted(true)
    
    if (isEditing && editingTestId) {
      updateTest({ ...data, id: editingTestId })
      setIsEditing(false)
      setEditingTestId(null)
    } else {
      addTest(data)
    }
    
    reset()
    setFileError(null)
    setHasSubmitted(false) // Reset after successful submission
  }

  // Handle form reset
  const handleClear = () => {
    reset()
    clearErrors()
    setFileError(null)
    setIsEditing(false)
    setEditingTestId(null)
    setHasSubmitted(false)
  }

  // Handle file upload success
  const handleFileUpload = (parsedData) => {
    setValue('testName', parsedData.testName || '')
    setValue('url', parsedData.url || '')
    setValue('description', parsedData.description || '')
    setValue('assertion', parsedData.assertion || '')
    clearErrors() // Clear any existing validation errors when file is uploaded
  }

  // Handle bulk file upload
  const handleBulkUpload = (tests) => {
    tests.forEach(test => addTest(test))
    setFileError(null)
  }

  // Handle file upload error
  const handleFileError = (error) => {
    setFileError(error)
  }

  // Handle mode change
  const handleModeChange = (newMode) => {
    setMode(newMode)
    setFileError(null)
    clearErrors() // Clear form validation errors when switching modes
    setHasSubmitted(false) // Reset submission state when switching modes
  }

  // Handle test selection for editing
  const handleEditTest = (test) => {
    setValue('testName', test.testName)
    setValue('url', test.url)
    setValue('description', test.description)
    setValue('assertion', test.assertion)
    clearErrors() // Clear any existing validation errors
    setIsEditing(true)
    setEditingTestId(test.id)
    setShowTestList(false)
    setMode('manual')
  }

  // Handle test selection for loading
  const handleSelectTest = (test) => {
    setValue('testName', test.testName)
    setValue('url', test.url)
    setValue('description', test.description)
    setValue('assertion', test.assertion)
    clearErrors() // Clear any existing validation errors
    setShowTestList(false)
    setMode('manual')
  }

  // Manual input fields
  const manualInputFields = (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextField
          label="Test Name"
          name="testName"
          placeholder="e.g., Login Flow Test"
          register={register}
          error={errors.testName?.message}
          required
          showError={hasSubmitted}
        />
        
        <TextField
          label="Target Website URL"
          name="url"
          placeholder="https://example.com"
          register={register}
          error={errors.url?.message}
          required
          type="url"
          showError={hasSubmitted}
        />
      </div>
      
      <TextField
        label="Test Description"
        name="description"
        placeholder="Describe the test steps in natural language. Be specific about user actions, expected behavior, and any conditions that need to be met..."
        register={register}
        error={errors.description?.message}
        required
        isTextarea
        showError={hasSubmitted}
      />
      
      <TextField
        label="Assertion/Expected Output"
        name="assertion"
        placeholder="Define what determines if the test passes or fails. Include specific elements, text, or behaviors that should be present..."
        register={register}
        error={errors.assertion?.message}
        required
        isTextarea
        showError={hasSubmitted}
      />
    </div>
  )

  // File upload component
  const fileUploadComponent = (
    <FileUpload
      onFileUpload={handleFileUpload}
      onBulkUpload={handleBulkUpload}
      error={fileError}
      onError={handleFileError}
    />
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen flex flex-col"
    >
      {/* Header */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 max-w-6xl mx-auto w-full">
        <div className="text-center mb-12">
          {/* Theme Toggle */}
          <div className="flex justify-end mb-6">
            <ThemeToggle />
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            trathensition={{ delay: 0.2, duration: 0.6 }}
            className="flex items-center justify-center mb-6"
          >
            <Sparkles className="h-8 w-8 text-primary mr-3" />
            <h1 className="ai-heading text-6xl md:text-7xl font-bold !text-6xl md:!text-7xl">
              Test Authoring Tool
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl text-muted-foreground font-medium"
          >
            Create and manage your test cases with AI-powered precision
          </motion.p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center mb-8">
          <div className="ai-tabs flex gap-1">
            <button
              type="button"
              onClick={() => {
                setShowTestList(false)
                clearErrors() // Clear validation errors when switching to create mode
                setHasSubmitted(false) // Reset submission state
              }}
              className={`ai-tab ${!showTestList ? 'active' : ''}`}
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Test
            </button>
            <button
              type="button"
              onClick={() => {
                setShowTestList(true)
                clearErrors() // Clear validation errors when switching to manage mode
                setHasSubmitted(false) // Reset submission state
              }}
              className={`ai-tab ${showTestList ? 'active' : ''}`}
            >
              <List className="h-5 w-5 mr-2" />
              Manage Tests
            </button>
          </div>
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="w-full"
        >
          {showTestList ? (
            <TestList 
              onEditTest={handleEditTest}
              onSelectTest={handleSelectTest}
            />
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-6">
                <ModeToggle
                  activeMode={mode}
                  onModeChange={handleModeChange}
                >
                  {{
                    manual: manualInputFields,
                    file: fileUploadComponent
                  }}
                </ModeToggle>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8">
                <button
                  type="submit"
                  className="ai-button flex-1 sm:flex-none px-8 py-4 text-white font-semibold text-lg flex items-center justify-center"
                >
                  <Send className="h-5 w-5 mr-3" />
                  {isEditing ? 'Update Test' : 'Create Test'}
                </button>
                
                <button
                  type="button"
                  onClick={handleClear}
                  className="ai-button-secondary flex-1 sm:flex-none px-8 py-4 font-semibold text-lg flex items-center justify-center"
                >
                  <RotateCcw className="h-5 w-5 mr-3" />
                  Clear All
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default FormCard
