import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { ApplicationStat } from '../../types';

export default function PacketsBarChart({ applications }: { applications: ApplicationStat[] }) {
  const data = applications.slice(0, 8);

  if (data.length === 0) {
    return (
      <div className="flex h-[280px] items-center justify-center font-mono text-sm text-slate-500">
        No application data to chart
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#233040" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fill: '#94a3b8', fontFamily: 'monospace', fontSize: 11 }}
          axisLine={{ stroke: '#233040' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#94a3b8', fontFamily: 'monospace', fontSize: 11 }}
          axisLine={{ stroke: '#233040' }}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: 'rgba(34,211,238,0.06)' }}
          contentStyle={{ background: '#0f151c', border: '1px solid #233040', borderRadius: 8 }}
          labelStyle={{ color: '#e2e8f0', fontFamily: 'monospace' }}
        />
        <Bar dataKey="packets" fill="#22d3ee" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
