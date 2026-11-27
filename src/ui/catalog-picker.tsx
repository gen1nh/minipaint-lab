import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { searchCatalog, type CatalogPaint } from '../domain/color/catalog';
import { useCatalog } from '../infrastructure/use-catalog';

type PaintChoice = {
  name: string;
  brand: string;
  hex: string;
  code?: string;
  range?: string;
};

export function CatalogPicker({
  selected,
  onSelect,
  action = 'Trocar tinta',
  initiallyOpen = false,
  fallbackDetails,
  onDismiss,
}: {
  selected: PaintChoice;
  onSelect: (paint: CatalogPaint) => void;
  action?: string;
  initiallyOpen?: boolean;
  fallbackDetails?: string;
  onDismiss?: () => void;
}) {
  const [open, setOpen] = useState(initiallyOpen);
  const [query, setQuery] = useState('');
  const { paints, status, retry } = useCatalog(open);
  const selectedDetails =
    [selected.brand, selected.code, selected.range]
      .filter(Boolean)
      .join(' · ') || fallbackDetails;
  const panelId = useId();
  const input = useRef<HTMLInputElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const results = useMemo(
    () => (query.trim() ? searchCatalog(paints, query) : paints.slice(0, 6)),
    [paints, query],
  );
  const options = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (open) input.current?.focus();
  }, [open]);

  function close() {
    setOpen(false);
    setQuery('');
    if (onDismiss) onDismiss();
    else trigger.current?.focus();
  }

  return (
    <div
      className="catalog-picker"
      onKeyDown={(event) => {
        if (open && event.key === 'Escape') {
          event.stopPropagation();
          close();
        }
        if (open && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
          const buttons = Array.from(
            options.current?.querySelectorAll('button') ?? [],
          );
          const current = buttons.findIndex(
            (button) => button === event.target,
          );
          if (
            event.target === input.current &&
            event.key === 'ArrowDown' &&
            buttons.length
          ) {
            event.preventDefault();
            buttons[0]?.focus();
          } else if (current >= 0) {
            event.preventDefault();
            const next = current + (event.key === 'ArrowDown' ? 1 : -1);
            if (next < 0) input.current?.focus();
            else buttons[Math.min(next, buttons.length - 1)]?.focus();
          }
        }
      }}
    >
      <button
        className="catalog-selected"
        type="button"
        ref={trigger}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => (open ? close() : setOpen(true))}
      >
        <span
          className="catalog-swatch"
          style={{ background: selected.hex }}
          aria-hidden="true"
        />
        <span className="catalog-identity">
          <strong>{selected.name}</strong>
          {selectedDetails && <small>{selectedDetails}</small>}
        </span>
        <span className="catalog-change">
          {action} <ChevronDown size={16} aria-hidden="true" />
        </span>
      </button>
      <div id={panelId} hidden={!open} className="catalog-search">
        <label>
          <span className="sr-only">Buscar tinta comercial</span>
          <span className="catalog-input">
            <Search size={17} aria-hidden="true" />
            <input
              ref={input}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Marca, nome ou código"
              autoComplete="off"
              enterKeyHint="search"
            />
          </span>
        </label>
        {open && status && <p role="status">{status}</p>}
        {open && retry && (
          <button
            type="button"
            className="tool-secondary"
            onClick={() => {
              retry();
              input.current?.focus();
            }}
          >
            Tentar novamente
          </button>
        )}
        {open && !!results.length && (
          <ul
            ref={options}
            className="catalog-results"
            aria-label={
              query.trim() ? 'Tintas encontradas' : 'Sugestões de tinta'
            }
          >
            {results.map((paint, index) => (
              <li key={index}>
                <button
                  type="button"
                  onClick={() => {
                    onSelect(paint);
                    close();
                  }}
                >
                  <span
                    className="catalog-swatch"
                    style={{ background: paint.hex }}
                    aria-hidden="true"
                  />
                  <span>
                    {paint.name}
                    <small>
                      {[paint.brand, paint.code, paint.range]
                        .filter(Boolean)
                        .join(' · ')}
                    </small>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
        {!status && query.trim() && !results.length && (
          <p role="status">Nenhuma tinta encontrada.</p>
        )}
      </div>
    </div>
  );
}
