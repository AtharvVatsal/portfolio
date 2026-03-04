import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SEO_CONFIG } from '../../config/seo';

const SEO = ({
  title,
  description,
  image,
  url,
  type = 'website',
  keywords = [],
  article = null, // { publishedTime, modifiedTime, tags, author }
  noIndex = false,
}) => {
  const siteTitle = title
    ? SEO_CONFIG.titleTemplate.replace('%s', title)
    : SEO_CONFIG.defaultTitle;

  const metaDescription = description || SEO_CONFIG.defaultDescription;
  const metaImage = image
    ? image.startsWith('http')
      ? image
      : `${SEO_CONFIG.siteUrl}${image}`
    : `${SEO_CONFIG.siteUrl}${SEO_CONFIG.defaultImage}`;
  const metaUrl = url
    ? `${SEO_CONFIG.siteUrl}${url}`
    : SEO_CONFIG.siteUrl;
  const metaKeywords = [...SEO_CONFIG.keywords, ...keywords].join(', ');

  // JSON-LD structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': type === 'article' ? 'BlogPosting' : 'WebSite',
    name: siteTitle,
    description: metaDescription,
    url: metaUrl,
    image: metaImage,
    author: {
      '@type': 'Person',
      name: 'Atharv Vatsal',
      url: SEO_CONFIG.siteUrl,
    },
    ...(type === 'article' && article
      ? {
          headline: title,
          datePublished: article.publishedTime,
          dateModified: article.modifiedTime || article.publishedTime,
          keywords: article.tags?.join(', '),
        }
      : {}),
  };

  return (
    <Helmet>
      {/* Basic Meta */}
      <title>{siteTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <meta name="author" content="Atharv Vatsal" />
      <meta name="theme-color" content={SEO_CONFIG.themeColor} />
      <link rel="canonical" href={metaUrl} />

      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title || SEO_CONFIG.defaultTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:site_name" content={SEO_CONFIG.siteName} />
      <meta property="og:locale" content={SEO_CONFIG.locale} />

      {/* Article-specific OG tags */}
      {type === 'article' && article?.publishedTime && (
        <meta property="article:published_time" content={article.publishedTime} />
      )}
      {type === 'article' && article?.modifiedTime && (
        <meta property="article:modified_time" content={article.modifiedTime} />
      )}
      {type === 'article' &&
        article?.tags?.map((tag) => (
          <meta property="article:tag" content={tag} key={tag} />
        ))}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={SEO_CONFIG.twitterHandle} />
      <meta name="twitter:creator" content={SEO_CONFIG.twitterHandle} />
      <meta name="twitter:title" content={title || SEO_CONFIG.defaultTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;