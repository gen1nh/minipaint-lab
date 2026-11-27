import { referenceColors } from './reference-colors';
import type { CatalogPaint } from './catalog';
import { mixPigments } from './spectral-mix';
function lab(hex: string) {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) throw new RangeError('Invalid color');
  const [r, g, b] = [1, 3, 5].map((i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b),
    m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b),
    s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}
type Lab = ReturnType<typeof lab>;
function distance(x: Lab, y: Lab) {
  return Math.hypot(x[0]! - y[0]!, x[1]! - y[1]!, x[2]! - y[2]!) * 100;
}
export function colorDistance(a: string, b: string) {
  return distance(lab(a), lab(b));
}
const labCache = new WeakMap<CatalogPaint, { hex: string; color: Lab }>();

function withLab(paints: readonly CatalogPaint[]) {
  return paints.map((paint) => {
    let entry = labCache.get(paint);
    if (!entry || entry.hex !== paint.hex) {
      entry = { hex: paint.hex, color: lab(paint.hex) };
      labCache.set(paint, entry);
    }
    return { paint, color: entry.color };
  });
}
function rank(target: Lab, entries: ReturnType<typeof withLab>, limit: number) {
  if (limit === 1) {
    let closest: { paint: CatalogPaint; distance: number } | undefined;
    for (const { paint, color } of entries) {
      const delta = distance(target, color);
      if (!closest || delta < closest.distance)
        closest = { paint, distance: delta };
    }
    return closest ? [closest] : [];
  }
  return entries
    .map(({ paint, color }) => ({ paint, distance: distance(target, color) }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);
}
export function matchPaints(
  target: string,
  paints: readonly CatalogPaint[],
  limit = 12,
) {
  return rank(lab(target), withLab(paints), limit);
}
export function reverseMix(
  target: string,
  paints: readonly CatalogPaint[],
  advanced = false,
) {
  const targetLab = lab(target);
  const entries = withLab(paints);
  const candidates = rank(targetLab, entries, 12).map((x) => x.paint);
  const results: {
    ingredients: { paint: CatalogPaint; drops: number }[];
    hex: string;
    distance: number;
  }[] = [];
  for (let i = 0; i < candidates.length; i++)
    for (let j = i + 1; j < candidates.length; j++)
      for (const [a, b] of [
        [1, 1],
        [1, 2],
        [2, 1],
        [1, 3],
        [3, 1],
      ] as const) {
        const ingredients = [
          { paint: candidates[i]!, drops: a },
          { paint: candidates[j]!, drops: b },
        ];
        const hex = mixPigments(
          ingredients.map((x) => ({ hex: x.paint.hex, drops: x.drops })),
        );
        results.push({
          ingredients,
          hex,
          distance: distance(targetLab, lab(hex)),
        });
      }
  if (advanced) {
    const seeds = [...results]
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 12);
    const anchors = referenceColors;
    const extras = [
      ...new Set([
        ...candidates,
        ...anchors.flatMap((h) => rank(lab(h), entries, 1).map((x) => x.paint)),
      ]),
    ];
    for (const seed of seeds)
      for (const paint of extras) {
        if (seed.ingredients.some((x) => x.paint === paint)) continue;
        for (const drops of [1, 2, 3]) {
          const ingredients = [...seed.ingredients, { paint, drops }];
          const hex = mixPigments(
            ingredients.map((x) => ({ hex: x.paint.hex, drops: x.drops })),
          );
          results.push({
            ingredients,
            hex,
            distance: distance(targetLab, lab(hex)),
          });
        }
      }
  }
  return results.sort((a, b) => a.distance - b.distance).slice(0, 5);
}
