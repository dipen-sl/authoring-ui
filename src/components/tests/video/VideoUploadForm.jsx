import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, Play, Pause, Volume2, VolumeX, X, AlertCircle, CheckCircle } from 'lucide-react'
import { useTestOperations } from '../../../hooks/useSuites'
import { validateVideoFile, generateVideoThumbnail, createVideoPreviewUrl, cleanupVideoPreviewUrl, getSupportedVideoFormats } from '../../../utils/videoUtils'

/**
 * Video upload form component for video-based test creation
 */
const VideoUploadForm = ({ suiteId, onTestCreated }) => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [videoInfo, setVideoInfo] = useState(null)
  const [thumbnail, setThumbnail] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [validationResult, setValidationResult] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)
  const videoRef = useRef(null)
  const { uploadVideo } = useTestOperations()

  // Handle file selection
  const handleFileSelect = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setSelectedFile(file)
    setError(null)
    setValidationResult(null)
    setVideoInfo(null)
    setThumbnail(null)

    // Clean up previous preview URL
    if (previewUrl) {
      cleanupVideoPreviewUrl(previewUrl)
    }

    try {
      setIsProcessing(true)
      
      // Validate file
      const validation = await validateVideoFile(file)
      setValidationResult(validation)

      if (validation.isValid && validation.videoInfo) {
        setVideoInfo(validation.videoInfo)
        
        // Generate thumbnail
        try {
          const thumb = await generateVideoThumbnail(file)
          setThumbnail(thumb)
        } catch (thumbError) {
          console.warn('Failed to generate thumbnail:', thumbError)
        }
        
        // Create preview URL
        const url = createVideoPreviewUrl(file)
        setPreviewUrl(url)
      }
    } catch (err) {
      setError(err.message || 'Failed to process video file')
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle file removal
  const handleRemoveFile = () => {
    setSelectedFile(null)
    setVideoInfo(null)
    setThumbnail(null)
    setValidationResult(null)
    setError(null)
    setIsPlaying(false)
    
    // Clean up preview URL
    if (previewUrl) {
      cleanupVideoPreviewUrl(previewUrl)
      setPreviewUrl(null)
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Handle video upload
  const handleUpload = async () => {
    if (!selectedFile || !validationResult?.isValid) return

    try {
      setIsUploading(true)
      setError(null)
      
      const newTest = await uploadVideo(suiteId, selectedFile)
      
      // Reset form
      handleRemoveFile()
      
      // Notify parent component
      if (onTestCreated) {
        onTestCreated(newTest)
      }
    } catch (err) {
      setError(err.message || 'Failed to upload video')
    } finally {
      setIsUploading(false)
    }
  }

  // Handle video play/pause
  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Handle video mute/unmute
  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  // Handle video ended
  const handleVideoEnded = () => {
    setIsPlaying(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-foreground mb-2">Upload Video Test</h3>
        <p className="text-muted-foreground">
          Record your test execution and let AI transcribe the steps
        </p>
      </div>

      {/* File Upload Area */}
      <div className="space-y-4">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            selectedFile
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50 hover:bg-muted/50'
          }`}
        >
          {!selectedFile ? (
            <div className="space-y-4">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <h4 className="font-medium text-foreground mb-2">Upload Video File</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Drag and drop your video file here, or click to browse
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={getSupportedVideoFormats()}
                  onChange={handleFileSelect}
                  className="hidden"
                  id="video-upload"
                />
                <label
                  htmlFor="video-upload"
                  className="ai-button px-6 py-3 cursor-pointer inline-flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Choose Video File
                </label>
                <p className="text-xs text-muted-foreground mt-2">
                  Supported formats: MP4, WebM, OGG, AVI, MOV, WMV, FLV, MKV
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="h-12 w-12 text-primary mx-auto" />
              <div>
                <h4 className="font-medium text-foreground mb-2">{selectedFile.name}</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
                </p>
                <button
                  onClick={handleRemoveFile}
                  className="ai-button-secondary px-4 py-2 flex items-center gap-2 text-sm mx-auto"
                >
                  <X className="h-4 w-4" />
                  Remove File
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="flex items-center justify-center gap-3 py-4">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            <span className="text-muted-foreground">Processing video file...</span>
          </div>
        )}

        {/* Validation Results */}
        {validationResult && (
          <div className="space-y-3">
            {!validationResult.isValid ? (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-destructive mb-2">Validation Errors</h4>
                    <ul className="text-sm text-destructive space-y-1">
                      {validationResult.errors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-green-500 mb-1">Video Valid</h4>
                    <p className="text-sm text-green-600">
                      Ready for transcription and test creation
                    </p>
                    {validationResult.warnings.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-yellow-600 mb-1">Warnings:</p>
                        <ul className="text-sm text-yellow-600 space-y-1">
                          {validationResult.warnings.map((warning, index) => (
                            <li key={index}>• {warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Video Preview */}
        {selectedFile && videoInfo && previewUrl && (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="p-4 border-b border-border">
              <h4 className="font-medium text-foreground mb-1">Video Preview</h4>
              <p className="text-sm text-muted-foreground">
                {videoInfo.durationFormatted} • {videoInfo.width}x{videoInfo.height} • {videoInfo.sizeFormatted}
              </p>
            </div>
            
            <div className="relative">
              {/* Thumbnail */}
              {thumbnail && !isPlaying && (
                <div className="relative">
                  <img
                    src={thumbnail}
                    alt="Video thumbnail"
                    className="w-full h-auto max-h-64 object-contain bg-black"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={handlePlayPause}
                      className="p-4 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                    >
                      <Play className="h-8 w-8 text-white" />
                    </button>
                  </div>
                </div>
              )}
              
              {/* Video Player */}
              <video
                ref={videoRef}
                src={previewUrl}
                className={`w-full h-auto max-h-64 object-contain bg-black ${isPlaying ? 'block' : 'hidden'}`}
                onEnded={handleVideoEnded}
                muted={isMuted}
              />
              
              {/* Video Controls */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2">
                <button
                  onClick={handlePlayPause}
                  className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5 text-white" />
                  ) : (
                    <Play className="h-5 w-5 text-white" />
                  )}
                </button>
                <button
                  onClick={handleMuteToggle}
                  className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="h-5 w-5 text-white" />
                  ) : (
                    <Volume2 className="h-5 w-5 text-white" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Transcription Status */}
        {selectedFile && validationResult?.isValid && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mt-0.5 flex-shrink-0"></div>
              <div>
                <h4 className="font-medium text-blue-500 mb-1">Transcription Processing</h4>
                <p className="text-sm text-blue-600">
                  After upload, our AI will analyze your video and extract test steps automatically.
                  This may take a few minutes depending on video length.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-destructive mb-1">Upload Error</h4>
                <p className="text-sm text-destructive">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Upload Button */}
        {selectedFile && validationResult?.isValid && (
          <div className="flex justify-center pt-4">
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="ai-button px-8 py-4 flex items-center gap-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Uploading & Processing...
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5" />
                  Create Video Test
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default VideoUploadForm
