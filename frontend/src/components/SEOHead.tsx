import { Helmet } from 'react-helmet-async'
import type { SEOMetadata } from '../utils/seoHelpers'

interface SEOHeadProps {
  seo: SEOMetadata
}

export function SEOHead({ seo }: SEOHeadProps) {
  const title = seo.title
  const description = seo.description
  const keywords = seo.keywords
  const image = seo.image || 'https://voxella.app/images/logo.png'
  const url = seo.url || 'https://voxella.app'

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Open Graph */}
      <meta property="og:type" content={seo.type || 'website'} />
      <meta property="og:site_name" content="Voxella" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@voxella" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional */}
      {seo.author && <meta name="author" content={seo.author} />}
      <link rel="canonical" href={url} />
    </Helmet>
  )
}
