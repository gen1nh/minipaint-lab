import { StudioIcon } from '../ui/studio-icon';
import { StudioShortcuts, type LabTool } from './studio-shortcuts';
import { ArrowRight } from 'lucide-react';
import type { CSSProperties } from 'react';

const paintSamples = [
  { name: 'Coral', hex: '#d6765a' },
  { name: 'Amarelo', hex: '#e3b449' },
  { name: 'Jade', hex: '#67ad92' },
  { name: 'Azul', hex: '#7295da' },
  { name: 'Violeta', hex: '#a781c9' },
] as const;

export function StudioHome({
  onLab,
  onAcademy,
  onFind,
  onOpen,
}: {
  onLab: () => void;
  onAcademy: () => void;
  onFind: (hex: string) => void;
  onOpen: (tool: LabTool) => void;
}) {
  return (
    <div className="studio-home">
      <section className="studio-intro">
        <div className="studio-intro-copy">
          <h1 tabIndex={-1}>Da primeira gota à sua cor.</h1>
          <p>
            Misture tintas e descubra novas cores para pintar suas miniaturas.
          </p>
          <button className="studio-cta" onClick={onLab}>
            Abrir laboratório <ArrowRight size={20} aria-hidden="true" />
          </button>
        </div>
        <ul className="paint-samples" aria-label="Cores para experimentar">
          {paintSamples.map(({ name, hex }) => (
            <li key={hex} style={{ '--sample-color': hex } as CSSProperties}>
              <button
                aria-label={`Buscar tintas próximas de ${name}, ${hex}`}
                onClick={() => onFind(hex)}
              >
                <span className="paint-mark" aria-hidden="true" />
                <span>{name}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>
      <section className="home-tools">
        <h2>O que você quer criar?</h2>
        <StudioShortcuts onOpen={onOpen} />
      </section>
      <section className="home-academy">
        <StudioIcon name="book" size={36} />
        <div>
          <h2>Dicas de pintura</h2>
          <p>
            Dicas grátis de preparação, cor, luz e sombra para pintar
            miniaturas.
          </p>
        </div>
        <button className="tool-primary" onClick={onAcademy}>
          Ver dicas <ArrowRight size={18} aria-hidden="true" />
        </button>
      </section>
    </div>
  );
}
