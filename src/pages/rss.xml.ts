import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../lib/site';

export async function GET(context: APIContext) {
  const guides = await getCollection('guides', (entry) => !entry.data.draft);
  const news = await getCollection('news', (entry) => !entry.data.draft);

  const items = [
    ...guides.map((g) => ({
      title: g.data.title,
      description: g.data.description,
      pubDate: g.data.publishedAt,
      link: `/guides/${g.id}/`,
    })),
    ...news.map((n) => ({
      title: n.data.title,
      description: n.data.description,
      pubDate: n.data.publishedAt,
      link: `/news/${n.id}/`,
    })),
  ].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items,
  });
}
