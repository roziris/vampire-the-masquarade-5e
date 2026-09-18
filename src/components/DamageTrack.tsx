import { DamageState } from '../types/character';

interface DamageTrackProps {
  boxes: DamageState[];
  onChange: (boxes: DamageState[]) => void;
  label: string;
}

const CYCLE: Record<DamageState, DamageState> = {
  empty: 'superficial',
  superficial: 'aggravated',
  aggravated: 'empty',
};

const SYMBOLS: Record<DamageState, string> = {
  empty: '',
  superficial: '/',
  aggravated: 'X',
};

export function DamageTrack({ boxes, onChange, label }: DamageTrackProps) {
  const toggle = (i: number) => {
    const next = [...boxes];
    next[i] = CYCLE[next[i]];
    onChange(next);
  };

  return (
    <div>
      <div className="field-label mb-1">{label}</div>
      <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {boxes.map((state, i) => (
          <span
            key={i}
            className={`track-box ${state}`}
            onClick={() => toggle(i)}
            title={state}
          >
            {SYMBOLS[state]}
          </span>
        ))}
      </div>
    </div>
  );
}
