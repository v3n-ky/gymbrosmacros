interface MacroBarProps {
  label: string;
  value: number;
  unit: string;
  color: string;
  percentage: number; // 0-100
}

export function MacroBar({ label, value, unit, color, percentage }: MacroBarProps) {
  const clamped = Math.max(0, Math.min(percentage, 100));

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-muted-foreground w-16 shrink-0">{label}</span>
      <div className="flex-1">
        <div className="h-2 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${clamped}%`, backgroundColor: color }}
          />
        </div>
      </div>
      <span className="text-sm font-bold w-20 text-right" style={{ color }}>
        {value}{unit}
      </span>
    </div>
  );
}
