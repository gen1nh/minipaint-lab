import { defaultPrimer, type PrimerSetup } from '../../domain/color/primer';
import { DilutionControls } from './dilution-controls';
import type { Preparation } from '../../domain/color/dilution';
import { DropStepper } from './drop-stepper';
import { useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Droplet, Pipette, Plus, Trash2 } from 'lucide-react';
import { CatalogPicker } from '../../ui/catalog-picker';
import { StudioHeading } from '../../ui/studio-heading';
import { calculateRecipe } from '../../domain/color/recipe';
import './recipe.css';
import { mixPigments } from '../../domain/color/spectral-mix';
import { SaveRecipe } from './save-recipe';
import { NearestPaint } from './nearest-paint';
import { PrimerPreview } from './primer-preview';
import { paintBrandLabel } from '../../domain/color/saved-recipe';
import type { CatalogPaint } from '../../domain/color/catalog';
type Paint = {
  id: number;
  name: string;
  brand: string;
  hex: string;
  drops: number;
  tintingStrength?: number;
  code?: string;
  range?: string;
  catalog?: CatalogPaint;
};
export function Mixer({
  initialPaints,
  initialThinner = 0,
  initialPreparation,
  initialPrimer,
  primerRequest = 0,
  active = true,
  onDirtyChange,
}: {
  initialPaints?: Omit<Paint, 'id'>[];
  initialThinner?: number;
  initialPreparation?: Preparation;
  initialPrimer?: PrimerSetup;
  primerRequest?: number;
  active?: boolean;
  onDirtyChange?: (dirty: boolean) => void;
} = {}) {
  const [paints, setPaints] = useState<Paint[]>(
    initialPaints?.map((p, i) => ({ ...p, id: i + 1 })) ?? [
      {
        id: 1,
        name: 'Preto',
        brand: 'Personalizada',
        hex: '#202020',
        drops: 2,
      },
      {
        id: 2,
        name: 'Vermelho',
        brand: 'Personalizada',
        hex: '#b82d32',
        drops: 5,
      },
    ],
  );

  const [adding, setAdding] = useState(false);
  const addButton = useRef<HTMLButtonElement>(null);
  const ingredients = useRef<HTMLDivElement>(null);
  const focusPaint = useRef<number | undefined>(undefined);
  const nextId = useRef((initialPaints?.length ?? 2) + 1);
  const [preparation, setPreparation] = useState<Preparation>(
    initialPreparation ?? { application: initialThinner ? 'brush' : 'color' },
  );
  const [thinner, setThinner] = useState(initialThinner);
  const [primer, setPrimer] = useState(initialPrimer);
  const formula = JSON.stringify([paints, preparation, thinner]);
  const previousFormula = useRef(formula);
  useLayoutEffect(() => {
    if (previousFormula.current !== formula) {
      previousFormula.current = formula;
      setPrimer((current) =>
        current?.tested ? { ...current, tested: false } : current,
      );
    }
  }, [formula]);
  const snapshot = JSON.stringify([formula, primer]);
  const baseline = useRef(snapshot);
  useLayoutEffect(() => {
    onDirtyChange?.(baseline.current !== snapshot);
  }, [snapshot, onDirtyChange]);
  useLayoutEffect(() => {
    if (focusPaint.current === undefined) return;
    const target = ingredients.current?.querySelector<HTMLButtonElement>(
      '[data-paint-id="' + focusPaint.current + '"] .catalog-selected',
    );
    (target ?? addButton.current)?.focus();
    focusPaint.current = undefined;
  }, [paints]);
  const result = calculateRecipe(paints, thinner);
  const spectralHex = useMemo(() => mixPigments(paints), [paints]);
  const pair =
    paints.length === 2 && paints[0] && paints[1]
      ? ([paints[0], paints[1]] as const)
      : null;
  const [preview, setPreview] = useState<'mix' | 'primer'>('mix');
  const previewId = useId();
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  const detailTitle = useRef<HTMLHeadingElement>(null);
  const scaleTrigger = useRef<HTMLButtonElement | null>(null);
  useLayoutEffect(() => {
    if (!primerRequest) return;
    scaleTrigger.current = null;
    setSelectedStep(null);
    setPreview('primer');
  }, [primerRequest]);
  const samples = pair
    ? Array.from({ length: 9 }, (_, step) => {
        const drops = [8 - step, step] as const;
        const hex =
          step === 0
            ? pair[0].hex
            : step === 8
              ? pair[1].hex
              : mixPigments([
                  { ...pair[0], drops: drops[0] },
                  { ...pair[1], drops: drops[1] },
                ]);
        return { drops, hex };
      })
    : [];
  const sample = selectedStep === null ? undefined : samples[selectedStep];
  useLayoutEffect(() => {
    if (selectedStep !== null) detailTitle.current?.focus();
    else if (scaleTrigger.current) {
      scaleTrigger.current.focus();
      scaleTrigger.current = null;
    }
  }, [selectedStep]);
  function change(id: number, patch: Partial<Paint>) {
    setPaints((old) => old.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }
  return (
    <>
      <div hidden={Boolean(sample)} className="mixer-content">
        <StudioHeading
          title="Mistura de cores"
          description="Escolha as tintas e ajuste as gotas para criar sua mistura."
        />
        <div className="mix-workbench">
          <div className="mix-editor">
            <section className="tool-surface">
              <div className="mix-ingredient-heading">
                <h2>Escolha as tintas</h2>
                <button
                  type="button"
                  className="tool-secondary"
                  disabled={paints.length >= 100}
                  ref={addButton}
                  aria-expanded={adding}
                  onClick={() => setAdding((open) => !open)}
                >
                  <Plus size={18} aria-hidden="true" /> Adicionar tinta
                </button>
              </div>
              {adding && (
                <fieldset className="ingredient-add">
                  <legend className="sr-only">Tinta {paints.length + 1}</legend>
                  <CatalogPicker
                    selected={{ name: 'Nova tinta', brand: '', hex: '#ffffff' }}
                    action="Fechar busca"
                    fallbackDetails="Escolha no catálogo"
                    initiallyOpen
                    onDismiss={() => {
                      setAdding(false);
                      addButton.current?.focus();
                    }}
                    onSelect={(paint) => {
                      const id = nextId.current++;
                      focusPaint.current = id;
                      setPaints((current) => [
                        ...current,
                        { ...paint, id, drops: 1, catalog: paint },
                      ]);
                    }}
                  />
                </fieldset>
              )}
              <div className="mix-ingredients" ref={ingredients}>
                {paints.map((p, i) => (
                  <fieldset
                    key={p.id}
                    data-paint-id={p.id}
                    className="ingredient"
                  >
                    <legend className="sr-only">Tinta {i + 1}</legend>
                    <div className="ingredient-paint">
                      <CatalogPicker
                        selected={
                          p.catalog ?? { ...p, brand: paintBrandLabel(p.brand) }
                        }
                        fallbackDetails={
                          p.name === 'Nova tinta'
                            ? 'Escolha no catálogo'
                            : 'Cor de exemplo'
                        }
                        onSelect={(paint) =>
                          change(p.id, {
                            ...paint,
                            tintingStrength: 1,
                            catalog: paint,
                          })
                        }
                      />

                      {paints.length > 1 && (
                        <button
                          className="ingredient-remove"
                          aria-label={'Remover tinta ' + (i + 1)}
                          onClick={() => {
                            focusPaint.current = (
                              paints[i + 1] ?? paints[i - 1]
                            )?.id;
                            setPaints((old) =>
                              old.filter((item) => item.id !== p.id),
                            );
                          }}
                        >
                          <Trash2 size={17} aria-hidden="true" />
                        </button>
                      )}
                    </div>
                    <div className="quantity ingredient-quantity">
                      <DropStepper
                        value={p.drops}
                        min={1}
                        label={'Quantidade de gotas da tinta ' + (i + 1)}
                        decreaseLabel={'Diminuir gotas da tinta ' + (i + 1)}
                        increaseLabel={'Aumentar gotas da tinta ' + (i + 1)}
                        onChange={(drops) => change(p.id, { drops })}
                      />
                    </div>
                  </fieldset>
                ))}
              </div>
              <DilutionControls
                paints={paints}
                totalDrops={result.paint}
                preparation={preparation}
                thinner={thinner}
                onChange={(next, drops) => {
                  setPreparation(next);
                  setThinner(drops);
                }}
              />
            </section>
          </div>
          <section
            className="tool-surface mix-preview"
            aria-label="Prévia da mistura"
          >
            <h2>Prévia estimada da mistura</h2>
            <div
              className="mix-preview-tabs"
              role="tablist"
              aria-label="Tipo de prévia"
              onKeyDown={(event) => {
                if (
                  !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(
                    event.key,
                  )
                )
                  return;
                event.preventDefault();
                const next =
                  event.key === 'Home'
                    ? 'mix'
                    : event.key === 'End'
                      ? 'primer'
                      : preview === 'mix'
                        ? 'primer'
                        : 'mix';
                setPreview(next);
                event.currentTarget
                  .querySelector<HTMLButtonElement>(
                    '[data-preview="' + next + '"]',
                  )
                  ?.focus();
              }}
            >
              {(['mix', 'primer'] as const).map((tab) => (
                <button
                  type="button"
                  key={tab}
                  data-preview={tab}
                  role="tab"
                  id={previewId + '-tab-' + tab}
                  aria-selected={preview === tab}
                  aria-controls={previewId + '-panel-' + tab}
                  tabIndex={preview === tab ? 0 : -1}
                  onClick={() => setPreview(tab)}
                >
                  {tab === 'mix' ? 'Mistura' : 'Sobre primer'}
                </button>
              ))}
            </div>
            <div className="mix-preview-views">
              <div
                role="tabpanel"
                id={previewId + '-panel-mix'}
                aria-labelledby={previewId + '-tab-mix'}
                className="mix-preview-panel"
                inert={preview !== 'mix'}
              >
                <div
                  className="mix-result-swatch"
                  style={{ background: spectralHex }}
                  aria-hidden="true"
                />

                <output aria-live="polite">Resultado: {spectralHex}</output>
                <NearestPaint hex={spectralHex} />
                <div className="mix-proportions" aria-hidden="true">
                  {paints.map((p) => (
                    <span
                      key={p.id}
                      style={{ background: p.hex, flexGrow: p.drops }}
                    />
                  ))}
                </div>
                {pair && result.paint > 2 && result.paint < 20000 && (
                  <label className="mix-ratio">
                    <span>
                      Proporção da mistura{' '}
                      <strong>
                        {pair[0].drops} : {pair[1].drops}
                      </strong>
                    </span>
                    <input
                      type="range"
                      min={Math.max(1, result.paint - 10000)}
                      max={Math.min(10000, result.paint - 1)}
                      value={pair[1].drops}
                      onChange={(event) => {
                        const secondDrops = Number(event.target.value);
                        setPaints([
                          { ...pair[0], drops: result.paint - secondDrops },
                          { ...pair[1], drops: secondDrops },
                        ]);
                      }}
                    />
                  </label>
                )}
                <dl className="mix-drop-summary" aria-label="Gotas da mistura">
                  <div>
                    <dt>
                      <Droplet aria-hidden="true" size={16} /> Tinta
                    </dt>
                    <dd>
                      <strong>{result.paint}</strong>{' '}
                      {result.paint === 1 ? 'gota' : 'gotas'}
                    </dd>
                  </div>
                  <div>
                    <dt>
                      <Pipette aria-hidden="true" size={16} /> Diluente
                    </dt>
                    <dd>
                      <strong>{thinner}</strong>{' '}
                      {thinner === 1 ? 'gota' : 'gotas'}
                    </dd>
                  </div>
                </dl>
              </div>
              <div
                role="tabpanel"
                id={previewId + '-panel-primer'}
                aria-labelledby={previewId + '-tab-primer'}
                inert={preview !== 'primer'}
              >
                <PrimerPreview
                  hex={spectralHex}
                  setup={primer ?? defaultPrimer}
                  onChange={setPrimer}
                />
              </div>
            </div>
            <SaveRecipe
              paints={paints}
              thinner={thinner}
              preparation={preparation}
              primer={
                primer ?? (preview === 'primer' ? defaultPrimer : undefined)
              }
              active={active}
              onSaved={() => {
                baseline.current = snapshot;
                onDirtyChange?.(false);
              }}
              hex={spectralHex}
            />
          </section>
          {pair && (
            <section className="tool-surface mix-scale">
              <h2>Escala entre as tintas</h2>
              <p>Toque numa cor para ver as proporções.</p>
              <ol aria-label={`Escala de ${pair[0].name} até ${pair[1].name}`}>
                {samples.map(({ hex }, step) => (
                  <li key={step}>
                    <button
                      type="button"
                      className="scale-sample"
                      aria-label={`Ver mistura ${hex}, ${8 - step} para ${step} gotas`}
                      onClick={(event) => {
                        scaleTrigger.current = event.currentTarget;
                        setSelectedStep(step);
                      }}
                    >
                      <span style={{ background: hex }} aria-hidden="true" />
                      <small>{hex}</small>
                    </button>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>
      </div>
      {sample && pair && (
        <section
          className="scale-detail tool-surface"
          aria-labelledby="scale-detail-title"
        >
          <button
            className="tool-secondary"
            onClick={() => setSelectedStep(null)}
          >
            <ArrowLeft size={18} aria-hidden="true" /> Voltar à mistura
          </button>
          <h1 id="scale-detail-title" tabIndex={-1} ref={detailTitle}>
            Mistura {sample.hex}
          </h1>
          <div className="scale-detail-grid">
            <div
              className="mix-result-swatch"
              style={{ background: sample.hex }}
              aria-hidden="true"
            />
            <div>
              <h2>Proporção da amostra</h2>
              <dl className="scale-detail-recipe">
                {pair.map((paint, index) => {
                  const drops = sample.drops[index] ?? 0;
                  return (
                    <div key={paint.id}>
                      <dt>
                        <span
                          style={{ background: paint.hex }}
                          aria-hidden="true"
                        />
                        <div className="scale-ingredient-identity">
                          <strong>{paint.name}</strong>
                          <small>
                            {[
                              paintBrandLabel(paint.brand) || 'Cor de exemplo',
                              paint.range,
                              paint.code,
                              paint.hex.toUpperCase(),
                            ]
                              .filter(Boolean)
                              .join(' · ')}
                          </small>
                        </div>
                      </dt>
                      <dd>
                        {drops} {drops === 1 ? 'gota' : 'gotas'} ·{' '}
                        {drops * 12.5}%
                      </dd>
                    </div>
                  );
                })}
              </dl>
              <p className="muted">
                Prévia estimada em 8 gotas de tinta. Sua fórmula em edição fica
                preservada.
              </p>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
