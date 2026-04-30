import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

const baseTitle = "The Redeemed Assemblies, Availeth City";
const baseDescription = "Welcome to The Redeemed Assemblies, Availeth City — a Christ-centered ministry under the leadership of Pastor Efe Ovenseri in London.";
const defaultImage = "https://res.cloudinary.com/dg5zoqaxo/image/upload/f_auto,q_auto/pastor-efe/og/efe-preview.jpg"; // Updated to use Cloudinary OG image

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
