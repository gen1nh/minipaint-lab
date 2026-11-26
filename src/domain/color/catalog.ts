export type CatalogPaint = {
  brand: string;
  name: string;
  code: string;
  range: string;
  hex: string;
};
export function parseCatalog(data: unknown): CatalogPaint[] {
  if (!data || typeof data !== 'object') throw new Error('Invalid catalog');
  const { brand, rows } = data as { brand: unknown; rows: unknown };
  if (typeof brand !== 'string' || !Array.isArray(rows))
    throw new Error('Invalid catalog');
  return rows.map((row: unknown): CatalogPaint => {
    if (!Array.isArray(row) || row.length !== 4)
      throw new Error('Invalid paint');
    const [name, code, range, hex] = row as unknown[];
    if (
      typeof name !== 'string' ||
      typeof code !== 'string' ||
      typeof range !== 'string' ||
      typeof hex !== 'string' ||
      !/^#[0-9a-f]{6}$/i.test(hex)
    )
      throw new Error('Invalid paint');
    return { brand, name, code: code === 'null' ? '' : code, range, hex };
  });
}
export function searchCatalog(paints: CatalogPaint[], query: string) {
  const norm = (s: string) =>
    s
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  const terms = norm(query).trim().split(/\s+/);
  const matches: CatalogPaint[] = [];
  for (const paint of paints) {
    const keywords = norm(
      [paint.brand, paint.name, paint.code, paint.range].join(' '),
    );
    if (!terms.every((term) => keywords.includes(term))) continue;
    matches.push(paint);
    if (matches.length === 30) break;
  }
  return matches;
}
