/**
 * CSV Parser utility for handling test data import
 * Supports the predefined CSV template format
 */

// Expected CSV headers based on template
const EXPECTED_HEADERS = ['test_id', 'test_title', 'test_description', 'assertion']

/**
 * Parse CSV file content into structured data
 * @param {File} file - CSV file to parse
 * @returns {Promise<Array>} Array of parsed test objects
 */
export const parseCSV = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (event) => {
      try {
        const text = event.target.result
        const result = parseCSVText(text)
        resolve(result)
      } catch (error) {
        reject(new Error(`Failed to parse CSV: ${error.message}`))
      }
    }
    
    reader.onerror = () => {
      reject(new Error('Failed to read CSV file'))
    }
    
    reader.readAsText(file)
  })
}

/**
 * Parse CSV text content
 * @param {string} text - CSV text content
 * @returns {Array} Array of parsed test objects
 */
export const parseCSVText = (text) => {
  if (!text || text.trim() === '') {
    throw new Error('CSV file is empty')
  }
  
  const lines = text.split('\n').map(line => line.trim()).filter(line => line)
  
  if (lines.length < 2) {
    throw new Error('CSV must have at least a header row and one data row')
  }
  
  // Parse headers
  const headers = parseCSVLine(lines[0])
  
  // Validate headers
  validateHeaders(headers)
  
  // Parse data rows
  const data = lines.slice(1).map((line, index) => {
    try {
      const values = parseCSVLine(line)
      return createTestObject(headers, values, index + 2) // +2 because we start from line 2 and 0-indexed
    } catch (error) {
      throw new Error(`Error parsing line ${index + 2}: ${error.message}`)
    }
  }).filter(test => test.test_id && test.test_id.trim() !== '') // Filter out empty rows
  
  if (data.length === 0) {
    throw new Error('No valid test data found in CSV')
  }
  
  return data
}

/**
 * Parse a single CSV line, handling quoted values
 * @param {string} line - CSV line to parse
 * @returns {Array} Array of values
 */
const parseCSVLine = (line) => {
  const values = []
  let current = ''
  let inQuotes = false
  let i = 0
  
  while (i < line.length) {
    const char = line[i]
    const nextChar = line[i + 1]
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"'
        i += 2
      } else {
        // Toggle quote state
        inQuotes = !inQuotes
        i++
      }
    } else if (char === ',' && !inQuotes) {
      // Field separator
      values.push(current.trim())
      current = ''
      i++
    } else {
      current += char
      i++
    }
  }
  
  // Add the last field
  values.push(current.trim())
  
  return values
}

/**
 * Validate CSV headers against expected format (flexible)
 * @param {Array} headers - Parsed headers
 * @throws {Error} If headers don't match expected format
 */
const validateHeaders = (headers) => {
  const normalizedHeaders = headers.map(h => h.toLowerCase().trim())
  
  // Check for required fields with flexible matching
  const hasTestId = normalizedHeaders.some(h => h.includes('test_id') || h === 'id')
  const hasTitle = normalizedHeaders.some(h => h.includes('test_title') || h === 'title' || h === 'name')
  
  if (!hasTestId) {
    throw new Error('CSV must contain a Test ID column (test_id, id, etc.)')
  }
  
  if (!hasTitle) {
    throw new Error('CSV must contain a Title column (test_title, title, name, etc.)')
  }
  
  // Check for extra headers (optional warning)
  const expectedPatterns = ['test_id', 'id', 'test_title', 'title', 'name', 'test_description', 'description', 'desc', 'assertion', 'expected', 'result', 'steps']
  const extraHeaders = headers.filter(header => 
    !expectedPatterns.some(pattern => header.toLowerCase().includes(pattern))
  )
  
  if (extraHeaders.length > 0) {
    console.warn(`Extra headers found (will be ignored): ${extraHeaders.join(', ')}`)
  }
}

/**
 * Create test object from headers and values
 * @param {Array} headers - CSV headers
 * @param {Array} values - CSV values
 * @param {number} lineNumber - Line number for error reporting
 * @returns {Object} Test object
 */
const createTestObject = (headers, values, lineNumber) => {
  const test = {}
  
  headers.forEach((header, index) => {
    const value = values[index] || ''
    const normalizedHeader = header.toLowerCase().trim()
    
    // Map headers to test object properties (flexible matching)
    if (normalizedHeader.includes('test_id') || normalizedHeader === 'id') {
      test.test_id = value
    } else if (normalizedHeader.includes('test_title') || normalizedHeader === 'title' || normalizedHeader === 'name') {
      test.test_title = value
    } else if (normalizedHeader.includes('test_description') || normalizedHeader === 'description' || normalizedHeader === 'desc') {
      test.test_description = value
    } else if (normalizedHeader === 'assertion' || normalizedHeader.includes('expected') || normalizedHeader.includes('result')) {
      test.assertion = value
    } else if (normalizedHeader === 'steps') {
      // Convert steps to assertion if no assertion field exists
      if (!test.assertion) {
        test.assertion = `Steps: ${value}`
      }
    }
    // Ignore other headers
  })
  
  // Validate required fields
  if (!test.test_id || test.test_id.trim() === '') {
    throw new Error('Test ID is required')
  }
  
  if (!test.test_title || test.test_title.trim() === '') {
    throw new Error('Test Title is required')
  }
  
  // Set defaults for missing fields
  if (!test.test_description) {
    test.test_description = 'No description provided'
  }
  
  if (!test.assertion) {
    test.assertion = 'No assertion/expected result provided'
  }
  
  return test
}

/**
 * Generate CSV template content
 * @returns {string} CSV template content
 */
export const generateCSVTemplate = () => {
  const headers = EXPECTED_HEADERS.join(',')
  const exampleRows = [
    'LOGIN_001,Valid Login Test,Test successful login with valid credentials,User should be redirected to dashboard',
    'LOGIN_002,Invalid Login Test,Test login with invalid credentials,Error message should be displayed'
  ]
  
  return [headers, ...exampleRows].join('\n')
}

/**
 * Download CSV template
 */
export const downloadCSVTemplate = () => {
  const template = generateCSVTemplate()
  const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'test_template.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

/**
 * Validate CSV file before upload
 * @param {File} file - File to validate
 * @returns {Promise<Object>} Validation result
 */
export const validateCSVFile = async (file) => {
  const errors = []
  const warnings = []
  
  // Check file type
  if (!file.name.toLowerCase().endsWith('.csv')) {
    errors.push('File must be a CSV file (.csv extension)')
  }
  
  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    errors.push('File size must be less than 5MB')
  }
  
  // Check if file is empty
  if (file.size === 0) {
    errors.push('File is empty')
  }
  
  // Try to parse the file to check format
  try {
    const data = await parseCSV(file)
    
    if (data.length === 0) {
      errors.push('No valid test data found in CSV')
    }
    
    if (data.length > 100) {
      warnings.push(`Large number of tests detected (${data.length}). Consider splitting into smaller files.`)
    }
    
    // Check for duplicate test IDs
    const testIds = data.map(test => test.test_id)
    const duplicates = testIds.filter((id, index) => testIds.indexOf(id) !== index)
    if (duplicates.length > 0) {
      errors.push(`Duplicate test IDs found: ${[...new Set(duplicates)].join(', ')}`)
    }
    
  } catch (error) {
    errors.push(error.message)
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}
