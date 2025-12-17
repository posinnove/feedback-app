const MAX_SIZE = 10 * 1024 * 1024 // 10MB

/**
 * Validates an array of files
 * @param {File[]} files
 * @returns {{validFiles: File[], errors: string[]}}
 */
export function validateFiles(files) {
  const validFiles = []
  const errors = []

  files.forEach((file) => {
    if (file.size > MAX_SIZE) {
      errors.push(`"${file.name}" exceeds 10MB limit`)
    } else {
      validFiles.push(file)
    }
  })

  return { validFiles, errors }
}
