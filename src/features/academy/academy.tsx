import { useStudioNotice } from '../../ui/studio-notice';
import { StudioHeading } from '../../ui/studio-heading';
import { useState } from 'react';
import {
  ArrowUpRight,
  BookOpen,
  Brush,
  Check,
  ChevronRight,
} from 'lucide-react';
import { courses } from '../../domain/academy/courses';
import './academy.css';
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
}: {
  onFind: (hex: string) => void;
  onPrimer: () => void;
  onShading: () => void;
}) {
  const [courseId, setCourseId] = useState('fundamentos');
  const [lessonIndex, setLessonIndex] = useState(0);
  const [done, setDone] = useState(readProgress);
  const notify = useStudioNotice();
  const course = courses.find((c) => c.id === courseId) ?? courses[0]!;
  const lesson = course.lessons[lessonIndex] ?? course.lessons[0]!;
  const id = course.id + '/' + lesson.id;
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
  const completed = course.lessons.filter((item) =>
    done.includes(course.id + '/' + item.id),
  ).length;
  return (
    <div className="tool-page academy">
      <StudioHeading
        title="Dicas de pintura"
        description="Pratique técnicas de pintura com estudos de cor e exercícios para miniaturas."
      >
        <label className="academy-course">
          Técnica
          <select
            value={courseId}
            onChange={(event) => {
              setCourseId(event.target.value);
              setLessonIndex(0);
            }}
          >
            {courses.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </label>
      </StudioHeading>
      <section className="tool-surface academy-start">
        <h2>Por onde começar</h2>
        <div className="tool-modes" role="group" aria-label="Primeiras dicas">
          {[
            { course: 'fundamentos', index: 0, label: 'Preparar a peça' },
            { course: 'fundamentos', index: 1, label: 'Aplicar a cor-base' },
            { course: 'cel', index: 0, label: 'Escolher luz e sombra' },
          ].map((step) => (
            <button
              key={step.label}
              type="button"
              aria-pressed={
                courseId === step.course && lessonIndex === step.index
              }
              onClick={() => {
                setCourseId(step.course);
                setLessonIndex(step.index);
              }}
            >
              {step.label}
            </button>
          ))}
        </div>
      </section>
      <div className="academy-layout">
        <section className="tool-surface academy-lesson">
          <h2>{lesson.title}</h2>
          <p>{lesson.summary}</p>
          {lesson.video && (
            <>
              <iframe
                title={lesson.video.title}
                src={
                  'https://www.youtube-nocookie.com/embed/' + lesson.video.id
                }
                allowFullScreen
                loading="lazy"
              />
              <p>
                {lesson.video.creator} ·{' '}
                <a href={'https://www.youtube.com/watch?v=' + lesson.video.id}>
                  Vídeo original
                </a>
              </p>
            </>
          )}
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
          <div className="academy-exercise">
            <Brush size={22} aria-hidden="true" />
            <div>
              <h3>Exercício</h3>
              <p>{lesson.exercise}</p>
            </div>
          </div>
          {lesson.id === 'prep' && (
            <button type="button" className="tool-secondary" onClick={onPrimer}>
              Comparar sobre primer
            </button>
          )}
          {lesson.id === 'values' && (
            <button
              type="button"
              className="tool-secondary"
              onClick={onShading}
            >
              Testar luz e sombra no Cel shading
            </button>
          )}
          <details className="studio-disclosure">
            <summary>Materiais sugeridos</summary>
            <ul>
              {lesson.materials.map((material) => (
                <li key={material}>{material}</li>
              ))}
            </ul>
            <small>Recomendações do Pincel Guia.</small>
          </details>
          <button
            className="tool-primary"
            aria-pressed={done.includes(id)}
            onClick={toggle}
          >
            <Check size={18} aria-hidden="true" />{' '}
            {done.includes(id) ? 'Desmarcar como vista' : 'Marcar como vista'}
          </button>
        </section>
        <section className="academy-playlist">
          <h2>Dicas</h2>
          <progress
            value={completed}
            max={course.lessons.length}
            aria-label="Dicas consultadas"
          />
          <p>
            {completed} de {course.lessons.length} vistas
          </p>
          <ol>
            {course.lessons.map((item, index) => {
              const finished = done.includes(course.id + '/' + item.id);
              return (
                <li key={item.id}>
                  <button
                    aria-current={index === lessonIndex ? 'step' : undefined}
                    onClick={() => setLessonIndex(index)}
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
    </div>
  );
}
