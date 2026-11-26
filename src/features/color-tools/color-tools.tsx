import { StudioHeading } from '../../ui/studio-heading';
import { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  ImagePlus,
  Pipette,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { useCatalog } from '../../infrastructure/use-catalog';
import { matchPaints, reverseMix } from '../../domain/color/match';
import { Corrector } from './corrector';
import { ImageExtractor } from './image-extractor';
import type { RecipePaint } from '../../domain/color/saved-recipe';
import { ColorField } from '../../ui/color-field';

const modes = [
  { id: 'search', label: 'Buscar tinta', Icon: Search },
  { id: 'image', label: 'Extrair de imagem', Icon: ImagePlus },
  { id: 'correct', label: 'Corrigir mistura', Icon: Pipette },
] as const;
type Mode = (typeof modes)[number]['id'];

export function ColorTools({
  initialTarget = '#d46b26',
  autoSearch = false,
  onMix,
}: {
  initialTarget?: string;
  autoSearch?: boolean;
  onMix: (paints: RecipePaint[]) => void;
}) {
  const { paints, status, brands, retry } = useCatalog();
  const [mode, setMode] = useState<Mode>('search');
  const [target, setTarget] = useState(initialTarget);
  const [advanced, setAdvanced] = useState(false);
  const [brand, setBrand] = useState('');
  const [range, setRange] = useState('');
  const [searchRequested, setSearchRequested] = useState(autoSearch);
  const [showAll, setShowAll] = useState(!autoSearch);
  const [showMixes, setShowMixes] = useState(false);
  const ranges = useMemo(
    () =>
      [
        ...new Set(
          paints
            .filter((paint) => !brand || paint.brand === brand)
            .map((paint) => paint.range)
            .filter(Boolean),
        ),
      ].sort(),
    [paints, brand],
  );
  const pool = useMemo(
    () =>
      paints.filter(
        (paint) =>
          (!brand || paint.brand === brand) &&
          (!range || paint.range === range),
      ),
    [paints, brand, range],
  );
  const matches = useMemo(
    () =>
      searchRequested && paints.length ? matchPaints(target, pool, 8) : null,
    [searchRequested, paints.length, target, pool],
  );
  const recipes = useMemo(
    () =>
      searchRequested && showMixes && paints.length
        ? reverseMix(target, pool, advanced)
        : [],
    [searchRequested, showMixes, paints.length, target, pool, advanced],
  );

  function chooseColor(hex: string) {
    setTarget(hex);
    setSearchRequested(false);
    setShowMixes(false);
  }

  return (
    <div className="tool-page">
      <StudioHeading
        title="Encontrar cores"
        description="Busque tintas e misturas próximas, extraia cores de uma imagem ou corrija uma mistura."
      />
      <div
        className="tool-modes"
        role="group"
        aria-label="Ferramentas de busca"
      >
        {modes.map(({ id, label, Icon }) => (
          <button
            key={id}
            aria-pressed={mode === id}
            onClick={() => setMode(id)}
          >
            <Icon size={18} aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>
      <div hidden={mode !== 'search'}>
        <section className="tool-surface color-search">
          <ColorField
            label="Cor desejada"
            hex={target}
            onChange={chooseColor}
          />
          <div className="tool-settings">
            <h2>Que cor você quer pintar?</h2>
            <button
              className="tool-primary"
              disabled={!paints.length}
              onClick={() => setSearchRequested(true)}
            >
              <Search size={18} aria-hidden="true" /> Buscar tintas próximas
            </button>
            {status && <p role="status">{status}</p>}
            {retry && (
              <button className="tool-secondary" type="button" onClick={retry}>
                Tentar novamente
              </button>
            )}
            <details className="studio-disclosure">
              <summary>
                <SlidersHorizontal size={16} aria-hidden="true" /> Filtros de
                busca
              </summary>
              <label>
                Fabricante
                <select
                  value={brand}
                  onChange={(event) => {
                    setBrand(event.target.value);
                    setRange('');
                  }}
                >
                  <option value="">Todas as marcas</option>
                  {brands.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label>
                Linha da tinta
                <select
                  value={range}
                  onChange={(event) => setRange(event.target.value)}
                >
                  <option value="">Todas as linhas</option>
                  {ranges.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label className="inline-check">
                <input
                  type="checkbox"
                  checked={advanced}
                  onChange={(event) => {
                    setAdvanced(event.target.checked);
                  }}
                />
                Incluir misturas de três tintas
              </label>
            </details>
          </div>
        </section>
        {matches && (
          <div className="tool-results">
            <section>
              <h2>{showAll ? 'Tintas próximas' : 'Tinta mais próxima'}</h2>
              {!matches.length && <p>Nenhuma tinta encontrada.</p>}
              <ul className="swatch-grid">
                {matches.slice(0, showAll ? 8 : 1).map(({ paint }, index) => (
                  <li key={index}>
                    <button
                      className="swatch-action"
                      onClick={() =>
                        onMix([
                          {
                            ...paint,
                            drops: 1,
                          },
                        ])
                      }
                    >
                      <span
                        className="swatch-block"
                        style={{ background: paint.hex }}
                        aria-hidden="true"
                      />
                      <strong>{paint.name}</strong>
                      <small>
                        {[paint.brand, paint.code, paint.range]
                          .filter(Boolean)
                          .join(' · ')}
                      </small>
                      <span className="swatch-link">
                        Usar tinta <ArrowUpRight size={15} aria-hidden="true" />
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              {!showAll && matches.length > 1 && (
                <button
                  className="tool-secondary"
                  onClick={() => setShowAll(true)}
                >
                  Ver mais tintas
                </button>
              )}
            </section>
            <button
              className="tool-secondary"
              aria-expanded={showMixes}
              onClick={() => setShowMixes((visible) => !visible)}
            >
              {showMixes ? 'Ocultar misturas' : 'Ver misturas'}
            </button>
            {showMixes && (
              <section>
                <h2>Misturas sugeridas</h2>
                {!recipes.length && (
                  <p>Nenhuma mistura sugerida para esta busca.</p>
                )}
                <ul className="formula-list">
                  {recipes.map((recipe, index) => (
                    <li key={index}>
                      <span
                        className="swatch-block"
                        style={{ background: recipe.hex }}
                        aria-hidden="true"
                      />
                      <div>
                        <strong>{recipe.hex}</strong>
                        <ul>
                          {recipe.ingredients.map(
                            ({ paint, drops }, ingredient) => (
                              <li key={ingredient}>
                                {drops} gotas · {paint.brand} {paint.name}{' '}
                                {[paint.range, paint.code]
                                  .filter(Boolean)
                                  .join(' · ')}
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                      <button
                        className="tool-secondary"
                        onClick={() =>
                          onMix(
                            recipe.ingredients.map(({ paint, drops }) => ({
                              ...paint,
                              drops,
                            })),
                          )
                        }
                      >
                        Abrir no misturador{' '}
                        <ArrowUpRight size={16} aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            <p className="muted">
              Amostras digitais e misturas aproximadas. Teste em uma amostra
              antes de pintar.
            </p>
          </div>
        )}
      </div>
      <div hidden={mode !== 'image'}>
        <ImageExtractor
          onPick={(hex) => {
            chooseColor(hex);
            setMode('search');
          }}
        />
      </div>
      <div hidden={mode !== 'correct'}>
        <Corrector />
      </div>
    </div>
  );
}
