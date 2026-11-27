import { useDeferredValue, useMemo } from 'react';
import { matchPaints } from '../../domain/color/match';
import { useCatalog } from '../../infrastructure/use-catalog';

export function NearestPaint({ hex }: { hex: string }) {
  const target = useDeferredValue(hex);
  const { paints, status, retry } = useCatalog();
  const closest = useMemo(
    () =>
      paints.length ? matchPaints(target, paints, 1)[0]?.paint : undefined,
    [target, paints],
  );

  return (
    <section className="mix-nearest" aria-label="Tinta mais próxima">
      <h3>Tinta mais próxima</h3>
      {status && <p role="status">{status}</p>}
      {retry && (
        <button type="button" className="tool-secondary" onClick={retry}>
          Tentar novamente
        </button>
      )}
      {!status && !closest && <p role="status">Nenhuma tinta no catálogo.</p>}
      {closest && (
        <>
          <div className="mix-nearest-paint">
            <span
              className="catalog-swatch"
              style={{ background: closest.hex }}
              aria-hidden="true"
            />
            <span>
              <strong>{closest.name}</strong>
              <small>
                {[closest.brand, closest.range, closest.code]
                  .filter(Boolean)
                  .join(' · ')}
              </small>
            </span>
          </div>
          <p className="muted">Correspondência digital aproximada.</p>
        </>
      )}
    </section>
  );
}
