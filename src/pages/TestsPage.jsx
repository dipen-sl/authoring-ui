import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles, Plus, List, Edit2 } from 'lucide-react'
import { useSuites } from '../hooks/useSuites'
import ThemeToggle from '../components/ThemeToggle'
import ManualTestForm from '../components/tests/manual/ManualTestForm'
import CSVUploadForm from '../components/tests/csv/CSVUploadForm'
import VideoUploadForm from '../components/tests/video/VideoUploadForm'
import TestsList from '../components/tests/TestsList'

/**
 * Tests page component for managing tests within a suite
 */
const TestsPage = () => {
  try {
    const { suiteId } = useParams()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('list')
    const [suite, setSuite] = useState(null)
    const [loading, setLoading] = useState(true)
    const [autoFillData, setAutoFillData] = useState(null)
    
    // Try to get the hook, but handle errors
    let getSuiteById = null
    try {
      const hooks = useSuites()
      getSuiteById = hooks.getSuiteById
    } catch (hookError) {
      console.error('Error getting useSuites hook:', hookError)
    }

  // Load suite information
  useEffect(() => {
    const loadSuite = async () => {
      if (!suiteId) {
        console.log('No suiteId provided')
        setLoading(false)
        return
      }
      
      if (!getSuiteById) {
        console.error('getSuiteById function is not available')
        setLoading(false)
        return
      }
      
      console.log('Loading suite with ID:', suiteId)
      
      try {
        setLoading(true)
        const suiteData = await getSuiteById(suiteId)
        console.log('Loaded suite data:', suiteData)
        setSuite(suiteData)
      } catch (error) {
        console.error('Failed to load suite:', error)
        console.log('Redirecting to /suites')
        navigate('/suites')
      } finally {
        setLoading(false)
      }
    }

    loadSuite()
  }, [suiteId]) // Remove getSuiteById and navigate from dependencies to prevent infinite loop

  // Handle test creation
  const handleTestCreated = () => {
    setActiveTab('list')
  }

  // Handle test edit
  const handleTestEdit = () => {
    // Tests list will automatically refresh
  }

  // Handle auto-fill from CSV
  const handleAutoFill = (data) => {
    setAutoFillData(data)
    setActiveTab('manual')
  }

  // Handle back navigation
  const handleBack = () => {
    navigate('/suites')
  }

  // Tab configurations
  const tabs = [
    { id: 'list', label: 'All Tests', icon: List },
    { id: 'manual', label: 'Manual Entry', icon: Plus },
    { id: 'csv', label: 'CSV Upload', icon: Plus },
    { id: 'video', label: 'Video Upload', icon: Plus }
  ]

  if (loading) {
    return (
      <div className="min-h-screen ai-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3 text-muted-foreground">Loading suite...</span>
      </div>
    )
  }

  if (!suite) {
    return (
      <div className="min-h-screen ai-bg flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Suite Not Found</h2>
          <p className="text-muted-foreground mb-4">The requested test suite could not be found.</p>
          <button onClick={handleBack} className="ai-button px-6 py-3">
            Back to Suites
          </button>
        </div>
      </div>
    )
  }


    return (
      <div className="min-h-screen ai-bg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="min-h-screen flex flex-col"
        >
          {/* Header */}
          <div className="flex-1 flex flex-col justify-start px-6 py-12 max-w-6xl mx-auto w-full">
            <div className="text-center mb-12">
              {/* Theme Toggle */}
              <div className="flex justify-end mb-6">
                <ThemeToggle />
              </div>
              
              {/* Back Button */}
              <div className="flex justify-start mb-6">
                <button
                  onClick={handleBack}
                  className="ai-button-secondary px-4 py-2 flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Suites
                </button>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="flex items-center justify-center mb-6"
              >
                <Sparkles className="h-8 w-8 text-primary mr-3" />
                <h1 className="ai-heading text-6xl md:text-7xl font-bold !text-6xl md:!text-7xl">
                  {suite.suite_name}
                </h1>
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-xl text-muted-foreground max-w-2xl mx-auto"
              >
                Manage and organize your test cases for this suite
              </motion.p>
            </div>

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-wrap justify-center gap-2 mb-8"
            >
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`ai-tab ${activeTab === tab.id ? 'active' : ''}`}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {tab.label}
                  </button>
                )
              })}
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex-1"
            >
              {activeTab === 'list' && (
                <TestsList 
                  suiteId={suiteId}
                  onTestEdit={handleTestEdit}
                />
              )}
              
              {activeTab === 'manual' && (
                <div className="bg-card border border-border rounded-lg p-8">
                  <ManualTestForm 
                    suiteId={suiteId}
                    onTestCreated={handleTestCreated}
                    autoFillData={autoFillData}
                    onAutoFillUsed={() => setAutoFillData(null)}
                  />
                </div>
              )}
              
              {activeTab === 'csv' && (
                <div className="bg-card border border-border rounded-lg p-8">
                  <CSVUploadForm 
                    suiteId={suiteId}
                    onTestsCreated={handleTestCreated}
                    onAutoFill={handleAutoFill}
                  />
                </div>
              )}
              
              {activeTab === 'video' && (
                <div className="bg-card border border-border rounded-lg p-8">
                  <VideoUploadForm 
                    suiteId={suiteId}
                    onTestsCreated={handleTestCreated}
                  />
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    )
  } catch (componentError) {
    console.error('TestsPage component error:', componentError)
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#fee2e2', padding: '20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ color: '#dc2626', fontSize: '24px', fontWeight: 'bold' }}>
            COMPONENT ERROR
          </h1>
          <p style={{ color: '#dc2626' }}>Error: {componentError.message}</p>
          <pre style={{ backgroundColor: '#fef2f2', padding: '10px', borderRadius: '4px', whiteSpace: 'pre-wrap' }}>
            {componentError.stack}
          </pre>
        </div>
      </div>
    )
  }
}

export default TestsPage
