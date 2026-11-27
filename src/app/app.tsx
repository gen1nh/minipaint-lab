import type { PrimerSetup } from '../domain/color/primer';
import { ConfirmDialog } from '../ui/studio-dialog';
import { StudioNoticeProvider } from '../ui/studio-notice';
import { StudioIcon } from '../ui/studio-icon';
import {
  lazy,
  type MouseEvent,
  Suspense,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { Sun, Moon, ArrowLeft } from 'lucide-react';
import type { Preparation } from '../domain/color/dilution';
import type { RecipePaint } from '../domain/color/saved-recipe';
import { StudioHome } from './studio-home';
import './workspace.css';
import { publicPages } from './public-pages';
import { StudioShortcuts, type LabTool } from './studio-shortcuts';
import { StudioHeading } from '../ui/studio-heading';

type Page = 'home' | 'laboratory' | 'academy' | LabTool;
const Academy = lazy(() =>
  import('../features/academy/academy').then(({ Academy }) => ({
    default: Academy,
  })),
);
const RecipeLibrary = lazy(() =>
  import('../features/paint-mixer/recipe-library').then(
    ({ RecipeLibrary }) => ({ default: RecipeLibrary }),
  ),
);
const Mixer = lazy(() =>
  import('../features/paint-mixer/mixer').then(({ Mixer }) => ({
    default: Mixer,
  })),
);
const ColorTools = lazy(() =>
  import('../features/color-tools/color-tools').then(({ ColorTools }) => ({
    default: ColorTools,
  })),
);
const CelShading = lazy(() =>
  import('../features/cel-shading/cel-shading').then(({ CelShading }) => ({
    default: CelShading,
  })),
);
const pages = {
  home: '',
  laboratory: 'laboratorio',
  academy: 'academia',
  lab: 'misturar-tintas',
  colors: 'encontrar-cores',
  cel: 'cel-shading',
  atelier: 'meu-atelie',
} satisfies Record<Page, string>;
function readPage(): Page {
  const segment = (location.hash.slice(1) || location.pathname.slice(1)).split(
    '/',
  )[0];
  return (
    (Object.keys(pages) as Page[]).find((page) => pages[page] === segment) ??
    'home'
  );
}
const themeKey = 'minipaint:theme';
function readTheme(): 'dark' | 'light' {
  try {
    return localStorage.getItem(themeKey) === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}
export function App() {
  const [page, setPage] = useState(readPage);
  useEffect(() => {
    const titlePath = (
      location.hash
        ? '/' + location.hash.slice(1)
        : location.pathname.replace(/\/$/, '') || '/'
    ) as keyof typeof publicPages;
    const pagePath = (
      page === 'home' ? '/' : '/' + pages[page]
    ) as keyof typeof publicPages;
    document.title =
      (publicPages[titlePath] ?? publicPages[pagePath])?.title ??
      'Meu ateliê | Pincel Guia';
  }, [page]);
  const [visited, setVisited] = useState(() => new Set([page]));
  const [autoSearch, setAutoSearch] = useState(false);
  const [primerRequest, setPrimerRequest] = useState(0);
  const [initialPrimer, setInitialPrimer] = useState<PrimerSetup>();
  const [searchVersion, setSearchVersion] = useState(0);
  const [initialPaints, setInitialPaints] = useState<
      RecipePaint[] | undefined
    >(),
    [initialPreparation, setInitialPreparation] = useState<Preparation>(),
    [initialThinner, setInitialThinner] = useState(0),
    [mixVersion, setMixVersion] = useState(0),
    [target, setTarget] = useState('#d46b26');
  const [theme, setTheme] = useState(readTheme);
  const inLabTool =
    page === 'lab' || page === 'colors' || page === 'cel' || page === 'atelier';
  useEffect(() => {
    try {
      localStorage.setItem(themeKey, theme);
    } catch {
      // Theme still works during this session if storage is unavailable.
    }
  }, [theme]);
  const mixDirty = useRef(false);
  const [pendingMix, setPendingMix] = useState<(() => void) | null>(null);
  const main = useRef<HTMLElement>(null);
  const workspace = useRef<HTMLDivElement>(null);
  const focusHeading = useRef(false);
  useEffect(() => {
    const restore = () => {
      setPendingMix(null);
      const next = readPage();
      focusHeading.current = true;
      setVisited((current) => new Set([...current, next]));
      setPage(next);
    };
    window.addEventListener('popstate', restore);
    return () => window.removeEventListener('popstate', restore);
  }, []);
  useLayoutEffect(() => {
    if (!focusHeading.current) return;
    const container = main.current;
    if (!container) return;
    function focusDestination() {
      const heading = Array.from(container!.querySelectorAll('h1')).find(
        (item) => !item.closest('[hidden]') && item.getClientRects().length,
      );
      if (!heading) return false;
      focusHeading.current = false;
      heading.focus({ preventScroll: true });
      window.scrollTo(0, 0);
      return true;
    }
    if (focusDestination()) return;
    const observer = new MutationObserver(() => {
      if (focusDestination()) observer.disconnect();
    });
    observer.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'hidden'],
    });
    return () => observer.disconnect();
  });
  function go(next: Page) {
    if (next === page) {
      if (next === 'academy') {
        const route = location.hash.slice(1) || location.pathname.slice(1);
        if (route.replace(/\/$/, '') !== 'academia') location.hash = 'academia';
      }
      window.scrollTo(0, 0);
      return;
    }
    const hash = pages[next];
    const returnLabels: Partial<Record<Page, string>> = {
      academy: 'Voltar à aula',
      lab: 'Voltar à mistura',
      cel: 'Voltar ao cel shading',
      colors: 'Voltar à busca de cores',
      atelier: 'Voltar ao ateliê',
    };
    const toolReturn = ['lab', 'colors', 'cel', 'atelier'].includes(next)
      ? returnLabels[page]
      : undefined;
    history.pushState(
      toolReturn ? { toolReturn } : null,
      '',
      '/' + location.search + (hash ? '#' + hash : ''),
    );
    focusHeading.current = true;
    setVisited((current) => new Set([...current, next]));
    setPage(next);
  }
  function followPage(event: MouseEvent<HTMLAnchorElement>, next: Page) {
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    )
      return;
    event.preventDefault();
    go(next);
  }
  function openMix(
    paints: RecipePaint[],
    thinner = 0,
    preparation?: Preparation,
    primer?: PrimerSetup,
  ) {
    function apply() {
      setInitialPaints(paints);
      setInitialThinner(thinner);
      setInitialPreparation(preparation);
      setInitialPrimer(primer);
      setPrimerRequest(0);
      setMixVersion((version) => version + 1);
      go('lab');
    }
    if (mixDirty.current) setPendingMix(() => apply);
    else apply();
  }
  const find = (hex: string, automatic = false) => {
    setAutoSearch(automatic);
    setTarget(hex);
    setSearchVersion((value) => value + 1);
    go('colors');
  };
  return (
    <div ref={workspace} className="studio workspace" data-theme={theme}>
      <StudioNoticeProvider>
        <a
          className="skip-to-content"
          href="#conteudo"
          tabIndex={0}
          onClick={(event) => {
            event.preventDefault();
            main.current?.focus();
          }}
        >
          Ir para o conteúdo
        </a>
        <aside>
          <div className="workspace-brand">
            <strong className="brand">
              <img src="/minipaint-mark.svg" alt="" width="32" height="32" />{' '}
              Pincel Guia
            </strong>
          </div>
          <nav aria-label="Principal">
            <a
              aria-current={page === 'home' ? 'page' : undefined}
              href="/"
              onClick={(event) => followPage(event, 'home')}
            >
              <StudioIcon name="home" size={19} /> Início
            </a>
            <a
              aria-current={page === 'academy' ? 'page' : undefined}
              aria-label="Academia"
              href="/academia"
              onClick={(event) => followPage(event, 'academy')}
            >
              <StudioIcon name="book" size={19} />
              <span>Academia</span>
            </a>
            <a
              aria-label="Laboratório de cores"
              aria-current={
                page === 'laboratory'
                  ? 'page'
                  : inLabTool
                    ? 'location'
                    : undefined
              }
              href="/laboratorio"
              onClick={(event) => followPage(event, 'laboratory')}
            >
              <StudioIcon name="palette" size={19} />
              <span>
                Laboratório<span className="nav-label-extended"> de cores</span>
              </span>
            </a>
          </nav>
          <button
            className="theme-toggle"
            aria-label="Alternar tema"
            aria-pressed={theme === 'dark'}
            onClick={() => {
              const container = workspace.current;
              container?.setAttribute('data-theme-switch', '');
              setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
              requestAnimationFrame(() =>
                requestAnimationFrame(() =>
                  container?.removeAttribute('data-theme-switch'),
                ),
              );
            }}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}{' '}
            <span>Alternar tema</span>
          </button>
        </aside>
        <main
          ref={main}
          id="conteudo"
          className="workspace-content"
          tabIndex={-1}
        >
          {inLabTool && (
            <button
              className="tool-secondary page-back"
              onClick={() => {
                if (history.state?.toolReturn) history.back();
                else go('laboratory');
              }}
            >
              <ArrowLeft size={17} aria-hidden="true" />
              {history.state?.toolReturn ?? 'Laboratório de cores'}
            </button>
          )}
          <Suspense fallback={<p role="status">Carregando ferramenta…</p>}>
            {visited.has('lab') && (
              <div className="page-panel" hidden={page !== 'lab'}>
                <Mixer
                  key={mixVersion}
                  active={page === 'lab'}
                  onDirtyChange={(dirty) => {
                    mixDirty.current = dirty;
                  }}
                  initialPaints={initialPaints}
                  initialThinner={initialThinner}
                  initialPreparation={initialPreparation}
                  initialPrimer={initialPrimer}
                  primerRequest={primerRequest}
                />
              </div>
            )}
            {visited.has('colors') && (
              <div className="page-panel" hidden={page !== 'colors'}>
                <ColorTools
                  key={searchVersion}
                  initialTarget={target}
                  autoSearch={autoSearch}
                  onMix={openMix}
                />
              </div>
            )}
            {visited.has('cel') && (
              <div className="page-panel" hidden={page !== 'cel'}>
                <CelShading onFind={(hex) => find(hex, true)} />
              </div>
            )}
            {page === 'home' ? (
              <StudioHome
                onLab={() => go('laboratory')}
                onAcademy={() => go('academy')}
                onFind={find}
                onOpen={go}
              />
            ) : page === 'laboratory' ? (
              <div className="tool-page">
                <StudioHeading
                  title="Laboratório de cores"
                  description="Misture tintas, explore paletas e organize suas receitas."
                />
                <StudioShortcuts onOpen={go} />
              </div>
            ) : ['lab', 'colors', 'cel'].includes(page) ? null : page ===
              'atelier' ? (
              <RecipeLibrary
                onLoad={(recipe) =>
                  openMix(
                    recipe.paints,
                    recipe.thinner,
                    recipe.preparation,
                    recipe.primer,
                  )
                }
                onMix={() => go('lab')}
              />
            ) : (
              <Academy
                onFind={find}
                onPrimer={() => {
                  setPrimerRequest((request) => request + 1);
                  go('lab');
                }}
                onShading={() => go('cel')}
                onMixer={() => go('lab')}
              />
            )}
          </Suspense>
        </main>
        <ConfirmDialog
          open={pendingMix !== null}
          title="Substituir mistura?"
          description="A receita em edição tem alterações pendentes."
          confirmLabel="Substituir mistura"
          onCancel={() => setPendingMix(null)}
          onConfirm={() => {
            pendingMix?.();
            setPendingMix(null);
          }}
        />
      </StudioNoticeProvider>
    </div>
  );
}
