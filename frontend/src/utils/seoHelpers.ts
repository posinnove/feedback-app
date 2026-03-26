export interface SEOMetadata {
  title: string
  description: string
  keywords?: string
  image?: string
  url?: string
  type?: 'website' | 'article'
  author?: string
}

export function generateSEOMetadata(base: SEOMetadata): SEOMetadata {
  return {
    ...base,
    url: base.url || 'https://voxella.app',
    type: base.type || 'website',
  }
}

export const defaultSEO: SEOMetadata = {
  title: 'Voxella - Feedback & Feature Request Platform',
  description:
    'A modern platform for sharing feedback and requesting features from your favorite companies. Vote on ideas and make your voice heard.',
  keywords: 'feedback, feature request, user feedback, product feedback, community, voting',
  image: 'https://voxella.app/images/logo.png',
  url: 'https://voxella.app',
  type: 'website',
}

export const companySEO = (companyName: string, description?: string): SEOMetadata => ({
  title: `${companyName} Feedback Board - Voxella`,
  description:
    description || `View and vote on feature requests and feedback for ${companyName} on Voxella.`,
  keywords: `${companyName}, feedback, feature request, voting`,
  image: 'https://voxella.app/images/logo.png',
  type: 'website',
})

export const feedbackSEO = (
  feedbackTitle: string,
  companyName: string,
  author: string
): SEOMetadata => ({
  title: `${feedbackTitle} - ${companyName} | Voxella`,
  description: `Feedback from ${author} about "${feedbackTitle}" for ${companyName}. Join the community and vote on this feature request.`,
  keywords: `${companyName}, ${feedbackTitle}, feedback, feature request`,
  image: 'https://voxella.app/images/logo.png',
  type: 'article',
  author,
})
