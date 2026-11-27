import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import type { Plugin } from 'vite';
import { publicPages } from '../src/app/public-pages';

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');

export function publicHtml(): Plugin {
  const host =
    process.env.VERCEL_ENV === 'production' &&
    process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const configuredUrl =
    process.env.SITE_URL || (host ? 'https://' + host : undefined);
  const origin = configuredUrl ? new URL(configuredUrl).origin : undefined;
  const preview = process.env.VERCEL_ENV === 'preview';

  return {
    name: 'pincel-public-html',
    apply: 'build',
    writeBundle(output) {
      const directory = resolve(output.dir ?? 'dist');
      const entry = readFileSync(resolve(directory, 'index.html'), 'utf8');
      const pages = Object.entries(publicPages);
      const links = pages
        .map(
          ([path, page]) =>
            '<li><a href="' +
            path +
            '">' +
            escapeHtml(page.heading) +
            '</a></li>',
        )
        .join('');
      for (const [path, page] of pages) {
        const title = escapeHtml(page.title);
        const description = escapeHtml(page.description);
        const url = origin ? escapeHtml(origin + path) : undefined;
        const metadata = [
          '<meta name="description" content="' + description + '">',
          '<meta property="og:title" content="' + title + '">',
          '<meta property="og:description" content="' + description + '">',
          '<meta property="og:type" content="website">',
          '<meta property="og:locale" content="pt_BR">',
          ...(url
            ? [
                '<link rel="canonical" href="' + url + '">',
                '<meta property="og:url" content="' + url + '">',
              ]
            : []),
          ...(preview ? ['<meta name="robots" content="noindex">'] : []),
        ];
        const content =
          '<main><h1>' +
          escapeHtml(page.heading) +
          '</h1><p>' +
          description +
          '</p><nav aria-label="Páginas do Pincel Guia"><ul>' +
          links +
          '</ul></nav></main>';
        const html = entry
          .replace(
            /<title>[^<]*<\/title>\s*(?:<meta\s+name="description"[^>]*>)?/,
            '<title>' + title + '</title>\n    ' + metadata.join('\n    '),
          )
          .replace(
            '<div id="root"></div>',
            '<div id="root">' + content + '</div>',
          );
        const file = resolve(
          directory,
          path === '/' ? 'index.html' : path.slice(1) + '.html',
        );
        mkdirSync(dirname(file), { recursive: true });
        writeFileSync(file, html);
      }
      writeFileSync(
        resolve(directory, 'robots.txt'),
        'User-agent: *\nAllow: /\n' +
          (origin && !preview ? 'Sitemap: ' + origin + '/sitemap.xml\n' : ''),
      );
      if (origin && !preview) {
        const urls = pages
          .map(
            ([path]) =>
              '<url><loc>' + escapeHtml(origin + path) + '</loc></url>',
          )
          .join('\n');
        writeFileSync(
          resolve(directory, 'sitemap.xml'),
          '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
            urls +
            '\n</urlset>\n',
        );
      }
    },
  };
}
