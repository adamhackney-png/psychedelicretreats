import { SITE } from './site';

export interface SeoProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
}

export function pageTitle(title: string) {
  return title === SITE.name ? title : `${title} | ${SITE.shortName}`;
}

export function canonicalUrl(path: string) {
  const normalised = path.startsWith('/') ? path : `/${path}`;
  return new URL(normalised, SITE.url).toString();
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    url: SITE.url,
    email: SITE.contactEmail,
    description: SITE.description,
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: canonicalUrl(item.path),
    })),
  };
}

export function faqJsonLd(faq: { q: string; a: string }[]) {
  if (!faq.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

export function articleJsonLd(opts: {
  headline: string;
  description: string;
  path: string;
  authorName: string;
  publishedAt: Date;
  updatedAt: Date;
  isNews?: boolean;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': opts.isNews ? 'NewsArticle' : 'Article',
    headline: opts.headline,
    description: opts.description,
    url: canonicalUrl(opts.path),
    datePublished: opts.publishedAt.toISOString(),
    dateModified: opts.updatedAt.toISOString(),
    author: { '@type': 'Person', name: opts.authorName },
    publisher: { '@type': 'Organization', name: SITE.name },
  };
}

export function itemListJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: canonicalUrl(item.path),
    })),
  };
}
