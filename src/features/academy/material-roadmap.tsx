import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Box,
  Brush,
  CheckCircle2,
  ChevronRight,
  FileText,
  Layers,
  Palette,
  Play,
  ShoppingBag,
  SprayCan,
  Sun,
} from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { materialRoadmap } from '../../domain/academy/material-roadmap';
import './material-roadmap.css';

const stations = [
  { label: 'Preparo', icon: Layers },
  { label: 'Pincel', icon: Brush },
  { label: 'Acabamento', icon: Sun },
  { label: 'Aerógrafo', icon: SprayCan },
];
const panels = [
  { id: 'aprender', title: 'Aprender', icon: BookOpen },
  { id: 'materiais', title: 'Comparar materiais', icon: ShoppingBag },
  { id: 'kit', title: 'Kit inicial', icon: Box },
] as const;

type Panel = (typeof panels)[number]['id'];
type Material = (typeof materialRoadmap)[number]['materials'][number];

function readRoadmap(): { index: number; panel: Panel } {
  const [route, query] = (
    location.hash || location.pathname + location.search
  ).split('?');
  const slug = route?.split('/')[2];
  const panel = new URLSearchParams(query).get('painel');
  return {
    index: Math.max(
      0,
      materialRoadmap.findIndex((stage) => stage.id === slug),
    ),
    panel: panel === 'materiais' || panel === 'kit' ? panel : 'aprender',
  };
}

function ProductOption({ product }: { product: Material['economical'] }) {
  if (!product.source) return <>{product.name}</>;
  const isPdf = product.source.endsWith('.pdf');
  const Icon = isPdf ? FileText : ArrowUpRight;
  return (
    <a href={product.source} target="_blank" rel="noreferrer">
      {product.name} <Icon size={14} aria-hidden="true" />
      <span className="sr-only">
        {isPdf
          ? ' (PDF do fabricante, nova aba)'
          : ' (fonte do fabricante, nova aba)'}
      </span>
    </a>
  );
}

