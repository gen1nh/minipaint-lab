import Fuse from 'fuse.js/basic';
import {
  ArrowUpRight,
  Brush,
  FileText,
  Layers,
  LayoutGrid,
  Palette,
  Play,
  Search,
  Shield,
  SprayCan,
  Sun,
  Wrench,
  X,
  type LucideIcon,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { MaterialRoadmap } from './material-roadmap';
import { searchText } from '../../domain/search-text';
import { courses } from '../../domain/academy/courses';
import { projectGroups } from '../../domain/academy/projects';
import {
  benchGuides,
  kitVideos,
  practiceVideoIds,
} from '../../domain/academy/workshop';

export function thumbnail(id: string) {
  return 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg';
}

const compact = new Intl.NumberFormat('pt-BR', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

type MediaVideo = {
  id: string;
  title: string;
  creator: string;
  language?: string;
  views?: number;
  likes?: number;
  originalTitle?: string;
  level?: string;
};

function VideoLink({ video }: { video: MediaVideo }) {
  return (
    <a
      className="academy-workshop-video"
      href={'https://www.youtube.com/watch?v=' + video.id}
      target="_blank"
      rel="noreferrer"
      title={video.originalTitle}
    >
      <span className="academy-workshop-cover">
        <img src={thumbnail(video.id)} loading="lazy" decoding="async" alt="" />
        <Play size={18} aria-hidden="true" />
      </span>
      <span className="academy-workshop-caption">
        <strong>{video.title}</strong>
        <small>
          {video.creator}
          {video.language && ' · ' + video.language}
          {video.level && ' · ' + video.level}
        </small>
        {video.views !== undefined && (
          <small>
            {compact.format(video.views)} visualizações
            {video.likes !== undefined &&
              ' · ' + compact.format(video.likes) + ' curtidas'}
          </small>
        )}
        <span className="sr-only"> (YouTube, abre em nova aba)</span>
      </span>
    </a>
  );
}

function VideoGrid({ videos }: { videos: MediaVideo[] }) {
  return (
    <ul className="academy-workshop-grid">
      {videos.map((video) => (
        <li key={video.id}>
          <VideoLink video={video} />
        </li>
      ))}
    </ul>
  );
}

const tipIcons: Record<string, LucideIcon> = {
  'primeira-pintura': Palette,
  aerografo: SprayCan,
  pinceis: Brush,
  preparo: Layers,
  'luz-e-sombra': Sun,
  verniz: Shield,
  'retoques-e-bases': Wrench,
  todos: LayoutGrid,
};

function readTipTopic() {
  const slug = (location.hash || location.pathname).split('/')[2];
  return slug === 'todos' || benchGuides.some((item) => item.id === slug)
    ? slug
    : benchGuides[0]!.id;
}

export function BenchGuides() {
  const [topic, setTopic] = useState(readTipTopic);
  useEffect(() => {
    const restore = () => setTopic(readTipTopic());
    window.addEventListener('popstate', restore);
    return () => window.removeEventListener('popstate', restore);
  }, []);
  const guides = benchGuides.filter(
    (guide) => topic === 'todos' || guide.id === topic,
  );

  return (
    <div className="academy-workshop-groups">
      <div
        className="academy-guide-filters"
        role="group"
        aria-label="Assuntos de dicas"
      >
        {[...benchGuides, { id: 'todos', title: 'Todos' }].map((guide) => {
          const Icon = tipIcons[guide.id] ?? LayoutGrid;
          return (
            <button
              className="tool-secondary"
              type="button"
              key={guide.id}
              aria-pressed={topic === guide.id}
              onClick={() => {
                history.replaceState(
                  history.state,
                  '',
                  '/#academia/dicas/' + guide.id,
                );
                setTopic(guide.id);
              }}
            >
              <Icon size={16} aria-hidden="true" />
              {guide.title}
            </button>
          );
        })}
      </div>
      {guides.map((guide) => (
        <section key={guide.id}>
          <h3>{guide.title}</h3>
          <VideoGrid videos={guide.videos} />
          {guide.pdf && (
            <a
              className="academy-video-link"
              href={guide.pdf.url}
              target="_blank"
              rel="noreferrer"
            >
              <FileText size={16} aria-hidden="true" />
              {guide.pdf.title} · PDF{' '}
              <ArrowUpRight size={16} aria-hidden="true" />
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
          )}
        </section>
      ))}
    </div>
  );
}

export const workshopSections = {
  projects: {
    title: 'Projetos por estilo',
    description: 'Anime, realismo e fantasia.',
  },
  practice: {
    title: 'Treinos de pintura',
    description: 'Demonstrações para praticar.',
  },
  kits: {
    title: 'Materiais e kits',
    description: 'O que aprender e comprar em cada etapa.',
  },
} as const;

export type WorkshopSection = keyof typeof workshopSections;

const projectTechniques: Record<string, string> = {
  ayxS80rHE7s: 'contorno anime luz de recorte',
  BG7vyv0xUno: 'contorno anime luz sombra chapada',
  wEua0gUq44k: 'contorno anime luz sombra chapada',
  '1iMb1gCxc00': 'pele realista rosto soldado',
  fLIEZbfhXi4: 'pele realista rosto',
  oRvikeWukl8: 'pele realista rosto',
  v5sFX7vAoNM: 'luz sombra contraste',
  VjUy1T7t6Hg: 'aerógrafo pele realista',
  g98JQIuq7pM: 'óleo transições',
  M4UI3hYkI0M: 'desgaste envelhecimento',
};

const projectSearchEntries = projectGroups.flatMap(({ videos }) =>
  videos.map((video) => ({
    id: video.id,
    text: searchText(
      [
        video.title,
        video.creator,
        video.originalTitle,
        projectTechniques[video.id] ?? '',
      ].join(' '),
    ),
  })),
);
const projectSearch = new Fuse(projectSearchEntries, {
  keys: ['text'],
  ignoreLocation: true,
  threshold: 0.28,
  shouldSort: false,
});

function readProjectFilters() {
  const [fragment, fragmentQuery] = location.hash.split('?');
  const search = new URLSearchParams(fragmentQuery ?? location.search);
  const slug = (fragment || location.pathname).split('/')[2];
  return {
    groupId:
      slug === 'todos'
        ? slug
        : (projectGroups.find((item) => item.id === slug)?.id ??
          projectGroups[0]!.id),
    sortByLikes: search.get('ordem') === 'curtidas',
    query: search.get('q') ?? '',
    portuguese: search.get('idioma') === 'pt',
  };
}

function Projects() {
  const [filters, setFilters] = useState(readProjectFilters);
  const { groupId, sortByLikes, query, portuguese } = filters;
  const searchInput = useRef<HTMLInputElement>(null);
  const group = projectGroups.find((item) => item.id === groupId);
  const youtubeQuery = [
    query.trim(),
    'pintura de miniaturas',
    group?.title,
    portuguese ? 'em português' : undefined,
  ]
    .filter(Boolean)
    .join(' ');
  const youtubeSearchUrl =
    'https://www.youtube.com/results?' +
    new URLSearchParams({ search_query: youtubeQuery });
  useEffect(() => {
    const restore = () => setFilters(readProjectFilters());
    window.addEventListener('popstate', restore);
    return () => window.removeEventListener('popstate', restore);
  }, []);

  function updateFilters(change: Partial<typeof filters>) {
    const next = { ...filters, ...change };
    const params = new URLSearchParams();
    if (next.query) params.set('q', next.query);
    if (next.sortByLikes) params.set('ordem', 'curtidas');
    if (next.portuguese) params.set('idioma', 'pt');
    const suffix = params.size ? '?' + params.toString() : '';
    history.replaceState(
      history.state,
      '',
      '/#academia/projetos/' + next.groupId + suffix,
    );
    setFilters(next);
  }
  const matches = searchText(query)
    .split(/\s+/)
    .filter(Boolean)
    .map(
      (term) =>
        new Set(
          term.length >= 4
            ? projectSearch.search(term).map(({ item }) => item.id)
            : projectSearchEntries
                .filter(({ text }) => text.includes(term))
                .map(({ id }) => id),
        ),
    );
  const videos = (group?.videos ?? projectGroups.flatMap((item) => item.videos))
    .filter(
      (video) =>
        (!portuguese || video.language === 'Português') &&
        matches.every((ids) => ids.has(video.id)),
    )
    .sort((left, right) => {
      if (sortByLikes) {
        const difference = (right.likes ?? -1) - (left.likes ?? -1);
        if (difference) return difference;
      }
      return right.views - left.views;
    });
  return (
    <div className="academy-workshop-groups">
      <div className="academy-project-toolbar">
        <div
          className="academy-project-filters"
          role="group"
          aria-label="Estilo do projeto"
        >
          {[...projectGroups, { id: 'todos', title: 'Todos' }].map((item) => (
            <button
              type="button"
              key={item.id}
              className="tool-secondary"
              aria-pressed={item.id === groupId}
              onClick={() => updateFilters({ groupId: item.id })}
            >
              {item.title}
            </button>
          ))}
        </div>
        <label className="academy-project-sort">
          Ordenar por
          <select
            value={sortByLikes ? 'likes' : 'views'}
            onChange={(event) =>
              updateFilters({ sortByLikes: event.target.value === 'likes' })
            }
          >
            <option value="views">Mais vistos</option>
            <option value="likes">Mais curtidos</option>
          </select>
        </label>
      </div>
      <div className="academy-project-controls">
        <div className="academy-project-search">
          <Search size={20} aria-hidden="true" />
          <input
            type="search"
            aria-label="Buscar projetos"
            ref={searchInput}
            placeholder="Buscar personagem, técnica ou criador"
            value={query}
            onChange={(event) => {
              const next = event.target.value;
              updateFilters({
                query: next,
                groupId: !query.trim() && next.trim() ? 'todos' : groupId,
              });
            }}
          />
          {query && (
            <button
              type="button"
              aria-label="Limpar busca"
              onClick={() => {
                updateFilters({ query: '' });
                searchInput.current?.focus();
              }}
            >
              <X size={18} aria-hidden="true" />
            </button>
          )}
        </div>
        <label className="inline-check">
          <input
            type="checkbox"
            checked={portuguese}
            onChange={(event) => {
              const checked = event.target.checked;
              updateFilters({
                portuguese: checked,
                groupId: checked ? 'todos' : groupId,
              });
            }}
          />{' '}
          Em português
        </label>
      </div>
      <div className="academy-project-results-bar">
        <p aria-live="polite" className="academy-project-count">
          {group?.title ?? 'Todos os estilos'} · {videos.length}{' '}
          {videos.length === 1 ? 'vídeo na seleção' : 'vídeos na seleção'}
        </p>
        <a
          className="academy-video-link"
          href={youtubeSearchUrl}
          target="_blank"
          rel="noreferrer"
        >
          Buscar no YouTube <ArrowUpRight size={16} aria-hidden="true" />
          <span className="sr-only"> (abre em nova aba)</span>
        </a>
      </div>
      {videos.length ? (
        <VideoGrid
          videos={videos.map((video) => ({
            ...video,
            level: /\b(beginner|iniciantes?)\b/i.test(video.originalTitle)
              ? 'Iniciante'
              : undefined,
          }))}
        />
      ) : (
        <p>Nenhum vídeo encontrado na seleção.</p>
      )}
    </div>
  );
}

export function WorkshopContent({
  section,
  onRoadmapLesson,
}: {
  section: WorkshopSection;
  onRoadmapLesson: (path: string) => void;
}) {
  if (section === 'projects') return <Projects />;
  if (section === 'kits')
    return (
      <>
        <MaterialRoadmap onLesson={onRoadmapLesson}>
          <h4>Vídeos sobre materiais</h4>
          <VideoGrid videos={kitVideos} />
        </MaterialRoadmap>
      </>
    );
  const videos = courses.flatMap((course) =>
    course.lessons.flatMap((lesson) =>
      lesson.video && practiceVideoIds.includes(lesson.video.id)
        ? [
            {
              id: lesson.video.id,
              title: lesson.title,
              creator: lesson.video.creator,
              language:
                lesson.video.language === 'pt-BR' ? 'Português' : 'Inglês',
            },
          ]
        : [],
    ),
  );
  return <VideoGrid videos={videos} />;
}
