import { ArrowRight } from 'lucide-react';
import { StudioIcon } from '../ui/studio-icon';

const shortcuts = [
  {
    id: 'lab',
    title: 'Misturar tintas',
    description: 'Monte uma mistura e ajuste as gotas.',
    icon: 'drop',
    tone: 'mix',
  },
  {
    id: 'colors',
    title: 'Encontrar cores',
    description: 'Busque uma tinta ou receita.',
    icon: 'search',
    tone: 'colors',
  },
  {
    id: 'cel',
    title: 'Cel shading',
    description: 'Monte uma paleta de luz e sombra.',
    icon: 'layers',
    tone: 'shading',
  },
  {
    id: 'atelier',
    title: 'Meu ateliê',
    description: 'Abra suas receitas salvas.',
    icon: 'folder',
    tone: 'atelier',
  },
] as const;

export type LabTool = (typeof shortcuts)[number]['id'];

export function StudioShortcuts({
  onOpen,
}: {
  onOpen: (tool: LabTool) => void;
}) {
  return (
    <div className="studio-shortcuts">
      {shortcuts.map(({ id, title, description, icon, tone }) => (
        <button
          className={`shortcut-block shortcut-${tone}`}
          key={id}
          onClick={() => onOpen(id)}
        >
          <span className="shortcut-art" aria-hidden="true">
            <StudioIcon name={icon} size={28} />
          </span>
          <span className="shortcut-copy">
            <strong>{title}</strong>
            <small>{description}</small>
          </span>
          <ArrowRight className="shortcut-arrow" size={21} aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}
