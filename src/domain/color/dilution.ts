export type Preparation = {
  application: 'color' | 'brush' | 'airbrush';
  diluent?: 'water' | 'medium' | 'airbrush-thinner';
};

export function isPreparation(value: unknown): value is Preparation {
  if (!value || typeof value !== 'object') return false;
  const { application, diluent } = value as Preparation;
  return (
    (application === 'color' && diluent === undefined) ||
    (application === 'brush' &&
      (diluent === undefined || diluent === 'water' || diluent === 'medium')) ||
    (application === 'airbrush' &&
      (diluent === undefined || diluent === 'airbrush-thinner'))
  );
}

export function airbrushStartingPoint(
  paints: readonly {
    brand: string;
    name: string;
    range?: string;
    code?: string;
  }[],
) {
  if (!paints.length || !paints.every((paint) => paint.brand === 'Vallejo'))
    return;
  if (
    paints.every(
      (paint) =>
        (paint.range ?? paint.name.split(' · ').at(-1)) === 'Model Air',
    )
  ) {
    return {
      parts: 3,
      label: 'Model Air · 1 parte de diluente para 3 de tinta, se precisar.',
      source:
        'https://acrylicosvallejo.com/wp-content/uploads/2022/05/vallejo-stepbystep-model-air-basic-use-EN.pdf',
    };
  }
  if (
    paints.every(
      (paint) => (paint.code ?? paint.name.split(' · ')[1]) === '70.964',
    )
  ) {
    return {
      parts: 1,
      label: 'Field Blue 70.964 · 1 parte de diluente para 1 de tinta.',
      source:
        'https://acrylicosvallejo.com/wp-content/uploads/2022/10/vallejo-stepbystep-model-color-basic-use-guide-for-airbrushing-EN.pdf',
    };
  }
}
