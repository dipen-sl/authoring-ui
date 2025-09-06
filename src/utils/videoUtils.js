/**
 * Video utilities for handling video uploads and previews
 * Frontend-only utilities for video processing
 */

/**
 * Generate video thumbnail from video file
 * @param {File} videoFile - Video file to generate thumbnail from
 * @param {number} timeOffset - Time offset in seconds for thumbnail (default: 1)
 * @returns {Promise<string>} Base64 data URL of thumbnail
 */
export const generateVideoThumbnail = async (videoFile, timeOffset = 1) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    video.addEventListener('loadedmetadata', () => {
      // Set canvas dimensions to video dimensions
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      // Set video time for thumbnail
      video.currentTime = Math.min(timeOffset, video.duration - 0.1)
    })
    
    video.addEventListener('seeked', () => {
      try {
        // Draw video frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        
        // Convert canvas to base64 data URL
        const dataURL = canvas.toDataURL('image/jpeg', 0.8)
        resolve(dataURL)
      } catch (error) {
        reject(new Error('Failed to generate thumbnail'))
      }
    })
    
    video.addEventListener('error', () => {
      reject(new Error('Failed to load video for thumbnail generation'))
    })
    
    // Load video file
    video.src = URL.createObjectURL(videoFile)
    video.load()
  })
}

/**
 * Get video file information
 * @param {File} videoFile - Video file to analyze
 * @returns {Promise<Object>} Video file information
 */
export const getVideoInfo = async (videoFile) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    
    video.addEventListener('loadedmetadata', () => {
      const info = {
        name: videoFile.name,
        size: videoFile.size,
        type: videoFile.type,
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight,
        aspectRatio: video.videoWidth / video.videoHeight,
        sizeFormatted: formatFileSize(videoFile.size),
        durationFormatted: formatDuration(video.duration)
      }
      
      resolve(info)
    })
    
    video.addEventListener('error', () => {
      reject(new Error('Failed to load video metadata'))
    })
    
    video.src = URL.createObjectURL(videoFile)
    video.load()
  })
}

/**
 * Format file size in human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Format duration in human readable format
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration
 */
export const formatDuration = (seconds) => {
  if (isNaN(seconds) || seconds === 0) return '0:00'
  
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  } else {
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }
}

/**
 * Validate video file before upload
 * @param {File} file - Video file to validate
 * @returns {Promise<Object>} Validation result
 */
export const validateVideoFile = async (file) => {
  const errors = []
  const warnings = []
  
  // Check file type
  const allowedTypes = [
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/avi',
    'video/quicktime', // .mov files
    'video/x-quicktime', // Alternative .mov MIME type
    'video/wmv',
    'video/flv',
    'video/mkv'
  ]
  
  if (!allowedTypes.includes(file.type)) {
    errors.push('Unsupported video format. Supported formats: MP4, WebM, OGG, AVI, MOV, WMV, FLV, MKV')
  }
  
  // Check file size (max 100MB)
  const maxSize = 100 * 1024 * 1024 // 100MB
  if (file.size > maxSize) {
    errors.push('Video file size must be less than 100MB')
  }
  
  // Check if file is empty
  if (file.size === 0) {
    errors.push('Video file is empty')
  }
  
  // Try to get video info to validate it's a proper video file
  try {
    const videoInfo = await getVideoInfo(file)
    
    // Check duration (warn if very long)
    if (videoInfo.duration > 1800) { // 30 minutes
      warnings.push('Video is longer than 30 minutes. Consider shorter recordings for better processing.')
    }
    
    // Check resolution
    if (videoInfo.width < 320 || videoInfo.height < 240) {
      warnings.push('Video resolution is low. Consider recording in higher resolution.')
    }
    
    // Check aspect ratio
    if (videoInfo.aspectRatio < 0.5 || videoInfo.aspectRatio > 2) {
      warnings.push('Unusual aspect ratio detected. Standard ratios (16:9, 4:3) work best.')
    }
    
  } catch (error) {
    errors.push('Invalid video file or corrupted video data')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    videoInfo: errors.length === 0 ? await getVideoInfo(file).catch(() => null) : null
  }
}

/**
 * Create video preview URL
 * @param {File} videoFile - Video file
 * @returns {string} Object URL for video preview
 */
export const createVideoPreviewUrl = (videoFile) => {
  return URL.createObjectURL(videoFile)
}

/**
 * Clean up video preview URL to free memory
 * @param {string} url - Video preview URL to revoke
 */
export const cleanupVideoPreviewUrl = (url) => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url)
  }
}

/**
 * Get supported video formats for file input
 * @returns {string} Accept attribute string
 */
export const getSupportedVideoFormats = () => {
  return '.mp4,.webm,.ogg,.avi,.mov,.wmv,.flv,.mkv,video/mp4,video/webm,video/ogg,video/avi,video/quicktime,video/x-quicktime,video/x-msvideo,video/x-ms-wmv,video/x-flv,video/x-matroska'
}

/**
 * Simulate video transcription processing (placeholder)
 * @param {File} videoFile - Video file being processed
 * @returns {Promise<Object>} Mock transcription result
 */
export const simulateVideoTranscription = async (videoFile) => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 3000))
  
  // Mock transcription result
  return {
    status: 'completed',
    transcription: `
      This is a mock transcription of the video: ${videoFile.name}
      
      Step 1: User navigates to the login page
      Step 2: User enters username in the username field
      Step 3: User enters password in the password field
      Step 4: User clicks the login button
      Step 5: System validates credentials
      Step 6: User is redirected to the dashboard
      
      Expected Result: Successful login and redirect to dashboard
    `,
    confidence: 0.95,
    duration: 45.2,
    wordCount: 67,
    processingTime: 3.2
  }
}
