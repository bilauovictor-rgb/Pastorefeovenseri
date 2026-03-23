import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

const baseTitle = "Pastor Efe Ovenseri";
const baseDescription = "Pastor Efe Ovenseri | Global Ministry & Leadership";
const defaultImage = "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2073&auto=format&fit=crop"; // Default fallback image

export function SEO({ title, description, image, url, type = 'website' }: SEOProps) {
  const fullTitle = title ? `${title} | ${baseTitle}` : baseTitle;
  const fullDescription = description || baseDescription;
  const ogImage = image || defaultImage;
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={currentUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={fullDescription} />
      <meta property="twitter:image" content={ogImage} />
    </Helmet>
  );
}
