import Fuse from 'fuse.js/basic';
import {
  BookOpen,
  Clapperboard,
  FileText,
  GraduationCap,
  Lightbulb,
  Search,
  X,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { academyLibrary, courses } from '../../domain/academy/courses';
import { projectGroups } from '../../domain/academy/projects';
import { benchGuides } from '../../domain/academy/workshop';
import { searchText } from '../../domain/search-text';
import { thumbnail } from './academy-workshop';

const kinds = {
  Curso: GraduationCap,
  Aula: BookOpen,
  Dica: Lightbulb,
  Projeto: Clapperboard,
  PDF: FileText,
};

const entries = [
  ...courses.flatMap((course) => [
    {
      title: course.title,
      kind: 'Curso' as const,
      videoId: course.lessons.find((lesson) => lesson.id === course.coverLesson)
        ?.video?.id,
      context: course.description,
      url: '#academia/cursos/' + course.id,
    },
    ...course.lessons.map((lesson) => ({
      title: lesson.title,
      kind: 'Aula' as const,
      videoId: lesson.video?.id,
      context: course.title,
      url: '#academia/cursos/' + course.id + '/' + lesson.id,
    })),
  ]),
  ...benchGuides.flatMap((guide) =>
    guide.videos.map((video) => ({
      title: video.title,
      kind: 'Dica' as const,
      videoId: video.id,
      context: guide.title,
      url: '#academia/dicas/' + guide.id,
    })),
  ),
  ...projectGroups.flatMap((group) =>
    group.videos.map((video) => ({
      title: video.title,
      kind: 'Projeto' as const,
      videoId: video.id,
      context: group.title,
      url:
        '#academia/projetos/' +
        group.id +
        '?' +
        new URLSearchParams({ q: video.title }),
    })),
  ),
  ...academyLibrary.map((pdf) => ({
    title: pdf.title,
    kind: 'PDF' as const,
    videoId: undefined,
    context: pdf.creator + ' · ' + pdf.language,
    url: pdf.url,
  })),
].map((entry) => ({
  ...entry,
  keywords: searchText([entry.title, entry.kind, entry.context].join(' ')),
}));

const index = new Fuse(entries, {
  keys: ['keywords'],
  threshold: 0.27,
  ignoreLocation: true,
});

export function AcademySearch({ onOpen }: { onOpen: (hash: string) => void }) {
  const [query, setQuery] = useState(
    () => new URLSearchParams(location.search).get('buscar') ?? '',
  );
  const input = useRef<HTMLInputElement>(null);
  const term = searchText(query);
  const results = term.length >= 2 ? index.search(term, { limit: 12 }) : [];

  function update(value: string) {
    const url = new URL(location.href);
    if (value.trim()) url.searchParams.set('buscar', value);
    else url.searchParams.delete('buscar');
    history.replaceState(history.state, '', url);
    setQuery(value);
  }

  return (
    <section
      className="tool-surface academy-search-section"
      aria-label="Busca da Academia"
    >
      <div className="academy-project-search">
        <Search size={20} aria-hidden="true" />
        <input
          id="academy-search-input"
          ref={input}
          type="search"
          aria-label="Buscar na Academia"
          placeholder="Buscar aulas, dicas, projetos e PDFs"
          value={query}
          maxLength={120}
          onChange={(event) => update(event.target.value)}
        />
        {query && (
          <button
            type="button"
            aria-label="Limpar busca da Academia"
            onClick={() => {
              update('');
              input.current?.focus();
            }}
          >
            <X size={18} aria-hidden="true" />
          </button>
        )}
      </div>
      {term.length >= 2 && (
        <>
          <p role="status">
            {results.length
              ? results.length + ' resultados'
              : 'Nenhum resultado na Academia.'}
          </p>
          <ul className="academy-search-results">
            {results.map(({ item }) => {
              const Icon = kinds[item.kind];
              return (
                <li key={item.kind + ':' + item.title + ':' + item.url}>
                  <a
                    href={item.url}
                    target={item.kind === 'PDF' ? '_blank' : undefined}
                    rel={item.kind === 'PDF' ? 'noreferrer' : undefined}
                    onClick={(event) => {
                      if (
                        item.kind === 'PDF' ||
                        event.ctrlKey ||
                        event.metaKey ||
                        event.shiftKey ||
                        event.altKey
                      )
                        return;
                      event.preventDefault();
                      onOpen(item.url);
                    }}
                  >
                    <span
                      className="academy-search-thumbnail"
                      data-kind={item.kind}
                    >
                      {item.videoId ? (
                        <img
                          src={thumbnail(item.videoId)}
                          alt=""
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <Icon size={22} aria-hidden="true" />
                      )}
                    </span>
                    <span className="academy-search-copy">
                      <strong>{item.title}</strong>
                      <small>
                        {item.kind} · {item.context}
                      </small>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </section>
  );
}
