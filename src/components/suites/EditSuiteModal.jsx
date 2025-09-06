import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, Edit } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useSuites } from '../../hooks/useSuites'
import TextField from '../TextField'

/**
 * Modal for editing an existing test suite
 */
const EditSuiteModal = ({ isOpen, onClose, suite }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const { updateSuite } = useSuites()

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors }
  } = useForm({
    defaultValues: {
      suite_name: ''
    }
  })

  // Reset form when suite changes
  useEffect(() => {
    if (suite) {
      reset({
        suite_name: suite.suite_name
      })
    }
  }, [suite, reset])

  // Handle form submission
  const onSubmit = async (data) => {
    if (!suite) return

    try {
      setIsSubmitting(true)
      setError(null)
      
      await updateSuite(suite.id, data)
      
      // Close modal
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to update suite')
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

  return (
    <AnimatePresence>
      {isOpen && suite && (
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
            className="relative bg-card border border-border rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Edit className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Edit Test Suite</h2>
                  <p className="text-sm text-muted-foreground">Update suite information</p>
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

              <TextField
                label="Suite Name"
                name="suite_name"
                placeholder="e.g., Login Flow Tests, E-commerce Checkout"
                register={register}
                error={errors.suite_name?.message}
                required
                showError={true}
              />

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
                      Update Suite
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

export default EditSuiteModal
