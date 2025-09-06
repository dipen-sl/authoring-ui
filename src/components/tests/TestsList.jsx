import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Edit2, Trash2, Play, FileText, Video, FileSpreadsheet, Calendar, Clock } from 'lucide-react'
import { useTestOperations } from '../../hooks/useSuites'
import EditTestModal from './EditTestModal'
import DeleteTestModal from './DeleteTestModal'

/**
 * Tests list component for displaying and managing tests within a suite
 */
const TestsList = ({ suiteId, onTestEdit }) => {
  const { tests, loading, error, fetchTestsBySuite, deleteTest } = useTestOperations()
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedTest, setSelectedTest] = useState(null)

  // Load tests when suite changes
  useEffect(() => {
    if (suiteId) {
      console.log('TestsList: Loading tests for suite:', suiteId)
      fetchTestsBySuite(suiteId)
    }
  }, [suiteId, fetchTestsBySuite])

  // Handle test edit
  const handleEditTest = (test) => {
    setSelectedTest(test)
    setShowEditModal(true)
  }

  // Handle test delete
  const handleDeleteTest = (test) => {
    setSelectedTest(test)
    setShowDeleteModal(true)
  }

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (selectedTest) {
      try {
        await deleteTest(selectedTest.id)
        setShowDeleteModal(false)
        setSelectedTest(null)
      } catch (error) {
        console.error('Failed to delete test:', error)
      }
    }
  }

  // Get test type icon
  const getTestTypeIcon = (type) => {
    switch (type) {
      case 'manual':
        return <FileText className="h-4 w-4" />
      case 'csv':
        return <FileSpreadsheet className="h-4 w-4" />
      case 'video':
        return <Video className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  // Get test type color
  const getTestTypeColor = (type) => {
    switch (type) {
      case 'manual':
        return 'text-blue-500 bg-blue-500/10'
      case 'csv':
        return 'text-green-500 bg-green-500/10'
      case 'video':
        return 'text-purple-500 bg-purple-500/10'
      default:
        return 'text-gray-500 bg-gray-500/10'
    }
  }

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Format time for display
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    console.log('TestsList: Currently loading tests...')
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3 text-muted-foreground">Loading tests...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
        <p className="text-destructive font-medium">Error loading tests: {error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Test Cases</h2>
          <p className="text-muted-foreground mt-1">
            {tests.length} test{tests.length !== 1 ? 's' : ''} in this suite
          </p>
        </div>
      </div>

      {/* Tests List */}
      {console.log('TestsList: Rendering with tests:', tests.length, tests)}
      {tests.length === 0 ? (
        <div className="bg-muted/50 border border-border rounded-lg p-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No test cases yet</h3>
          <p className="text-muted-foreground">
            Create your first test case using the tabs above
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {tests.map((test, index) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover:border-primary/50"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Test Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${getTestTypeColor(test.type)}`}>
                      {getTestTypeIcon(test.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        {test.test_title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="font-mono bg-muted px-2 py-1 rounded text-xs">
                          {test.test_id}
                        </span>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(test.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatTime(test.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Test Description */}
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {test.test_description}
                  </p>

                  {/* Assertion */}
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Assertion/Expected Result:</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {test.assertion}
                    </p>
                  </div>

                  {/* Video-specific info */}
                  {test.type === 'video' && (
                    <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Video className="h-4 w-4 text-purple-500" />
                        <span className="text-sm font-medium text-purple-500">Video Test</span>
                      </div>
                      {test.transcription_status === 'processing' ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
                          <span className="text-sm text-purple-600">Processing transcription...</span>
                        </div>
                      ) : test.video_file ? (
                        <p className="text-sm text-purple-600">Video: {test.video_file}</p>
                      ) : null}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleEditTest(test)}
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                    title="Edit test"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTest(test)}
                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                    title="Delete test"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modals */}
      <EditTestModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setSelectedTest(null)
        }}
        test={selectedTest}
        onTestUpdated={onTestEdit}
      />

      <DeleteTestModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedTest(null)
        }}
        test={selectedTest}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}

export default TestsList
