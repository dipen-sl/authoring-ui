import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, AlertTriangle, FileText, Video, FileSpreadsheet } from 'lucide-react'

/**
 * Modal for confirming test deletion
 */
const DeleteTestModal = ({ isOpen, onClose, test, onConfirm }) => {
  const [isDeleting, setIsDeleting] = useState(false)

  // Handle delete confirmation
  const handleConfirm = async () => {
    try {
      setIsDeleting(true)
      await onConfirm()
    } catch (error) {
      console.error('Failed to delete test:', error)
    } finally {
      setIsDeleting(false)
    }
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
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-card border border-border rounded-lg shadow-xl max-w-md w-full mx-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Delete Test</h2>
                  <p className="text-sm text-muted-foreground">This action cannot be undone</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-6">
                <p className="text-foreground mb-4">
                  Are you sure you want to delete this test case?
                </p>
                
                {/* Test Info */}
                <div className="bg-muted/50 border border-border rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {getTestTypeIcon(test.type)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{test.test_title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {getTestTypeLabel(test.type)} • {test.test_id}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {test.test_description}
                  </p>
                </div>

                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-destructive font-medium text-sm mb-1">Warning</p>
                      <p className="text-destructive text-sm">
                        This will permanently delete the test case and all associated data.
                        This action cannot be undone.
                      </p>
                      {test.type === 'video' && test.video_file && (
                        <p className="text-destructive text-sm mt-2">
                          This includes the video file: {test.video_file}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 ai-button-secondary py-3 px-4 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={isDeleting}
                  className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground py-3 px-4 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      Delete Test
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default DeleteTestModal
