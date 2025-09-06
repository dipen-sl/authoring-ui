import React from 'react'
import { cn } from '@/lib/utils'

/**
 * AI-style text input component with label and error support
 * @param {string} label - Label text for the input
 * @param {string} name - Input name for form handling
 * @param {string} placeholder - Placeholder text
 * @param {object} register - React Hook Form register function
 * @param {string} error - Error message to display
 * @param {boolean} required - Whether the field is required
 * @param {string} type - Input type (default: 'text')
 * @param {string} className - Additional CSS classes
 * @param {boolean} isTextarea - Whether to render as textarea
 */
const TextField = ({
  label,
  name,
  placeholder,
  register,
  error,
  required = false,
  type = 'text',
  className,
  isTextarea = false,
  showError = true
}) => {
  const inputClasses = cn(
    "w-full px-4 py-3 text-foreground placeholder-muted-foreground text-base",
    isTextarea ? "ai-textarea" : "ai-prompt-field",
    error && "border-destructive focus:border-destructive"
  )

  return (
    <div className={cn("space-y-3", className)}>
      <label 
        htmlFor={name}
        className="ai-label flex items-center"
      >
        {label}
        {required && <span className="text-primary ml-2 text-lg">*</span>}
      </label>
      
      {isTextarea ? (
        <textarea
          id={name}
          placeholder={placeholder}
          className={inputClasses}
          rows={4}
          {...register(name, { 
            required: required ? `${label} is required` : false,
            validate: (value) => {
              if (required && (!value || value.trim() === '')) {
                return `${label} is required`
              }
              return true
            }
          })}
        />
      ) : (
        <input
          id={name}
          type={type}
          placeholder={placeholder}
          className={inputClasses}
          {...register(name, { 
            required: required ? `${label} is required` : false,
            validate: (value) => {
              if (required && (!value || value.trim() === '')) {
                return `${label} is required`
              }
              return true
            }
          })}
        />
      )}
      
      {error && showError && (
        <p className="text-sm text-destructive flex items-center font-medium">
          <span className="w-1.5 h-1.5 bg-destructive rounded-full mr-2"></span>
          {error}
        </p>
      )}
    </div>
  )
}

export default TextField
