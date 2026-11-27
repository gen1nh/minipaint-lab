export const primers = [
  { name: 'Branco', hex: '#ffffff' },
  { name: 'Cinza', hex: '#808080' },
  { name: 'Preto', hex: '#151515' },
  { name: 'Marrom', hex: '#795548' },
] as const;
export type PrimerSetup = {
  hex: (typeof primers)[number]['hex'];
  layers: number;
  tested: boolean;
};
export const defaultPrimer: PrimerSetup = {
  hex: primers[0].hex,
  layers: 1,
  tested: false,
};

export function isPrimerSetup(value: unknown): value is PrimerSetup {
  if (!value || typeof value !== 'object') return false;
  const { hex, layers, tested } = value as PrimerSetup;
  return (
    primers.some((primer) => primer.hex === hex) &&
    Number.isInteger(layers) &&
    layers >= 1 &&
    layers <= 10 &&
    typeof tested === 'boolean'
  );
}