export function MaterialRoadmap({
  onLesson,
  children,
}: {
  onLesson: (path: string) => void;
  children: ReactNode;
}) {
  const [{ index, panel }, setRoute] = useState(readRoadmap);
  const stage = materialRoadmap[index]!;
  const next = materialRoadmap[index + 1];
  const StageIcon = stations[index]!.icon;
  const stageHeading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const restore = () => setRoute(readRoadmap());
    window.addEventListener('popstate', restore);
    return () => window.removeEventListener('popstate', restore);
  }, []);

  function select(number: number, nextPanel: Panel) {
    setRoute({ index: number, panel: nextPanel });
    const suffix = nextPanel === 'aprender' ? '' : '?painel=' + nextPanel;
    history.replaceState(
      history.state,
      '',
      '/#academia/materiais/' + materialRoadmap[number]!.id + suffix,
    );
  }

  return (
    <div className="academy-material-roadmap">
      <ol className="academy-material-stages" aria-label="Etapas do roadmap">
        {materialRoadmap.map((item, number) => {
          const station = stations[number]!;
          const Icon = station.icon;
          return (
            <li key={item.id}>
              <button
                type="button"
                aria-pressed={number === index}
                aria-label={
                  item.optional
                    ? 'Opcional ' + item.title
                    : `Etapa ${number + 1}: ${item.title}`
                }
                onClick={() =>
                  select(number, panel === 'kit' ? 'aprender' : panel)
                }
              >
                <span className="academy-station-icon">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <span className="academy-station-label">
                  <small>
                    {item.optional ? 'Opcional' : 'Etapa ' + (number + 1)}
                  </small>
                  <strong>{station.label}</strong>
                </span>
                <ChevronRight
                  className="academy-station-arrow"
                  size={16}
                  aria-hidden="true"
                />
              </button>
            </li>
          );
        })}
      </ol>

      <div className="academy-material-content">
        <div
          className="academy-material-switch"
          role="group"
          aria-label="Conteúdo do roadmap"
        >
          {panels.map(({ id, title, icon: Icon }) => (
            <button
              type="button"
              key={id}
              aria-pressed={panel === id}
              onClick={() => select(index, id)}
            >
              <Icon size={17} aria-hidden="true" />
              {title}
            </button>
          ))}
        </div>

        {panel !== 'kit' && (
          <header
            className="academy-material-stage-header"
            data-stage={stage.id}
          >
            <div>
              <p>
                {stage.optional
                  ? 'Etapa opcional'
                  : `Etapa ${index + 1} de ${materialRoadmap.filter((item) => !item.optional).length}`}
              </p>
              <h3 aria-live="polite" tabIndex={-1} ref={stageHeading}>
                {stage.title}
              </h3>
            </div>
            <span className="academy-stage-emblem">
              <StageIcon size={36} strokeWidth={1.5} aria-hidden="true" />
            </span>
          </header>
        )}
        {panel === 'aprender' && (
          <section
            className="academy-material-lesson"
            aria-label="Aprendizado da etapa"
          >
            <div>
              <h4>O que aprender</h4>
              <ul className="academy-material-skills">
                {stage.skills.map((skill) => (
                  <li key={skill}>
                    <CheckCircle2 size={17} aria-hidden="true" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
            <div className="academy-material-checkpoint">
              <h4>Quando avançar</h4>
              <p>{stage.checkpoint}</p>
            </div>
            <a
              className="academy-video-link"
              id="academy-roadmap-lesson"
              href={'#academia/' + stage.lesson.path}
              onClick={(event) => {
                if (
                  event.ctrlKey ||
                  event.metaKey ||
                  event.shiftKey ||
                  event.altKey
                )
                  return;
                event.preventDefault();
                onLesson(stage.lesson.path);
              }}
            >
              <Play size={16} aria-hidden="true" /> {stage.lesson.title}
            </a>
          </section>
        )}

        {panel === 'materiais' && (
          <section
            className="academy-material-buy-panel"
            aria-labelledby="material-buy-title"
          >
            <h4 id="material-buy-title">Lista de materiais</h4>
            <ul className="academy-material-list">
              {stage.materials.map((item) => (
                <li key={item.name}>
                  <h5>{item.name}</h5>
                  <dl>
                    <div>
                      <dt>Econômica</dt>
                      <dd>
                        <ProductOption product={item.economical} />
                      </dd>
                    </div>
                    <div>
                      <dt>Investimento</dt>
                      <dd>
                        <ProductOption product={item.upgrade} />
                      </dd>
                    </div>
                  </dl>
                  {item.note && <p>{item.note}</p>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {panel === 'kit' && (
          <section
            className="academy-material-kit"
            aria-labelledby="essential-title"
          >
            <h3 id="essential-title">Essenciais para a primeira peça</h3>
            <ul className="academy-kit-visuals">
              <li>
                <Box size={22} aria-hidden="true" />
                <strong>Peça e primer</strong>
                <small>
                  Miniatura simples. Primer compatível se a peça estiver crua.
                </small>
              </li>
              <li>
                <Brush size={22} aria-hidden="true" />
                <strong>Pincel e tintas</strong>
                <small>Um pincel redondo, branco, preto e duas cores.</small>
                <div
                  className="academy-kit-colors"
                  role="img"
                  aria-label="Exemplo: branco, preto, azul e ocre"
                >
                  {['#f3f0e6', '#232126', '#3866a6', '#db9b38'].map((color) => (
                    <span key={color} style={{ background: color }} />
                  ))}
                </div>
              </li>
              <li>
                <Palette size={22} aria-hidden="true" />
                <strong>Bancada</strong>
                <small>
                  Pires, água ou diluente compatível, papel e luz de mesa.
                </small>
              </li>
            </ul>
            {children}
          </section>
        )}

        {panel !== 'kit' && next && (
          <button
            type="button"
            className="tool-secondary academy-material-next"
            onClick={() => {
              select(index + 1, panel);
              requestAnimationFrame(() => stageHeading.current?.focus());
            }}
          >
            {next.optional ? 'Explorar aerógrafo (opcional)' : 'Próxima etapa'}
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}
