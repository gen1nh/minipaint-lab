import { useStudioNotice } from '../../ui/studio-notice';
import { StudioHeading } from '../../ui/studio-heading';
import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  FileText,
  GraduationCap,
  Play,
  BookOpen,
  Brush,
  Check,
  ChevronRight,
  Clapperboard,
  Target,
  PackageOpen,
} from 'lucide-react';
import { academyLibrary, courses } from '../../domain/academy/courses';
import { AcademySearch } from './academy-search';
import {
  BenchGuides,
  thumbnail,
  WorkshopContent,
  workshopSections,
  type WorkshopSection,
} from './academy-workshop';
import './academy.css';
type AcademyView =
  'home' | 'courses' | 'tips' | 'course' | 'library' | WorkshopSection;

const segments = {
  home: '',
  courses: 'cursos',
  tips: 'dicas',
  course: 'cursos',
  library: 'biblioteca',
  projects: 'projetos',
  practice: 'treinos',
  kits: 'materiais',
} as const;

function readRoute() {
  const [, section, courseId, lessonId] = (
    location.hash.slice(1) || location.pathname.slice(1)
  ).split('/');
  const workshop = (Object.keys(workshopSections) as WorkshopSection[]).find(
    (key) => segments[key] === section,
  );
  const view: AcademyView =
    workshop ??
    (section === segments.courses
      ? courseId
        ? 'course'
        : 'courses'
      : section === segments.tips
        ? 'tips'
        : section === segments.library
          ? 'library'
          : section === 'primeira-miniatura'
            ? 'course'
            : 'home');
  const course = courses.find((item) => item.id === courseId) ?? courses[0]!;
  return {
    view,
    courseId: course.id,
    lessonIndex: Math.max(
      0,
      course.lessons.findIndex((item) => item.id === lessonId),
    ),
  };
}

const workshopIcons = {
  projects: Clapperboard,
  practice: Target,
  kits: PackageOpen,
};

