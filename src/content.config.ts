import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

const vettingStatus = z.enum(['stated', 'unverified']);

const listings = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/listings' }),
  schema: z.object({
    name: z.string(),
    categories: z.array(
      z.enum(['psilocybin', 'ayahuasca', 'san-pedro-and-other', 'breathwork', 'cannabis', 'luxury', 'ketamine', 'psychedelic-assisted-therapy', 'integration']),
    ),
    mode: z.enum(['standard', 'neutral']),
    destinationSlug: z.string(),
    country: z.string(),
    region: z.string().optional(),
    priceBandAUD: z.enum(['under3k', '3k-6k', '6k-10k', '10kplus']).optional(),
    durationDays: z.number().int().positive().optional(),
    languages: z.array(z.string()).default(['English']),
    groupSizeMax: z.number().int().positive().optional(),
    website: z.url(),
    affiliateUrl: z.url().optional(),
    enquiryEnabled: z.boolean().default(false),
    contactEmail: z.email().optional(),
    claimed: z.boolean().default(false),
    featuredTier: z.enum(['featured', 'premium']).optional(),
    vetting: z.object({
      legalJurisdiction: vettingStatus,
      medicalScreening: vettingStatus,
      facilitatorExperience: vettingStatus,
      emergencyProtocol: vettingStatus,
      independentReviews: vettingStatus,
      pricingDisclosed: vettingStatus,
    }),
    sourceUrls: z.array(z.url()).min(1),
    images: z.array(z.string()).default([]),
    summary: z.string().max(200),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  }),
});

const sourceSchema = z.object({ title: z.string(), url: z.url() });
const faqSchema = z.object({ q: z.string(), a: z.string() });

const guides = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(200),
    cluster: z.enum(['legal', 'retreats', 'safety', 'adjacent', 'news']).optional(),
    authorSlug: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    lastReviewed: z.coerce.date().optional(),
    sources: z.array(sourceSchema).default([]),
    faq: z.array(faqSchema).default([]),
    relatedListings: z.array(z.string()).default([]),
    draft: z.boolean().default(true),
  }),
});

const news = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(200),
    cluster: z.literal('news').default('news'),
    authorSlug: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    lastReviewed: z.coerce.date().optional(),
    sources: z.array(sourceSchema).default([]),
    faq: z.array(faqSchema).default([]),
    relatedListings: z.array(z.string()).default([]),
    draft: z.boolean().default(true),
  }),
});

const destinations = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/destinations' }),
  schema: z.object({
    name: z.string(),
    legalStatus: z.object({
      summary: z.string(),
      details: z.string(),
      sourceUrls: z.array(z.url()).min(1),
    }),
    costTableAUD: z.array(
      z.object({
        item: z.string(),
        low: z.number(),
        high: z.number(),
        notes: z.string().optional(),
      }),
    ),
    faq: z.array(faqSchema).default([]),
  }),
});

const authors = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/authors' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    bio: z.string(),
    avatar: z.string().optional(),
  }),
});

export const collections = { listings, guides, news, destinations, authors };
