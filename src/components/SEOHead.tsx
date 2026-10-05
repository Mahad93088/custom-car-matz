import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalPath?: string;
  ogType?: 'website' | 'article' | 'product';
  ogImage?: string;
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
}

export function SEOHead({
  title,
  description,
  canonicalPath = '',
  ogType = 'website',
  ogImage = '/og-image.jpg',
  jsonLd
}: SEOHeadProps) {
  useEffect(() => {
    // 1. Update Title
    const fullTitle = title.includes('Custom Car Mats') ? title : `${title} | Custom Car Mats UK`;
    document.title = fullTitle;

    // Helper to set or create meta tag
    const setMetaTag = (attribute: string, attributeValue: string, content: string) => {
      let element = document.querySelector(`meta[${attribute}="${attributeValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper to set or create link tag
    const setLinkTag = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // 2. Standard Meta Tags
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'robots', 'index, follow');

    // 3. OpenGraph Social Meta Tags
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:site_name', 'Custom Car Mats UK');

    const currentUrl = typeof window !== 'undefined'
      ? `${window.location.origin}${canonicalPath ? (canonicalPath.startsWith('/') ? canonicalPath : '/' + canonicalPath) : window.location.pathname}`
      : 'https://customcarmats.co.uk';

    setMetaTag('property', 'og:url', currentUrl);
    setLinkTag('canonical', currentUrl);

    if (ogImage) {
      const fullImageUrl = ogImage.startsWith('http') ? ogImage : `${window.location.origin}${ogImage.startsWith('/') ? '' : '/'}${ogImage}`;
      setMetaTag('property', 'og:image', fullImageUrl);
      setMetaTag('name', 'twitter:image', fullImageUrl);
    }

    // 4. Twitter Card Meta Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', description);

    // 5. Schema.org Structured Data (JSON-LD)
    const scriptId = 'custom-carmats-jsonld';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (jsonLd) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = scriptId;
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(jsonLd);
    } else if (scriptTag) {
      scriptTag.remove();
    }

    return () => {
      // Cleanup custom JSON-LD on unmount if needed
      const tag = document.getElementById(scriptId);
      if (tag) tag.remove();
    };
  }, [title, description, canonicalPath, ogType, ogImage, jsonLd]);

  return null;
}