const key = 'minipaint:academy:v1';
function readProgress(): string[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) ?? '[]');
    return Array.isArray(value)
      ? value.filter((x): x is string => typeof x === 'string')
      : [];
  } catch {
    return [];
  }
}
export function Academy({
  onFind,
  onPrimer,
  onShading,
  onMixer,
}: {
  onFind: (hex: string) => void;
  onPrimer: () => void;
  onShading: () => void;
  onMixer: () => void;
}) {
  const [{ view, courseId, lessonIndex }, setRoute] = useState(readRoute);
  const sectionHeading = useRef<HTMLHeadingElement>(null);
  const firstModule = useRef<HTMLButtonElement>(null);
  const [playingVideo, setPlayingVideo] = useState<string>();
  const [done, setDone] = useState(readProgress);
  const notify = useStudioNotice();
  const tipHeading = useRef<HTMLHeadingElement>(null);
  const course = courses.find((c) => c.id === courseId) ?? courses[0]!;
  const lesson = course.lessons[lessonIndex] ?? course.lessons[0]!;
  const id = course.id + '/' + lesson.id;
  const video = lesson.video;
  const viewed = course.lessons.filter((item) =>
    done.includes(course.id + '/' + item.id),
  ).length;
  const nextLesson = course.lessons[lessonIndex + 1];
  useEffect(() => {
    function restore() {
      setPlayingVideo(undefined);
      setRoute(readRoute());
      const focusId = history.state?.academyFocusId;
      requestAnimationFrame(() => {
        const origin =
          typeof focusId === 'string' ? document.getElementById(focusId) : null;
        (
          origin ??
          sectionHeading.current ??
          tipHeading.current ??
          firstModule.current
        )?.focus();
      });
    }
    window.addEventListener('popstate', restore);
    return () => window.removeEventListener('popstate', restore);
  }, []);

  const fallbackBack =
    view === 'course' ? 'Voltar aos cursos' : 'Voltar à Academia';
  const returnPoint = history.state?.academyReturn as
    { label: string } | undefined;

  function navigate(
    next: AcademyView,
    nextCourse?: string,
    index = 0,
    parent = false,
    topic?: string,
  ) {
    const collection = courses.find((item) => item.id === nextCourse);
    const slug = [
      'academia',
      segments[next],
      collection?.id,
      collection?.lessons[index]?.id,
      topic,
    ]
      .filter(Boolean)
      .join('/');
    const hash = '#' + slug;
    if (hash !== location.hash) {
      if (parent) history.replaceState(null, '', hash);
      else {
        const sameCourse =
          next === 'course' && view === 'course' && nextCourse === courseId;
        const label =
          view === 'home'
            ? 'Voltar à Academia'
            : view === 'courses'
              ? 'Voltar aos cursos'
              : view === 'kits'
                ? 'Voltar ao roadmap'
                : view === 'course'
                  ? 'Voltar à aula'
                  : view === 'tips'
                    ? 'Voltar às dicas'
                    : 'Voltar';
        history.pushState(
          {
            academyReturn: {
              label: sameCourse ? 'Voltar à aula' : label,
            },
          },
          '',
          hash,
        );
      }
      setPlayingVideo(undefined);
      setRoute(readRoute());
    }
    requestAnimationFrame(() =>
      (
        (next === view ? tipHeading.current : sectionHeading.current) ??
        firstModule.current
      )?.focus(),
    );
  }

  function openRoadmapLesson(path: string) {
    history.replaceState(
      { ...history.state, academyFocusId: 'academy-roadmap-lesson' },
      '',
    );
    const [section, courseId, lessonId] = path.split('/');
    if (section === 'dicas') {
      navigate('tips', undefined, 0, false, courseId);
      return;
    }
    const collection = courses.find((item) => item.id === courseId);
    const index =
      collection?.lessons.findIndex((item) => item.id === lessonId) ?? -1;
    if (collection && index >= 0) navigate('course', collection.id, index);
  }

  function chooseTip(nextCourse: string, index: number) {
    navigate(view, nextCourse, index);
  }

  const currentTool = lesson.tool
    ? {
        primer: { action: onPrimer, label: 'Comparar sobre primer' },
        mixer: { action: onMixer, label: 'Abrir misturador' },
        shading: {
          action: onShading,
          label: 'Testar luz e sombra no Cel shading',
        },
      }[lesson.tool]
    : undefined;
  function toggle() {
    const next = done.includes(id)
      ? done.filter((x) => x !== id)
      : [...done, id];
    setDone(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      notify('Progresso disponível apenas nesta sessão.', true);
    }
  }
  return (
    <div className="tool-page academy">
      {view !== 'home' && (
        <button
          type="button"
          className="tool-secondary page-back"
          onClick={() => {
            if (returnPoint) history.back();
            else
              navigate(
                view === 'course' ? 'courses' : 'home',
                undefined,
                0,
                true,
              );
          }}
        >
          <ArrowLeft size={16} aria-hidden="true" />{' '}
          {returnPoint?.label ?? fallbackBack}
        </button>
      )}
      <StudioHeading
        title="Academia"
        description="Cursos, projetos e guias práticos para pintar miniaturas."
      />
      {view === 'home' && (
        <section
          className="tool-surface academy-first-project"
          aria-labelledby="academy-first-title"
        >
          <div>
            <h2 id="academy-first-title">Pintar minha primeira miniatura</h2>
            <p>Da preparação da peça aos primeiros retoques.</p>
          </div>
          <div className="academy-lesson-actions">
            <button
              className="tool-primary"
              onClick={() => navigate('course', 'fundamentos')}
            >
              Começar Fundamentos
            </button>
            <button
              className="tool-secondary"
              onClick={() =>
                navigate('kits', undefined, 0, false, 'preparo?painel=kit')
              }
            >
              Ver kit essencial
            </button>
          </div>
        </section>
      )}
      {view === 'home' && (
        <AcademySearch
          onOpen={(hash) => {
            history.replaceState(
              { ...history.state, academyFocusId: 'academy-search-input' },
              '',
            );
            history.pushState(
              { academyReturn: { label: 'Voltar à busca' } },
              '',
              hash,
            );
            setRoute(readRoute());
            requestAnimationFrame(() =>
              (tipHeading.current ?? sectionHeading.current)?.focus(),
            );
          }}
        />
      )}
      {view === 'home' && (
        <section className="academy-modules" aria-label="Módulos da Academia">
          <button
            type="button"
            ref={firstModule}
            className="academy-module academy-module-courses"
            onClick={() => navigate('courses')}
          >
            <GraduationCap size={24} aria-hidden="true" />
            <span>
              <strong>Cursos</strong>
              <small>Do primer às técnicas de luz, sombra e volume.</small>
            </span>
            <ChevronRight size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="academy-module academy-module-library"
            onClick={() => navigate('library')}
          >
            <BookOpen size={24} aria-hidden="true" />
            <span>
              <strong>Biblioteca</strong>
              <small>Guias de pintura em PDF.</small>
            </span>
            <ChevronRight size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="academy-module academy-module-tips"
            onClick={() => navigate('tips')}
          >
            <Brush size={24} aria-hidden="true" />
            <span>
              <strong>Dicas práticas</strong>
              <small>Aerógrafo, pincéis, diluição e preparo da peça.</small>
            </span>
            <ChevronRight size={18} aria-hidden="true" />
          </button>

          {(Object.keys(workshopSections) as WorkshopSection[]).map(
            (section) => {
              const Icon = workshopIcons[section];
              const { title, description } = workshopSections[section];
              return (
                <button
                  type="button"
                  key={section}
                  className={`academy-module academy-module-${section}`}
                  onClick={() => navigate(section)}
                >
                  <Icon size={24} aria-hidden="true" />
                  <span>
                    <strong>{title}</strong>
                    <small>{description}</small>
                  </span>
                  <ChevronRight size={18} aria-hidden="true" />
                </button>
              );
            },
          )}
        </section>
      )}
      {view === 'courses' && (
        <section className="tool-surface academy-roadmap">
          <h2 ref={sectionHeading} tabIndex={-1}>
            Cursos
          </h2>
          <p>Comece pelos fundamentos e escolha a técnica que quer praticar.</p>
          <ol>
            {courses.map((item) => {
              const cover = item.lessons.find(
                (entry) => entry.id === item.coverLesson,
              )?.video;
              const finished = item.lessons.filter((tip) =>
                done.includes(item.id + '/' + tip.id),
              ).length;
              const videoCount = item.lessons.filter(
                (entry) => entry.video,
              ).length;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className="academy-roadmap-course"
                    onClick={() => navigate('course', item.id)}
                  >
                    {cover && (
                      <img
                        className="academy-course-cover"
                        src={thumbnail(cover.id)}
                        loading="lazy"
                        decoding="async"
                        alt=""
                      />
                    )}
                    <span>
                      <strong>{item.title}</strong>
                      <small>{item.description}</small>
                      <small>
                        {item.level} · {videoCount} vídeos
                      </small>
                      <small>
                        {finished} de {item.lessons.length}{' '}
                        {item.lessons.length === 1
                          ? 'aula vista'
                          : 'aulas vistas'}
                      </small>
                    </span>
                    <ChevronRight size={18} aria-hidden="true" />
                  </button>
                </li>
              );
            })}
          </ol>
        </section>
      )}
      {view === 'course' && (
        <div>
          <h2 ref={sectionHeading} tabIndex={-1}>
            {course.title}
          </h2>
          {course.id === 'fundamentos' && (
            <a
              className="academy-video-link"
              href="#academia/materiais/preparo?painel=kit"
              onClick={(event) => {
                if (
                  event.ctrlKey ||
                  event.metaKey ||
                  event.shiftKey ||
                  event.altKey
                )
                  return;
                event.preventDefault();
                navigate('kits', undefined, 0, false, 'preparo?painel=kit');
              }}
            >
              Ver kit essencial
            </a>
          )}
        </div>
      )}
      {view === 'library' && (
        <section className="tool-surface academy-library">
          <h2 ref={sectionHeading} tabIndex={-1}>
            Biblioteca
          </h2>
          <p>Guias gratuitos para abrir na fonte original.</p>
          <ResourceLinks resources={academyLibrary} />
        </section>
      )}
      {(view === 'projects' || view === 'practice' || view === 'kits') && (
        <section
          className={
            view === 'kits'
              ? 'academy-material-workshop'
              : 'tool-surface academy-workshop'
          }
        >
          <h2 ref={sectionHeading} tabIndex={-1}>
            {workshopSections[view].title}
          </h2>
          <WorkshopContent section={view} onRoadmapLesson={openRoadmapLesson} />
        </section>
      )}
      {view === 'tips' && (
        <section className="tool-surface academy-library">
          <h2 ref={sectionHeading} tabIndex={-1}>
            Dicas práticas
          </h2>
          <BenchGuides />
        </section>
      )}
      {view === 'course' && (
        <div className="academy-layout">
          <section className="tool-surface academy-lesson academy-watch">
            <h2 ref={tipHeading} tabIndex={-1}>
              {lesson.title}
            </h2>
            {video && (
              <>
                <div className="academy-video">
                  {playingVideo === video.id ? (
                    <iframe
                      title={video.title}
                      src={
                        'https://www.youtube-nocookie.com/embed/' +
                        video.id +
                        '?autoplay=1'
                      }
                      allow="autoplay; encrypted-media; picture-in-picture"
                      allowFullScreen
                      referrerPolicy="strict-origin-when-cross-origin"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPlayingVideo(video.id)}
                    >
                      <img src={thumbnail(video.id)} decoding="async" alt="" />
                      <span className="academy-play-icon">
                        <Play size={23} aria-hidden="true" />
                      </span>
                      <strong>Assistir ao vídeo</strong>
                    </button>
                  )}
                </div>
                <p className="academy-video-credit">
                  {video.creator} ·{' '}
                  {video.language === 'pt-BR'
                    ? 'Português (Brasil)'
                    : video.language === 'en'
                      ? 'Inglês'
                      : 'Italiano'}{' '}
                  · {video.level}
                </p>
                <a
                  className="academy-video-link"
                  href={'https://www.youtube.com/watch?v=' + video.id}
                >
                  Abrir vídeo original no YouTube{' '}
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </>
            )}
            <div className="academy-practice" key={id}>
              {lesson.colors && (
                <ul className="academy-palette" aria-label="Cores sugeridas">
                  {lesson.colors.map((hex) => (
                    <li key={hex}>
                      <button
                        className="swatch-action"
                        aria-label={`Buscar tinta ${hex}`}
                        onClick={() => onFind(hex)}
                      >
                        <span
                          className="swatch-block"
                          style={{ background: hex }}
                          aria-hidden="true"
                        />
                        <small>
                          {hex} <ArrowUpRight size={15} aria-hidden="true" />
                        </small>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {currentTool && (
                <button
                  type="button"
                  className="tool-secondary"
                  onClick={currentTool.action}
                >
                  {currentTool.label}{' '}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </button>
              )}
              {lesson.resources && (
                <ResourceLinks resources={lesson.resources} />
              )}
              <div className="academy-lesson-actions">
                <button
                  className="tool-primary"
                  aria-pressed={done.includes(id)}
                  onClick={toggle}
                >
                  <Check size={18} aria-hidden="true" />{' '}
                  {done.includes(id)
                    ? video
                      ? 'Desmarcar como visto'
                      : 'Desmarcar como vista'
                    : video
                      ? 'Marcar como visto'
                      : 'Marcar como vista'}
                </button>
                {nextLesson && (
                  <button
                    type="button"
                    className="tool-secondary"
                    onClick={() => chooseTip(course.id, lessonIndex + 1)}
                  >
                    Próxima aula
                    <ChevronRight size={17} aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
          </section>
          <section className="tool-surface academy-lesson-list">
            <h2>Conteúdo do curso</h2>
            <progress
              value={viewed}
              max={course.lessons.length}
              aria-label="Aulas vistas"
            />
            <p>
              {viewed} de {course.lessons.length} aulas vistas
            </p>
            <ol>
              {course.lessons.map((item, index) => {
                const finished = done.includes(course.id + '/' + item.id);
                return (
                  <li key={item.id}>
                    <button
                      aria-current={item.id === lesson.id ? 'step' : undefined}
                      onClick={() => chooseTip(course.id, index)}
                    >
                      {finished ? (
                        <Check size={19} aria-hidden="true" />
                      ) : (
                        <BookOpen size={19} aria-hidden="true" />
                      )}
                      <span>
                        {item.title}
                        {finished && <span className="sr-only">, vista</span>}
                      </span>
                      <ChevronRight size={17} aria-hidden="true" />
                    </button>
                  </li>
                );
              })}
            </ol>
          </section>
        </div>
      )}
    </div>
  );
}

function ResourceLinks({ resources }: { resources: typeof academyLibrary }) {
  return (
    <ul className="academy-resources">
      {resources.map((resource) => (
        <li key={resource.url}>
          <a href={resource.url} target="_blank" rel="noreferrer">
            <FileText
              className="academy-pdf-icon"
              size={22}
              aria-hidden="true"
            />
            <span>
              <strong>{resource.title}</strong>
              <small>
                {resource.creator} · {resource.format} · {resource.language}
              </small>
            </span>
            <ArrowUpRight size={16} aria-hidden="true" />
            <span className="sr-only"> (abre em nova aba)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
