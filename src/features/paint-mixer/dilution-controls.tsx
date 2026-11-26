import { Droplet } from 'lucide-react';
import {
  airbrushStartingPoint,
  type Preparation,
} from '../../domain/color/dilution';
import type { RecipePaint } from '../../domain/color/saved-recipe';
import { DropStepper } from './drop-stepper';

export function DilutionControls({
  paints,
  totalDrops,
  preparation,
  thinner,
  onChange,
}: {
  paints: RecipePaint[];
  totalDrops: number;
  preparation: Preparation;
  thinner: number;
  onChange: (preparation: Preparation, drops: number) => void;
}) {
  const { application, diluent } = preparation;
  const tip =
    application === 'airbrush' ? airbrushStartingPoint(paints) : undefined;
  return (
    <section className="mix-application" aria-label="Aplicação e diluição">
      <div className="mix-application-fields">
        <label>
          Como você vai aplicar?
          <select
            value={application}
            onChange={(event) =>
              onChange(
                {
                  application: event.target.value as Preparation['application'],
                },
                0,
              )
            }
          >
            <option value="color">Só misturar a cor</option>
            <option value="brush">Pincel</option>
            <option value="airbrush">Aerógrafo</option>
          </select>
        </label>
        {application !== 'color' && (
          <>
            <p className="muted">
              {application === 'brush'
                ? 'Teste uma pincelada. Se deixar marcas, dilua aos poucos. Se escorrer, reduza a diluição.'
                : 'Teste a pulverização numa amostra. Se a tinta pronta já pulveriza bem, use sem diluição. Aditivos de fluxo têm orientação própria.'}
            </p>
            <label>
              Diluente
              <select
                aria-label="Diluente"
                value={diluent ?? (thinner > 0 ? 'unrecorded' : '')}
                onChange={(event) => {
                  const next = (event.target.value ||
                    undefined) as Preparation['diluent'];
                  onChange({ application, diluent: next }, next ? thinner : 0);
                }}
              >
                <option value="">Sem diluente</option>
                {thinner > 0 && !diluent && (
                  <option value="unrecorded" disabled>
                    Diluente não registrado
                  </option>
                )}
                {application === 'brush' ? (
                  <>
                    <option value="water">
                      Água, se indicada para a tinta
                    </option>
                    <option value="medium">Médium compatível</option>
                  </>
                ) : (
                  <option value="airbrush-thinner">
                    Diluente para a linha da tinta
                  </option>
                )}
              </select>
            </label>
            {tip && (
              <div className="mix-dilution-tip">
                <p>
                  {tip.label} <a href={tip.source}>Guia da Vallejo</a>
                </p>
                {totalDrops < tip.parts && (
                  <p className="muted">
                    Use pelo menos {tip.parts} gotas de tinta para aplicar a
                    proporção.
                  </p>
                )}
                <button
                  type="button"
                  disabled={totalDrops < tip.parts}
                  className="tool-secondary"
                  onClick={() =>
                    onChange(
                      { application, diluent: 'airbrush-thinner' },
                      Math.min(
                        10000,
                        Math.max(1, Math.round(totalDrops / tip.parts)),
                      ),
                    )
                  }
                >
                  Usar como ponto de partida
                </button>
              </div>
            )}
            {(diluent || thinner > 0) && (
              <div className="mix-dilution">
                <div className="mix-dilution-label">
                  <Droplet size={18} aria-hidden="true" />
                  <h3>Diluente</h3>
                </div>
                <DropStepper
                  value={thinner}
                  min={0}
                  label="Quantidade de gotas de diluente"
                  decreaseLabel="Diminuir diluente"
                  increaseLabel="Aumentar diluente"
                  onChange={(drops) => onChange(preparation, drops)}
                />
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
