/**
 * Safe HTML sanitization utility
 * Allows basic formatting tags while removing dangerous scripts and events
 */

const ALLOWED_TAGS = {
  p: 'p',
  br: 'br',
  strong: 'strong',
  b: 'b',
  em: 'em',
  i: 'i',
  u: 'u',
  a: 'a',
  ul: 'ul',
  ol: 'ol',
  li: 'li',
  blockquote: 'blockquote',
  code: 'code',
  pre: 'pre',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
}

const ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  a: ['href', 'title'],
}

/**
 * Sanitize HTML content to prevent XSS while allowing safe formatting tags
 * @param html Raw HTML string
 * @returns Sanitized HTML string
 */
export function sanitizeHtml(html: string | null | undefined): string {
  if (!html) return ''

  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  // Remove any script tags and event handlers
  const scriptTags = doc.querySelectorAll('script, iframe, object, embed')
  scriptTags.forEach((tag) => tag.remove())

  // Walk through all elements and remove disallowed tags
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_ELEMENT, null)

  const nodesToRemove: Node[] = []
  let node

  while ((node = walker.nextNode())) {
    const elem = node as Element
    const tagName = elem.tagName.toLowerCase()

    // Remove if tag not allowed
    if (!(tagName in ALLOWED_TAGS)) {
      // Replace with children (unwrap)
      while (elem.firstChild) {
        elem.parentNode?.insertBefore(elem.firstChild, elem)
      }
      nodesToRemove.push(elem)
      continue
    }

    // Remove all attributes except allowed ones
    const allowedAttrs = ALLOWED_ATTRIBUTES[tagName] || []
    const attrsToRemove = Array.from(elem.attributes)
      .map((attr) => attr.name)
      .filter((name) => !allowedAttrs.includes(name))

    attrsToRemove.forEach((name) => {
      elem.removeAttribute(name)
    })

    // Sanitize href in links
    if (tagName === 'a' && elem.hasAttribute('href')) {
      const href = elem.getAttribute('href') || ''
      // Only allow safe protocols
      if (!href.startsWith('javascript:') && !href.startsWith('data:')) {
        // Links are kept as-is
      } else {
        elem.removeAttribute('href')
      }
    }

    // Remove any inline event handlers
    Array.from(elem.attributes).forEach((attr) => {
      if (attr.name.startsWith('on')) {
        elem.removeAttribute(attr.name)
      }
    })
  }

  nodesToRemove.forEach((node) => {
    if (node.parentNode) {
      node.parentNode.removeChild(node)
    }
  })

  return doc.body.innerHTML
}

/**
 * Strip all HTML tags and return plain text
 * @param html HTML string
 * @returns Plain text
 */
export function stripHtml(html: string | null | undefined): string {
  if (!html) return ''
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}
