import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { ApplicationStat } from '../../types';

const COLORS = ['#22d3ee', '#39ff9d', '#ffb020', '#ff3b5c', '#818cf8', '#f472b6', '#facc15'];

export default function AppPieChart({ applications }: { applications: ApplicationStat[] }) {
  const data = applications.slice(0, 7).map((a) => ({ name: a.name, value: a.packets }));

  if (data.length === 0) {
    return <EmptyState />;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={95}
          paddingAngle={2}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="#0b0f14" strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ background: '#0f151c', border: '1px solid #233040', borderRadius: 8 }}
          labelStyle={{ color: '#e2e8f0', fontFamily: 'monospace' }}
        />
        <Legend
          wrapperStyle={{ fontFamily: 'monospace', fontSize: 12, color: '#94a3b8' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

function EmptyState() {
  return (
    <div className="flex h-[280px] items-center justify-center font-mono text-sm text-slate-500">
      No application data to chart
    </div>
  );
}
