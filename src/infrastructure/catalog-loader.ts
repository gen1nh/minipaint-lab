import { parseCatalog, type CatalogPaint } from '../domain/color/catalog';

let pending: Promise<CatalogPaint[]> | undefined;

export function loadCatalog() {
  pending ??= fetch(import.meta.env.BASE_URL + 'catalog.json')
    .then(async (response) => {
      if (!response.ok) throw new Error('Catalog unavailable');
      const data: unknown = await response.json();
      if (!Array.isArray(data)) throw new Error('Invalid catalog');
      return data.flatMap(parseCatalog);
    })
    .catch((error) => {
      pending = undefined;
      throw error;
    });
  return pending;
}
