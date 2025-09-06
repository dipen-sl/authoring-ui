import React, { useRef, useState } from 'react'
import { Upload, File, AlertCircle, Folder, CheckCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Enhanced file upload component with bulk folder upload and test selection
 * Handles JSON and YAML file parsing with multiple test support
 * @param {function} onFileUpload - Callback when file is successfully parsed
 * @param {function} onBulkUpload - Callback when multiple tests are uploaded
 * @param {string} error - Error message to display
 * @param {function} onError - Callback when file parsing fails
 */
const FileUpload = ({ onFileUpload, onBulkUpload, error, onError }) => {
  const fileInputRef = useRef(null)
  const folderInputRef = useRef(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [fileName, setFileName] = useState('')
  const [uploadedTests, setUploadedTests] = useState([])
  const [selectedTests, setSelectedTests] = useState([])
  const [isBulkMode, setIsBulkMode] = useState(false)

  // Handle file parsing for both JSON and YAML
  const parseFile = async (file) => {
    const fileExtension = file.name.split('.').pop().toLowerCase()
    
    if (!['json', 'yaml', 'yml'].includes(fileExtension)) {
      throw new Error('Please upload a JSON or YAML file')
    }

    const text = await file.text()
    let parsedData

    try {
      if (fileExtension === 'json') {
        parsedData = JSON.parse(text)
      } else {
        // Import js-yaml dynamically to avoid SSR issues
        const yaml = await import('js-yaml')
        parsedData = yaml.load(text)
      }

      // Handle both single test and array of tests
      const tests = Array.isArray(parsedData) ? parsedData : [parsedData]
      
      // Validate each test
      const validatedTests = tests.map((test, index) => {
        const requiredFields = ['testName', 'url', 'description', 'assertion']
        const missingFields = requiredFields.filter(field => !test[field])
        
        if (missingFields.length > 0) {
          throw new Error(`Test ${index + 1}: Missing required fields: ${missingFields.join(', ')}`)
        }

        return {
          ...test,
          id: `${file.name}-${index}`,
          fileName: file.name
        }
      })

      return validatedTests
    } catch (parseError) {
      throw new Error(`Failed to parse file: ${parseError.message}`)
    }
  }

  // Handle folder upload
  const handleFolderUpload = async (files) => {
    const fileArray = Array.from(files)
    const testFiles = fileArray.filter(file => 
      ['json', 'yaml', 'yml'].includes(file.name.split('.').pop().toLowerCase())
    )

    if (testFiles.length === 0) {
      onError('No valid test files found in the folder')
      return
    }

    try {
      const allTests = []
      
      for (const file of testFiles) {
        const tests = await parseFile(file)
        allTests.push(...tests)
      }

      setUploadedTests(allTests)
      setSelectedTests(allTests.map(test => test.id))
      setIsBulkMode(true)
      onError(null)
    } catch (err) {
      onError(err.message)
    }
  }

  // Handle file selection
  const handleFileSelect = async (file) => {
    if (!file) return

    try {
      const tests = await parseFile(file)
      
      if (tests.length === 1) {
        // Single test - use original behavior
        setFileName(file.name)
        onFileUpload(tests[0])
        onError(null)
      } else {
        // Multiple tests - use bulk mode
        setUploadedTests(tests)
        setSelectedTests(tests.map(test => test.id))
        setIsBulkMode(true)
        onError(null)
      }
    } catch (err) {
      onError(err.message)
      setFileName('')
    }
  }

  // Handle file input change
  const handleFileInputChange = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  // Handle folder input change
  const handleFolderInputChange = (event) => {
    const files = event.target.files
    if (files && files.length > 0) {
      handleFolderUpload(files)
    }
  }

  // Handle drag and drop
  const handleDragOver = (event) => {
    event.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (event) => {
    event.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setIsDragOver(false)
    
    const files = event.dataTransfer.files
    if (files && files.length > 0) {
      if (files.length === 1) {
        handleFileSelect(files[0])
      } else {
        handleFolderUpload(files)
      }
    }
  }

  // Handle click to upload
  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  // Handle folder upload click
  const handleFolderClick = () => {
    folderInputRef.current?.click()
  }

  // Handle test selection
  const toggleTestSelection = (testId) => {
    setSelectedTests(prev => 
      prev.includes(testId) 
        ? prev.filter(id => id !== testId)
        : [...prev, testId]
    )
  }

  // Handle select all
  const selectAllTests = () => {
    setSelectedTests(uploadedTests.map(test => test.id))
  }

  // Handle deselect all
  const deselectAllTests = () => {
    setSelectedTests([])
  }

  // Handle bulk upload
  const handleBulkUpload = () => {
    const selectedTestData = uploadedTests.filter(test => selectedTests.includes(test.id))
    onBulkUpload(selectedTestData)
    setUploadedTests([])
    setSelectedTests([])
    setIsBulkMode(false)
  }

  // Reset bulk mode
  const resetBulkMode = () => {
    setUploadedTests([])
    setSelectedTests([])
    setIsBulkMode(false)
    setFileName('')
  }

  // Bulk mode - show test selection
  if (isBulkMode) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold text-foreground">
            Select Tests to Import ({uploadedTests.length} found)
          </h3>
          <button
            onClick={resetBulkMode}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={selectAllTests}
            className="ai-button-secondary px-4 py-2 text-sm"
          >
            Select All
          </button>
          <button
            onClick={deselectAllTests}
            className="ai-button-secondary px-4 py-2 text-sm"
          >
            Deselect All
          </button>
          <span className="text-muted-foreground text-sm">
            {selectedTests.length} of {uploadedTests.length} selected
          </span>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {uploadedTests.map((test) => (
            <div
              key={test.id}
              className={cn(
                "p-4 rounded-lg border transition-all cursor-pointer",
                selectedTests.includes(test.id)
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:bg-accent"
              )}
              onClick={() => toggleTestSelection(test.id)}
            >
              <div className="flex items-center space-x-3">
                <div className={cn(
                  "w-5 h-5 rounded border-2 flex items-center justify-center",
                  selectedTests.includes(test.id)
                    ? "border-primary bg-primary"
                    : "border-muted-foreground"
                )}>
                  {selectedTests.includes(test.id) && (
                    <CheckCircle className="h-3 w-3 text-primary-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground truncate">{test.testName}</h4>
                  <p className="text-sm text-muted-foreground truncate">{test.url}</p>
                  <p className="text-xs text-muted-foreground">{test.fileName}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={handleBulkUpload}
            disabled={selectedTests.length === 0}
            className="ai-button px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Import {selectedTests.length} Test{selectedTests.length !== 1 ? 's' : ''}
          </button>
          <button
            onClick={resetBulkMode}
            className="ai-button-secondary px-6 py-3"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div
        className={cn(
          "border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300",
          isDragOver 
            ? "border-primary bg-primary/10 scale-[1.02]" 
            : "border-border hover:border-primary/60 hover:bg-accent/50",
          error && "border-destructive bg-destructive/5"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center space-y-6">
          <div className="p-6 rounded-full bg-primary/10 border border-primary/30">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          
          <div className="space-y-3">
            <h3 className="text-2xl font-semibold text-foreground">
              {fileName ? 'File uploaded successfully' : 'Upload test files'}
            </h3>
            <p className="text-lg text-muted-foreground">
              {fileName 
                ? `Selected: ${fileName}` 
                : 'Drag and drop files or folders here, or click to browse'
              }
            </p>
          </div>

          {fileName && (
            <div className="flex items-center space-x-3 text-lg text-primary">
              <File className="h-5 w-5" />
              <span className="font-semibold">File ready for processing</span>
            </div>
          )}

          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={handleUploadClick}
              className="ai-button-secondary px-6 py-3 text-lg font-semibold flex items-center space-x-2"
            >
              <Upload className="h-5 w-5" />
              <span>Choose Files</span>
            </button>
            <button
              type="button"
              onClick={handleFolderClick}
              className="ai-button-secondary px-6 py-3 text-lg font-semibold flex items-center space-x-2"
            >
              <Folder className="h-5 w-5" />
              <span>Choose Folder</span>
            </button>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.yaml,.yml"
        onChange={handleFileInputChange}
        className="hidden"
      />
      
      <input
        ref={folderInputRef}
        type="file"
        webkitdirectory="true"
        directory=""
        multiple
        onChange={handleFolderInputChange}
        className="hidden"
      />

      {error && (
        <div className="flex items-center space-x-3 text-lg text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <AlertCircle className="h-5 w-5" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      <div className="text-sm text-muted-foreground">
        <p className="font-semibold mb-3 text-foreground text-lg">Expected file format:</p>
        <pre className="bg-muted border border-border p-4 rounded-lg text-left overflow-x-auto code-font text-sm text-foreground">
{`{
  "testName": "Login Test",
  "url": "https://example.com",
  "description": "User should be able to login",
  "assertion": "Welcome message is displayed"
}`}
        </pre>
      </div>
    </div>
  )
}

export default FileUpload
