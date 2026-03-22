import { sanitizeHtml } from '../utils/sanitizeHtml'

interface SafeHtmlProps {
  html: string | null | undefined
  className?: string
}

/**
 * Safely render HTML content after sanitization
 * Use this component to display user-generated or rich text content
 */
export default function SafeHtml({ html, className = '' }: SafeHtmlProps) {
  if (!html) return null

  const sanitized = sanitizeHtml(html)
  if (!sanitized) return null

  const mergedClassName = ['safe-html-content', className].filter(Boolean).join(' ')

  return <div className={mergedClassName} dangerouslySetInnerHTML={{ __html: sanitized }} />
}
