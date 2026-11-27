import { readFileSync } from 'node:fs';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { publicHtml } from './build/public-html';

function catalogAsset(): Plugin {
  const read = (file: string) =>
    JSON.parse(
      readFileSync(
        new URL('./public/catalog/' + file, import.meta.url),
        'utf8',
      ),
    );
  const bundle = () =>
    JSON.stringify(
      (read('index.json') as string[]).map((brand) => read(brand + '.json')),
    );
  return {
    name: 'catalog-asset',
    configureServer(server) {
      let source: string | undefined;
      server.watcher.on('change', (file) => {
        if (file.replaceAll('\\', '/').includes('/public/catalog/'))
          source = undefined;
      });
      server.middlewares.use('/catalog.json', (_request, response) => {
        source ??= bundle();
        response.setHeader('Content-Type', 'application/json; charset=utf-8');
        response.end(source);
      });
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'catalog.json',
        source: bundle(),
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), catalogAsset(), publicHtml()],
});
