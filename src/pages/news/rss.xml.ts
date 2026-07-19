import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../../lib/site';

export async function GET(context: APIContext) {
  const news = (await getCollection('news', (entry) => !entry.data.draft)).sort(
    (a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf(),
  );

  return rss({
    title: `${SITE.name} — News`,
    description: 'Legal and regulatory updates relevant to psychedelic retreats and Australian clinical pathways.',
    site: context.site ?? SITE.url,
    items: news.map((item) => ({
      title: item.data.title,
      description: item.data.description,
      pubDate: item.data.publishedAt,
      link: `/news/${item.id}/`,
    })),
  });
}
