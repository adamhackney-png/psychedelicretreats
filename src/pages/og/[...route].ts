import { OGImageRoute } from 'astro-og-canvas';
import { getCollection } from 'astro:content';
import { SITE } from '../../lib/site';

const guides = await getCollection('guides');
const news = await getCollection('news');

const pages: Record<string, { title: string; description: string }> = {
  home: { title: SITE.name, description: SITE.description },
};

for (const guide of guides) {
  pages[`guides/${guide.id}`] = { title: guide.data.title, description: guide.data.description };
}
for (const item of news) {
  pages[`news/${item.id}`] = { title: item.data.title, description: item.data.description };
}

export const { getStaticPaths, GET } = await OGImageRoute({
  pages,
  getImageOptions: (_path, page: { title: string; description: string }) => ({
    title: page.title,
    description: page.description,
    bgGradient: [[250, 246, 239]],
    padding: 80,
    font: {
      title: {
        color: [26, 39, 26],
        size: 64,
        weight: 'Bold',
      },
      description: {
        color: [86, 83, 73],
        size: 32,
      },
    },
  }),
});
