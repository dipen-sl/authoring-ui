import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import SuiteList from '../components/suites/SuiteList'
import ThemeToggle from '../components/ThemeToggle'

/**
 * Suites page component for managing test suites
 */
const SuitesPage = () => {
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
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex items-center justify-center mb-6"
            >
              <Sparkles className="h-8 w-8 text-primary mr-3" />
              <h1 className="ai-heading text-6xl md:text-7xl font-bold !text-6xl md:!text-7xl">
                Test Suites
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl text-muted-foreground font-medium"
            >
              Organize and manage your test cases with AI-powered precision
            </motion.p>
          </div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="w-full"
          >
            <SuiteList />
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default SuitesPage
