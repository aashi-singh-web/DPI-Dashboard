import type { ApplicationStat, BlockingRules } from '../types';

interface Props {
  applications: ApplicationStat[];
  blockedApps: BlockingRules['apps'];
}

export default function AppTable({ applications, blockedApps }: Props) {
  if (applications.length === 0) {
    return (
      <div className="glass p-6 text-center font-mono text-sm text-slate-500">
        No application signatures were detected in this capture.
      </div>
    );
  }

  return (
    <div className="glass overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-line/60 font-mono text-xs uppercase tracking-wide text-slate-500">
            <th className="px-5 py-3">Application</th>
            <th className="px-5 py-3">Packets</th>
            <th className="px-5 py-3">Percentage</th>
            <th className="px-5 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => {
            const isBlocked = blockedApps.some(
              (b) => b.toLowerCase() === app.name.toLowerCase()
            );
            return (
              <tr key={app.name} className="border-b border-line/30 last:border-0">
                <td className="px-5 py-3 font-mono text-sm text-white">{app.name}</td>
                <td className="px-5 py-3 font-mono text-sm text-slate-300">
                  {app.packets.toLocaleString()}
                </td>
                <td className="px-5 py-3 font-mono text-sm text-slate-300">
                  {app.percentage.toFixed(1)}%
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 font-mono text-xs uppercase tracking-wide ${
                      isBlocked ? 'bg-alert/10 text-alert' : 'bg-signal/10 text-signal'
                    }`}
                  >
                    {isBlocked ? 'Blocked' : 'Allowed'}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
