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
    'Voxella is a product feedback and feature request platform where communities share ideas, vote on features, and help companies build better products.',
  keywords:
    'voxella, Voxella app, voxella feedback, feedback platform, feature request platform, user feedback, product feedback, customer feedback tool, roadmap voting, idea voting, suggestion board, public feedback board, community feedback, SaaS feedback, product management tools',
  image: 'https://voxella.app/images/logo.png',
  url: 'https://voxella.app',
  type: 'website',
}

export const companySEO = (
  companyName: string,
  slug: string,
  description?: string
): SEOMetadata => ({
  title: `${companyName} Feedback Board - Voxella`,
  description:
    description || `View and vote on feature requests and feedback for ${companyName} on Voxella.`,
  keywords: `${companyName}, ${companyName} feedback board, ${companyName} feature requests, ${companyName} product feedback, feedback voting, voxella`,
  image: 'https://voxella.app/images/logo.png',
  url: `https://voxella.app/${slug}`,
  type: 'website',
})

export const feedbackSEO = (
  feedbackTitle: string,
  companyName: string,
  author: string,
  feedbackId: number
): SEOMetadata => ({
  title: `${feedbackTitle} - ${companyName} | Voxella`,
  description: `Feedback from ${author} about "${feedbackTitle}" for ${companyName}. Join the community and vote on this feature request.`,
  keywords: `${companyName}, ${feedbackTitle}, feedback request, feature request, user feedback, product idea, voxella`,
  image: 'https://voxella.app/images/logo.png',
  url: `https://voxella.app/request/${feedbackId}`,
  type: 'article',
  author,
})
