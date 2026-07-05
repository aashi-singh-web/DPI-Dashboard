import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { ThreadStat } from '../../types';

export default function ThreadLineChart({ threads }: { threads: ThreadStat[] }) {
  if (threads.length === 0) {
    return (
      <div className="flex h-[280px] items-center justify-center font-mono text-sm text-slate-500">
        No per-thread statistics reported by the engine
      </div>
    );
  }

  const data = threads.map((t) => ({ name: `T${t.thread}`, packets: t.packets }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
          contentStyle={{ background: '#0f151c', border: '1px solid #233040', borderRadius: 8 }}
          labelStyle={{ color: '#e2e8f0', fontFamily: 'monospace' }}
        />
        <Line
          type="monotone"
          dataKey="packets"
          stroke="#39ff9d"
          strokeWidth={2}
          dot={{ fill: '#39ff9d', r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
