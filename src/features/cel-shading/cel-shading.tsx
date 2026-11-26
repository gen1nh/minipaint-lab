import { lazy, Suspense, useMemo, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { celPalette } from '../../domain/color/cel-palette';
import { CatalogPicker } from '../../ui/catalog-picker';
import type { CatalogPaint } from '../../domain/color/catalog';
import {
  regions,
  type ArtworkChoice,
  type Region,
  type RegionPalettes,
} from './artwork-colors';
const CelArtwork = lazy(() => import('./cel-artwork'));
import { StudioHeading } from '../../ui/studio-heading';

type RegionSettings = {
  paint?: CatalogPaint;
  contrast: number;
  temperature: number;
};

const defaultSettings: RegionSettings = { contrast: 0.8, temperature: 0 };

export function CelShading({ onFind }: { onFind: (hex: string) => void }) {
  const [choice, setChoice] = useState<ArtworkChoice>('kid');
  const [region, setRegion] = useState<Region>('clothes');
  const [settings, setSettings] = useState<
    Partial<Record<Region, RegionSettings>>
  >({});
  const active =
    choice === 'wikipe'
      ? regions[0]
      : regions.find((item) => item.id === region)!;
  const { paint, contrast, temperature } =
    settings[active.id] ?? defaultSettings;
  const activeHasPalette =
    !!paint || active.id === 'clothes' || choice === 'wikipe';
  const displayBase =
    paint?.hex ?? (activeHasPalette ? '#d46b26' : active.original);
  const palette = celPalette(displayBase, contrast, temperature);
  const palettes = useMemo(() => {
    const result: RegionPalettes = {};
    for (const { id } of regions) {
      const entry = settings[id] ?? defaultSettings;
      if (
        entry.paint ||
        id === 'clothes' ||
        (choice === 'wikipe' && id === 'hair')
      ) {
        result[id] = celPalette(
          entry.paint?.hex ?? '#d46b26',
          entry.contrast,
          entry.temperature,
        ).map(({ hex }) => hex);
      }
    }

    return result;
  }, [choice, settings]);

  function updateRegion(patch: Partial<RegionSettings>) {
    setSettings((current) => ({
      ...current,
      [active.id]: { ...(current[active.id] ?? defaultSettings), ...patch },
    }));
  }
  return (
    <div className="tool-page">
      <StudioHeading
        title="Paleta cel shading"
        description="Escolha uma tinta para cada parte da ilustração e veja as cores juntas."
      />
      <div className="cel-workbench">
        <section className="tool-surface cel-editor" aria-label="Editar paleta">
          <div className="cel-zone-picker">
            <h2>Escolha a região</h2>
            <div
              className="tool-modes cel-regions"
              role="group"
              aria-label="Região para editar"
            >
              {(choice === 'wikipe' ? regions.slice(0, 1) : regions).map(
                (item) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={active.id === item.id}
                    onClick={() => setRegion(item.id)}
                  >
                    <span
                      className="cel-region-chip"
                      style={{
                        background:
                          settings[item.id]?.paint?.hex ?? item.original,
                      }}
                      aria-hidden="true"
                    />
                    <span>
                      <strong>{item.label}</strong>
                      <small>
                        {settings[item.id]?.paint?.name ??
                          (item.id === 'clothes' || choice === 'wikipe'
                            ? 'Cor de exemplo'
                            : 'Cor original')}
                      </small>
                    </span>
                  </button>
                ),
              )}
            </div>
          </div>
          <div className="tool-settings cel-settings">
            <h2>Tinta-base · {active.label}</h2>
            <CatalogPicker
              key={active.id}
              selected={
                paint ?? {
                  name: activeHasPalette ? 'Laranja' : 'Cor original',
                  brand: activeHasPalette ? 'Cor de exemplo' : '',
                  hex: displayBase,
                }
              }
              action={paint ? 'Trocar tinta' : 'Escolher tinta'}
              onSelect={(paint) => updateRegion({ paint })}
            />
          </div>
          {activeHasPalette && (
            <details className="studio-disclosure cel-light-settings">
              <summary>Luz e sombra</summary>
              <div className="tool-settings">
                <label className="studio-range">
                  <span>
                    Contraste <strong>{Math.round(contrast * 100)}%</strong>
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step=".05"
                    value={contrast}
                    onChange={(event) =>
                      updateRegion({ contrast: Number(event.target.value) })
                    }
                  />
                </label>
                <label className="studio-range">
                  <span>
                    Temperatura da luz{' '}
                    <strong>
                      {temperature === 0
                        ? 'Neutra'
                        : temperature > 0
                          ? 'Quente'
                          : 'Fria'}
                    </strong>
                  </span>
                  <input
                    type="range"
                    min="-1"
                    max="1"
                    step=".1"
                    value={temperature}
                    onChange={(event) =>
                      updateRegion({ temperature: Number(event.target.value) })
                    }
                  />
                </label>
              </div>
            </details>
          )}
        </section>
        <section
          className="tool-surface cel-preview"
          aria-label="Prévia da pintura"
        >
          <h2>Prévia da pintura</h2>
          <Suspense
            fallback={
              <p className="cel-stage cel-artwork-loading" role="status">
                Carregando ilustração…
              </p>
            }
          >
            <CelArtwork
              choice={choice}
              onChoose={setChoice}
              palettes={palettes}
            />
          </Suspense>
        </section>
        {activeHasPalette && (
          <section className="tool-surface cel-tones">
            <h2>Da sombra ao brilho · {active.label}</h2>
            <ul className="swatch-grid cel-palette">
              {palette.map(({ role, hex }) => (
                <li key={role}>
                  <button
                    className="swatch-action"
                    aria-label={`${role}, ${hex}. Buscar tinta`}
                    onClick={() => onFind(hex)}
                  >
                    <span
                      className="swatch-block"
                      style={{ background: hex }}
                      aria-hidden="true"
                    />
                    <strong>{role}</strong>
                    <small>
                      {hex} <ArrowUpRight size={15} aria-hidden="true" />
                    </small>
                  </button>
                </li>
              ))}
            </ul>
            <p className="muted">
              Toque em um tom para buscar tintas próximas. A paleta é um estudo
              digital de luz.
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
