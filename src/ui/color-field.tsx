import type { CSSProperties } from 'react';
import { Pipette } from 'lucide-react';

export function ColorField({
  label,
  hex,
  onChange,
}: {
  label: string;
  hex: string;
  onChange: (hex: string) => void;
}) {
  return (
    <label className="color-field">
      <span
        className="color-field-sample"
        style={{ '--swatch': hex } as CSSProperties}
      >
        <input
          type="color"
          value={hex}
          aria-label={label}
          onChange={(event) => onChange(event.target.value)}
        />
        <span className="color-field-icon" aria-hidden="true">
          <Pipette size={19} />
        </span>
      </span>
      <span className="color-field-caption">
        <strong>{label}</strong>
        <span>{hex}</span>
      </span>
    </label>
  );
}
