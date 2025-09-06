import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Plus, Edit2, Trash2, FolderOpen, Calendar, FileText } from 'lucide-react'
import { useSuites } from '../../hooks/useSuites'
import CreateSuiteModal from './CreateSuiteModal'
import EditSuiteModal from './EditSuiteModal'
import DeleteSuiteModal from './DeleteSuiteModal'

/**
 * Suite List component for displaying and managing test suites
 */
const SuiteList = ({ onSuiteSelect }) => {
  const navigate = useNavigate()
  const { suites, loading, error, deleteSuite, getSuites } = useSuites()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedSuite, setSelectedSuite] = useState(null)

  // Handle suite selection
  const handleSuiteSelect = (suite) => {
    console.log('Suite selected:', suite)
    if (onSuiteSelect) {
      onSuiteSelect(suite)
    } else {
      // Navigate to tests page
      console.log('Navigating to:', `/suites/${suite.id}/tests`)
      navigate(`/suites/${suite.id}/tests`)
    }
  }

  // Handle edit suite
  const handleEditSuite = (suite) => {
    setSelectedSuite(suite)
    setShowEditModal(true)
  }

  // Handle delete suite
  const handleDeleteSuite = (suite) => {
    setSelectedSuite(suite)
    setShowDeleteModal(true)
  }

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (selectedSuite) {
      try {
        await deleteSuite(selectedSuite.id)
        setShowDeleteModal(false)
        setSelectedSuite(null)
      } catch (error) {
        console.error('Failed to delete suite:', error)
      }
    }
  }

  // Handle suite created
  const handleSuiteCreated = async () => {
    try {
      console.log('SuiteList: Refreshing suites list...')
      const refreshedSuites = await getSuites() // Refresh the suites list
      console.log('SuiteList: Refreshed suites:', refreshedSuites)
    } catch (error) {
      console.error('Failed to refresh suites:', error)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3 text-muted-foreground">Loading suites...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
        <p className="text-destructive font-medium">Error loading suites: {error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Test Suites</h2>
          <p className="text-muted-foreground mt-1">
            Manage your test suites and organize your test cases
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="ai-button px-6 py-3 flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Create Suite
        </button>
      </div>

      {/* Suites Grid */}
      {suites.length === 0 ? (
        <div className="bg-muted/50 border border-border rounded-lg p-12 text-center">
          <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No test suites yet</h3>
          <p className="text-muted-foreground mb-6">
            Create your first test suite to start organizing your test cases
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="ai-button px-6 py-3 flex items-center gap-2 mx-auto"
          >
            <Plus className="h-5 w-5" />
            Create Your First Suite
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suites.map((suite, index) => (
            <motion.div
              key={suite.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover:border-primary/50"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                    {suite.suite_name}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      <span>{suite.test_count} tests</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(suite.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-border">
                <button
                  onClick={() => handleSuiteSelect(suite)}
                  className="flex-1 ai-button-secondary py-2 px-4 flex items-center justify-center gap-2 text-sm"
                >
                  <FolderOpen className="h-4 w-4" />
                  Open
                </button>
                <button
                  onClick={() => handleEditSuite(suite)}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                  title="Edit suite"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteSuite(suite)}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                  title="Delete suite"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateSuiteModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuiteCreated={handleSuiteCreated}
      />

      <EditSuiteModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setSelectedSuite(null)
        }}
        suite={selectedSuite}
      />

      <DeleteSuiteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedSuite(null)
        }}
        suite={selectedSuite}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}

export default SuiteList
