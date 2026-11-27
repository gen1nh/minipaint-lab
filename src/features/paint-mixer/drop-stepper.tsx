import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

export function DropStepper({
  value,
  min,
  label,
  decreaseLabel,
  increaseLabel,
  onChange,
}: {
  value: number;
  min: number;
  label: string;
  decreaseLabel: string;
  increaseLabel: string;
  onChange: (value: number) => void;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const maximum = 10000;

  function commit() {
    if (draft !== null && /^\d+$/.test(draft)) {
      onChange(Math.min(maximum, Math.max(min, Number(draft))));
    }
    setDraft(null);
  }

  return (
    <div className="drop-stepper">
      <button
        type="button"
        aria-label={decreaseLabel}
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      >
        <Minus size={19} aria-hidden="true" />
      </button>
      <label>
        <span className="sr-only">{label}</span>
        <input
          inputMode="numeric"
          value={draft ?? value}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === 'Enter') commit();
            if (event.key === 'Escape') setDraft(null);
          }}
        />
        <small aria-hidden="true">{value === 1 ? 'gota' : 'gotas'}</small>
      </label>
      <button
        type="button"
        aria-label={increaseLabel}
        disabled={value >= maximum}
        onClick={() => onChange(value + 1)}
      >
        <Plus size={19} aria-hidden="true" />
      </button>
    </div>
  );
}
