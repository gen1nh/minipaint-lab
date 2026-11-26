import { useState } from 'react';
import { ArrowRight, Pipette } from 'lucide-react';
import { useCatalog } from '../../infrastructure/use-catalog';
import { correctMix } from '../../domain/color/correct';
import { ColorField } from '../../ui/color-field';

export function Corrector() {
  const [current, setCurrent] = useState('#b83232');
  const [target, setTarget] = useState('#d46b26');
  const [drops, setDrops] = useState('5');
  const [brand, setBrand] = useState('');
  const { paints, status, brands, retry } = useCatalog();
  const [results, setResults] = useState<ReturnType<typeof correctMix> | null>(
    null,
  );
  const amount = Number(drops);
  const validAmount =
    Number.isInteger(amount) && amount >= 1 && amount <= 10000;

  return (
    <>
      <section className="tool-surface color-correction">
        <div className="color-pair">
          <ColorField
            label="Cor atual"
            hex={current}
            onChange={(hex) => {
              setCurrent(hex);
              setResults(null);
            }}
          />
          <ArrowRight size={24} aria-hidden="true" />
          <ColorField
            label="Cor desejada"
            hex={target}
            onChange={(hex) => {
              setTarget(hex);
              setResults(null);
            }}
          />
        </div>
        <div className="tool-settings">
          <label>
            Gotas de tinta existentes
            <input
              type="number"
              min="1"
              max="10000"
              value={drops}
              onChange={(event) => {
                setDrops(event.target.value);
                setResults(null);
              }}
            />
          </label>
          <button
            className="tool-primary"
            disabled={!paints.length || !validAmount}
            onClick={() => {
              setResults(
                correctMix(
                  current,
                  target,
                  amount,
                  paints.filter((paint) => !brand || paint.brand === brand),
                ),
              );
            }}
          >
            <Pipette size={18} aria-hidden="true" /> Calcular correção
          </button>
          {status && <p role="status">{status}</p>}
          {retry && (
            <button className="tool-secondary" type="button" onClick={retry}>
              Tentar novamente
            </button>
          )}
          <details className="studio-disclosure">
            <summary>Filtrar por fabricante</summary>
            <label>
              Fabricante
              <select
                value={brand}
                onChange={(event) => {
                  setBrand(event.target.value);
                  setResults(null);
                }}
              >
                <option value="">Todas as marcas</option>
                {brands.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </details>
        </div>
      </section>
      {results && (
        <section className="tool-results">
          <h2>Ajustes sugeridos</h2>
          {results.length === 0 && (
            <p role="status">Nenhuma melhora encontrada na busca limitada.</p>
          )}
          <ul className="swatch-grid">
            {results.map(({ hex, added, paint }, index) => (
              <li key={index} className="swatch-action">
                <span
                  className="swatch-block"
                  style={{ background: hex }}
                  aria-hidden="true"
                />
                <strong>+{added} gotas</strong>
                <small>
                  {paint.brand} {paint.name} {paint.code} · {hex}
                </small>
              </li>
            ))}
          </ul>
          <p className="muted">
            Estimativa pela cor atual. Teste em uma amostra antes de corrigir o
            lote.
          </p>
        </section>
      )}
    </>
  );
}
