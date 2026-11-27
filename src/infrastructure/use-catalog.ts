import { useEffect, useSyncExternalStore } from 'react';
import type { CatalogPaint } from '../domain/color/catalog';
import { loadCatalog } from './catalog-loader';

type CatalogSnapshot = {
  paints: CatalogPaint[];
  brands: string[];
  status: string;
  retry?: () => void;
};
const loading = { paints: [], brands: [], status: 'Carregando catálogo…' };
const listeners = new Set<() => void>();
let snapshot: CatalogSnapshot = loading;
let started = false;

function publish(next: CatalogSnapshot) {
  snapshot = next;
  listeners.forEach((listener) => listener());
}

function request() {
  if (started) return;
  started = true;
  publish(loading);
  void loadCatalog().then(
    (paints) => {
      publish({
        paints,
        brands: [...new Set(paints.map((paint) => paint.brand))].sort(),
        status: '',
      });
    },
    () => {
      started = false;
      publish({ ...loading, status: 'Catálogo indisponível', retry: request });
    },
  );
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
const getSnapshot = () => snapshot;

export function useCatalog(enabled = true) {
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  useEffect(() => {
    if (enabled && !getSnapshot().retry) request();
  }, [enabled]);
  return state;
}
