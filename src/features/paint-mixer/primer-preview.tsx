import { primers, type PrimerSetup } from '../../domain/color/primer';
import { blendAppearance, layerCoverage } from '../../domain/color/appearance';

const coverage = 0.65;

export function PrimerPreview({
  hex,
  setup,
  onChange,
}: {
  hex: string;
  setup: PrimerSetup;
  onChange: (next: PrimerSetup) => void;
}) {
  const primer = primers.find((item) => item.hex === setup.hex)!;
  const { layers } = setup;
  const result = blendAppearance(
    hex,
    primer.hex,
    layerCoverage(coverage, layers),
  );

  return (
    <div className="primer-preview">
      <div className="primer-options" role="group" aria-label="Cor do primer">
        {primers.map((option) => (
          <button
            type="button"
            key={option.hex}
            aria-pressed={primer === option}
            onClick={() => {
              if (option !== primer)
                onChange({ ...setup, hex: option.hex, tested: false });
            }}
          >
            <span
              className="paint-chip"
              style={{ background: option.hex }}
              aria-hidden="true"
            />
            {option.name}
          </button>
        ))}
      </div>
      <dl className="primer-comparison">
        <div>
          <dt>Primer {primer.name.toLowerCase()}</dt>
          <dd>
            <span
              className="primer-swatch"
              style={{ background: primer.hex }}
            />
          </dd>
        </div>
        <div>
          <dt>Depois de pintar</dt>
          <dd>
            <span className="primer-swatch" style={{ background: result }} />
            <span className="primer-result" role="status">
              {result}
            </span>
          </dd>
        </div>
      </dl>
      <label className="studio-range">
        <span>
          Camadas de tinta <strong>{layers}</strong>
        </span>
        <input
          type="range"
          min={1}
          max={10}
          value={layers}
          onChange={(event) =>
            onChange({
              ...setup,
              layers: Number(event.target.value),
              tested: false,
            })
          }
        />
      </label>
      <label className="inline-check">
        <input
          type="checkbox"
          checked={setup.tested}
          onChange={(event) =>
            onChange({ ...setup, tested: event.target.checked })
          }
        />
        Testei esta aplicação na peça
      </label>
      <p className="muted">
        Simulação com cobertura ilustrativa de 65% por camada.
      </p>
    </div>
  );
}
