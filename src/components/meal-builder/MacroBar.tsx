interface MacroBarProps {
  label: string;
  value: number;
  unit: string;
  color: string;
  max?: number;
}

export function MacroBar({ label, value, unit, color, max }: MacroBarProps) {
  const percentage = max ? Math.min((value / max) * 100, 100) : undefined;

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-muted-foreground w-16 shrink-0">{label}</span>
      <div className="flex-1">
        {percentage != null ? (
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${percentage}%`, backgroundColor: color }}
            />
          </div>
        ) : (
          <div className="h-2 rounded-full" style={{ backgroundColor: color, width: '100%', opacity: 0.3 }} />
        )}
      </div>
      <span className="text-sm font-bold w-20 text-right" style={{ color }}>
        {value}{unit}
      </span>
    </div>
  );
}
