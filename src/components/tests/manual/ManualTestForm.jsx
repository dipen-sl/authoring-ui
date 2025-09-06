import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, RotateCcw } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTestOperations } from '../../../hooks/useSuites'
import TextField from '../../TextField'

/**
 * Manual test creation form component
 * Reuses existing test fields from the original FormCard
 */
const ManualTestForm = ({ suiteId, onTestCreated, autoFillData, onAutoFillUsed }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const { addManualTest } = useTestOperations()

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      test_id: '',
      test_title: '',
      test_description: '',
      assertion: ''
    }
  })

  // Handle auto-fill data
  useEffect(() => {
    if (autoFillData) {
      setValue('test_id', autoFillData.test_id || '')
      setValue('test_title', autoFillData.test_title || '')
      setValue('test_description', autoFillData.test_description || '')
      setValue('assertion', autoFillData.assertion || '')
      clearErrors()
      
      // Notify parent that auto-fill was used
      if (onAutoFillUsed) {
        onAutoFillUsed()
      }
    }
  }, [autoFillData, setValue, clearErrors, onAutoFillUsed])

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true)
      setHasSubmitted(true)
      
      const newTest = await addManualTest(suiteId, data)
      
      // Reset form
      reset()
      clearErrors()
      setHasSubmitted(false)
      
      // Notify parent component
      if (onTestCreated) {
        onTestCreated(newTest)
      }
    } catch (error) {
      console.error('Failed to create manual test:', error)
    } finally {
      setIsSubmitting(false)
      setHasSubmitted(false)
    }
  }

  // Handle form reset
  const handleClear = () => {
    reset()
    clearErrors()
    setHasSubmitted(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-foreground mb-2">Create Manual Test</h3>
        <p className="text-muted-foreground">
          Define your test case with detailed steps and expected outcomes
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextField
            label="Test ID"
            name="test_id"
            placeholder="e.g., LOGIN_001, CHECKOUT_002"
            register={register}
            error={errors.test_id?.message}
            required
            showError={hasSubmitted}
          />
          
          <TextField
            label="Test Title"
            name="test_title"
            placeholder="e.g., Valid Login Test"
            register={register}
            error={errors.test_title?.message}
            required
            showError={hasSubmitted}
          />
        </div>
        
        <TextField
          label="Test Description"
          name="test_description"
          placeholder="Describe the test scenario and what you're testing. Be specific about the context and conditions..."
          register={register}
          error={errors.test_description?.message}
          required
          isTextarea
          showError={hasSubmitted}
        />
        
        <TextField
          label="Assertion/Expected Result"
          name="assertion"
          placeholder="Define what determines if the test passes or fails. Include specific elements, text, or behaviors that should be present..."
          register={register}
          error={errors.assertion?.message}
          required
          isTextarea
          showError={hasSubmitted}
        />

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border">
          <button
            type="submit"
            disabled={isSubmitting}
            className="ai-button flex-1 sm:flex-none px-8 py-4 text-white font-semibold text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Creating Test...
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                Create Test
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={handleClear}
            className="ai-button-secondary flex-1 sm:flex-none px-8 py-4 font-semibold text-lg flex items-center justify-center gap-3"
          >
            <RotateCcw className="h-5 w-5" />
            Clear All
          </button>
        </div>
      </form>
    </motion.div>
  )
}

export default ManualTestForm
