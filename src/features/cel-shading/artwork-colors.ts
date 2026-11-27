export const regions = [
  { id: 'hair', label: 'Cabelo', original: '#414141' },
  { id: 'body', label: 'Corpo', original: '#fedfcd' },
  { id: 'clothes', label: 'Roupa', original: '#d46b26' },
] as const;
export type Region = (typeof regions)[number]['id'];
export type RegionPalettes = Partial<Record<Region, readonly string[]>>;
export type ArtworkChoice = 'kid' | 'goku' | 'wikipe';

// Each region and tone is attached to its path in the authored SVG.
export function colorGoku(svg: string, palettes: RegionPalettes) {
  return svg.replace(
    /<path\b[^>]*\bdata-cel="(hair|body|clothes)-([0-4])"[^>]*>/g,
    (path, region: Region, tone: string) => {
      const hex = palettes[region]?.[Number(tone)];
      return hex ? path.replace(/fill="[^"]+"/, `fill="${hex}"`) : path;
    },
  );
}
