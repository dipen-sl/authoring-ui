import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, FileText, Video, FileSpreadsheet } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTestOperations } from '../../hooks/useSuites'
import TextField from '../TextField'

/**
 * Modal for editing an existing test
 */
const EditTestModal = ({ isOpen, onClose, test, onTestUpdated }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const { updateTest } = useTestOperations()

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors }
  } = useForm({
    defaultValues: {
      test_id: '',
      test_title: '',
      test_description: '',
      assertion: ''
    }
  })

  // Reset form when test changes
  useEffect(() => {
    if (test) {
      reset({
        test_id: test.test_id || '',
        test_title: test.test_title || '',
        test_description: test.test_description || '',
        assertion: test.assertion || ''
      })
    }
  }, [test, reset])

  // Handle form submission
  const onSubmit = async (data) => {
    if (!test) return

    try {
      setIsSubmitting(true)
      setError(null)
      
      const updatedTest = await updateTest(test.id, data)
      
      // Notify parent component
      if (onTestUpdated) {
        onTestUpdated(updatedTest)
      }
      
      // Close modal
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to update test')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle modal close
  const handleClose = () => {
    reset()
    clearErrors()
    setError(null)
    onClose()
  }

  // Get test type icon
  const getTestTypeIcon = (type) => {
    switch (type) {
      case 'manual':
        return <FileText className="h-5 w-5" />
      case 'csv':
        return <FileSpreadsheet className="h-5 w-5" />
      case 'video':
        return <Video className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  // Get test type label
  const getTestTypeLabel = (type) => {
    switch (type) {
      case 'manual':
        return 'Manual Test'
      case 'csv':
        return 'CSV Import'
      case 'video':
        return 'Video Test'
      default:
        return 'Test'
    }
  }

  return (
    <AnimatePresence>
      {isOpen && test && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-card border border-border rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  {getTestTypeIcon(test.type)}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Edit Test</h2>
                  <p className="text-sm text-muted-foreground">{getTestTypeLabel(test.type)}</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <p className="text-destructive text-sm font-medium">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextField
                  label="Test ID"
                  name="test_id"
                  placeholder="e.g., LOGIN_001, CHECKOUT_002"
                  register={register}
                  error={errors.test_id?.message}
                  required
                  showError={true}
                />
                
                <TextField
                  label="Test Title"
                  name="test_title"
                  placeholder="e.g., Valid Login Test"
                  register={register}
                  error={errors.test_title?.message}
                  required
                  showError={true}
                />
              </div>
              
              <TextField
                label="Test Description"
                name="test_description"
                placeholder="Describe the test scenario and what you're testing..."
                register={register}
                error={errors.test_description?.message}
                required
                isTextarea
                showError={true}
              />
              
              <TextField
                label="Assertion/Expected Result"
                name="assertion"
                placeholder="Define what determines if the test passes or fails..."
                register={register}
                error={errors.assertion?.message}
                required
                isTextarea
                showError={true}
              />

              {/* Video-specific info */}
              {test.type === 'video' && (
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                  <h4 className="font-medium text-purple-500 mb-2">Video Test Information</h4>
                  <div className="space-y-2 text-sm">
                    {test.video_file && (
                      <p className="text-purple-600">
                        <strong>Video File:</strong> {test.video_file}
                      </p>
                    )}
                    {test.transcription_status && (
                      <p className="text-purple-600">
                        <strong>Transcription Status:</strong> {test.transcription_status}
                      </p>
                    )}
                    <p className="text-purple-600">
                      Note: Video files cannot be changed after upload. You can only edit the test metadata.
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 ai-button-secondary py-3 px-4 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 ai-button py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Update Test
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default EditTestModal
