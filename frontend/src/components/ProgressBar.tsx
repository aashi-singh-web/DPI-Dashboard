interface Props {
  label: string;
  value: number;
  total: number;
  color: 'cyan' | 'signal' | 'alert';
}

const colorMap = {
  cyan: 'bg-cyan',
  signal: 'bg-signal',
  alert: 'bg-alert',
};

export default function ProgressBar({ label, value, total, color }: Props) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between font-mono text-xs uppercase tracking-wide text-slate-400">
        <span>{label}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-steel">
        <div
          className={`h-full rounded-full ${colorMap[color]} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
