interface DotRatingProps {
  value: number;
  max?: number;
  onChange: (v: number) => void;
  variant?: 'default' | 'hunger' | 'blood';
  size?: 'sm' | 'md';
}

export function DotRating({ value, max = 5, onChange, variant = 'default', size = 'md' }: DotRatingProps) {
  const sz = size === 'sm' ? 11 : 14;
  const gap = size === 'sm' ? 3 : 4;

  return (
    <div style={{ display: 'flex', gap, alignItems: 'center' }}>
      {Array.from({ length: max }, (_, i) => {
        const idx = i + 1;
        const filled = idx <= value;
        let cls = 'dot';
        if (variant === 'hunger') cls += ' hunger-dot';
        if (filled) cls += ' filled';
        return (
          <span
            key={i}
            className={cls}
            style={{ width: sz, height: sz }}
            onClick={() => onChange(value === idx ? idx - 1 : idx)}
            title={`Set to ${idx}`}
          />
        );
      })}
    </div>
  );
}
