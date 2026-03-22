import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
}

const baseTitle = "Pastor Efe Ovenseri";
const baseDescription = "Pastor Efe Ovenseri | Global Ministry & Leadership";

export function SEO({ title, description }: SEOProps) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${baseTitle}` : baseTitle;
    const fullDescription = description || baseDescription;

    document.title = fullTitle;

    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', fullDescription);
  }, [title, description]);

  return null;
}
