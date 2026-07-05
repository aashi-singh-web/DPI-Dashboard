import type { IconType } from 'react-icons';

interface Props {
  label: string;
  value: number | string;
  icon: IconType;
  accent?: 'cyan' | 'signal' | 'alert' | 'amber';
}

const accentMap = {
  cyan: 'text-cyan bg-cyan/10',
  signal: 'text-signal bg-signal/10',
  alert: 'text-alert bg-alert/10',
  amber: 'text-amber bg-amber/10',
};

export default function StatCard({ label, value, icon: Icon, accent = 'cyan' }: Props) {
  return (
    <div className="glass glass-hover p-5">
      <div className="flex items-center justify-between">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${accentMap[accent]}`}>
          <Icon size={18} />
        </span>
      </div>
      <p className="mt-4 font-mono text-2xl font-semibold text-white">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      <p className="mt-1 font-mono text-xs uppercase tracking-wide text-slate-500">{label}</p>
    </div>
  );
}
