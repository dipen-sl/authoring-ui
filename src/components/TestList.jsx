import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Edit, Trash2, Play, Calendar, ExternalLink, CheckCircle } from 'lucide-react'
import { useTests } from '../context/TestContext'

/**
 * Test list component for displaying and managing saved tests
 * Provides CRUD operations and test selection
 */
const TestList = ({ onEditTest, onSelectTest }) => {
  const { tests, deleteTest } = useTests()
  const [deletingId, setDeletingId] = useState(null)

  const handleDelete = async (testId) => {
    setDeletingId(testId)
    // Add a small delay for better UX
    setTimeout(() => {
      deleteTest(testId)
      setDeletingId(null)
    }, 300)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (tests.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="p-6 rounded-full bg-muted border border-border w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <CheckCircle className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">No tests yet</h3>
        <p className="text-muted-foreground">Create your first test to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Your Tests</h2>
        <span className="text-muted-foreground text-sm">{tests.length} test{tests.length !== 1 ? 's' : ''}</span>
      </div>
      
      <div className="grid gap-4">
        <AnimatePresence>
          {tests.map((test) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-card border border-border rounded-xl p-6 hover:bg-accent transition-all duration-200 group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-lg font-semibold text-foreground truncate">
                      {test.testName}
                    </h3>
                    <span className="px-2 py-1 bg-primary/20 text-primary text-xs font-medium rounded-full">
                      {test.url ? 'Web' : 'API'}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <ExternalLink className="h-4 w-4" />
                      <span className="truncate">{test.url || 'No URL'}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Created {formatDate(test.createdAt)}</span>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                    {test.description}
                  </p>
                  
                  <div className="text-xs text-muted-foreground">
                    <strong>Assertion:</strong> {test.assertion}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => onSelectTest(test)}
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                    title="Load test"
                  >
                    <Play className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => onEditTest(test)}
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                    title="Edit test"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(test.id)}
                    disabled={deletingId === test.id}
                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50"
                    title="Delete test"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default TestList
