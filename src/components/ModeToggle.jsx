import React from 'react'
import { FileText, Upload } from 'lucide-react'

/**
 * AI-style mode toggle component for switching between Manual Input and File Upload modes
 * @param {string} activeMode - Currently active mode ('manual' or 'file')
 * @param {function} onModeChange - Callback when mode changes
 * @param {React.ReactNode} children - Content to render based on active mode
 */
const ModeToggle = ({ activeMode, onModeChange, children }) => {
  return (
    <div className="w-full">
      {/* AI-style tab buttons */}
      <div className="ai-tabs flex w-full mb-8">
        <button
          type="button"
          onClick={() => onModeChange('manual')}
          className={`ai-tab flex-1 flex items-center justify-center space-x-2 ${
            activeMode === 'manual' ? 'active' : ''
          }`}
        >
          <FileText className="h-5 w-5" />
          <span>Manual Input</span>
        </button>
        <button
          type="button"
          onClick={() => onModeChange('file')}
          className={`ai-tab flex-1 flex items-center justify-center space-x-2 ${
            activeMode === 'file' ? 'active' : ''
          }`}
        >
          <Upload className="h-5 w-5" />
          <span>File Upload</span>
        </button>
      </div>
      
      {/* Content */}
      <div className="w-full">
        {activeMode === 'manual' ? children.manual : children.file}
      </div>
    </div>
  )
}

export default ModeToggle
