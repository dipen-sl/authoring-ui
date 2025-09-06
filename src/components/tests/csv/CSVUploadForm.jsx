import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, Download, FileText, CheckCircle, AlertCircle, X } from 'lucide-react'
import { useTestOperations } from '../../../hooks/useSuites'
import { validateCSVFile, downloadCSVTemplate, parseCSV } from '../../../utils/csvParser'

/**
 * CSV upload form component for bulk test creation
 */
const CSVUploadForm = ({ suiteId, onTestsCreated, onAutoFill }) => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewData, setPreviewData] = useState([])
  const [validationResult, setValidationResult] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)
  const { uploadCsv } = useTestOperations()

  // Handle file selection
  const handleFileSelect = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setSelectedFile(file)
    setError(null)
    setValidationResult(null)
    setPreviewData([])

    try {
      setIsProcessing(true)
      
      // Validate file
      const validation = await validateCSVFile(file)
      setValidationResult(validation)

      if (validation.isValid) {
        // Parse CSV and show preview
        const data = await parseCSV(file)
        setPreviewData(data)
      }
    } catch (err) {
      setError(err.message || 'Failed to process CSV file')
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle file removal
  const handleRemoveFile = () => {
    setSelectedFile(null)
    setPreviewData([])
    setValidationResult(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Handle CSV upload
  const handleUpload = async () => {
    if (!selectedFile || !validationResult?.isValid) return

    try {
      setIsUploading(true)
      setError(null)
      
      const newTests = await uploadCsv(suiteId, selectedFile)
      
      // Reset form
      handleRemoveFile()
      
      // Notify parent component
      if (onTestsCreated) {
        onTestsCreated(newTests)
      }
    } catch (err) {
      setError(err.message || 'Failed to upload CSV')
    } finally {
      setIsUploading(false)
    }
  }

  // Handle template download
  const handleDownloadTemplate = () => {
    downloadCSVTemplate()
  }

  // Handle auto-fill manual form
  const handleAutoFill = () => {
    if (previewData.length > 0 && onAutoFill) {
      // Use the first test from the CSV for auto-fill
      const firstTest = previewData[0]
      onAutoFill({
        test_id: firstTest.test_id,
        test_title: firstTest.test_title,
        test_description: firstTest.test_description,
        assertion: firstTest.assertion
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-foreground mb-2">Upload CSV Tests</h3>
        <p className="text-muted-foreground">
          Bulk import test cases from a CSV file
        </p>
      </div>

      {/* Template Download */}
      <div className="bg-muted/50 border border-border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-foreground mb-1">Need a template?</h4>
            <p className="text-sm text-muted-foreground">
              Download our CSV template to get started
            </p>
          </div>
          <button
            onClick={handleDownloadTemplate}
            className="ai-button-secondary px-4 py-2 flex items-center gap-2 text-sm"
          >
            <Download className="h-4 w-4" />
            Download Template
          </button>
        </div>
      </div>

      {/* File Upload Area */}
      <div className="space-y-4">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            selectedFile
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50 hover:bg-muted/50'
          }`}
        >
          {!selectedFile ? (
            <div className="space-y-4">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <h4 className="font-medium text-foreground mb-2">Upload CSV File</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Drag and drop your CSV file here, or click to browse
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="csv-upload"
                />
                <label
                  htmlFor="csv-upload"
                  className="ai-button px-6 py-3 cursor-pointer inline-flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Choose CSV File
                </label>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <FileText className="h-12 w-12 text-primary mx-auto" />
              <div>
                <h4 className="font-medium text-foreground mb-2">{selectedFile.name}</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
                <button
                  onClick={handleRemoveFile}
                  className="ai-button-secondary px-4 py-2 flex items-center gap-2 text-sm mx-auto"
                >
                  <X className="h-4 w-4" />
                  Remove File
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="flex items-center justify-center gap-3 py-4">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            <span className="text-muted-foreground">Processing CSV file...</span>
          </div>
        )}

        {/* Validation Results */}
        {validationResult && (
          <div className="space-y-3">
            {!validationResult.isValid ? (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-destructive mb-2">Validation Errors</h4>
                    <ul className="text-sm text-destructive space-y-1">
                      {validationResult.errors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-green-500 mb-1">File Valid</h4>
                    <p className="text-sm text-green-600">
                      Found {previewData.length} test cases ready to import
                    </p>
                    {validationResult.warnings.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-yellow-600 mb-1">Warnings:</p>
                        <ul className="text-sm text-yellow-600 space-y-1">
                          {validationResult.warnings.map((warning, index) => (
                            <li key={index}>• {warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Preview Table */}
        {previewData.length > 0 && (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="p-4 border-b border-border">
              <h4 className="font-medium text-foreground">Preview ({previewData.length} tests)</h4>
              <p className="text-sm text-muted-foreground">Review the tests before importing</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Test ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Test Title</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Test Description</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Assertion/Expected Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {previewData.slice(0, 5).map((test, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm text-foreground font-mono">{test.test_id}</td>
                      <td className="px-4 py-3 text-sm text-foreground">{test.test_title}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground max-w-xs truncate">
                        {test.test_description}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground max-w-xs truncate">
                        {test.assertion}
                      </td>
                    </tr>
                  ))}
                  {previewData.length > 5 && (
                    <tr>
                      <td colSpan="4" className="px-4 py-3 text-sm text-muted-foreground text-center">
                        ... and {previewData.length - 5} more tests
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-destructive mb-1">Upload Error</h4>
                <p className="text-sm text-destructive">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {selectedFile && validationResult?.isValid && (
          <div className="flex justify-center gap-4 pt-4">
            <button
              onClick={handleAutoFill}
              className="ai-button-secondary px-8 py-4 flex items-center gap-3 text-lg font-semibold"
            >
              <Upload className="h-5 w-5" />
              Auto-Fill Manual Form
            </button>
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="ai-button px-8 py-4 flex items-center gap-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Uploading {previewData.length} Tests...
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5" />
                  Upload {previewData.length} Tests
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default CSVUploadForm
