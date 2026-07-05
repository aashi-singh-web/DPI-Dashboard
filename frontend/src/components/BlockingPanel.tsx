import { BLOCKABLE_APPS } from '../types';
import type { BlockingRules } from '../types';
import { FiShield } from 'react-icons/fi';

interface Props {
  rules: BlockingRules;
  onChange: (rules: BlockingRules) => void;
}

export default function BlockingPanel({ rules, onChange }: Props) {
  function toggleApp(app: string) {
    const apps = rules.apps.includes(app)
      ? rules.apps.filter((a) => a !== app)
      : [...rules.apps, app];
    onChange({ ...rules, apps });
  }

  function setDomains(value: string) {
    const domains = value.split(',').map((d) => d.trim()).filter(Boolean);
    onChange({ ...rules, domains });
  }

  function setIps(value: string) {
    const ips = value.split(',').map((d) => d.trim()).filter(Boolean);
    onChange({ ...rules, ips });
  }

  return (
    <div className="glass p-6">
      <div className="mb-5 flex items-center gap-2">
        <FiShield className="text-cyan" />
        <h3 className="label-eyebrow">Blocking rules</h3>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {BLOCKABLE_APPS.map((app) => {
          const active = rules.apps.includes(app);
          return (
            <button
              key={app}
              type="button"
              onClick={() => toggleApp(app)}
              className={`rounded-lg border px-3 py-2 text-left font-mono text-sm transition-all duration-150 ${
                active
                  ? 'border-alert/50 bg-alert/10 text-alert'
                  : 'border-line text-slate-300 hover:border-cyan/40 hover:text-cyan'
              }`}
            >
              {app}
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-slate-400">
            Custom domains
          </label>
          <input
            type="text"
            placeholder="facebook, netflix.com"
            defaultValue={rules.domains.join(', ')}
            onBlur={(e) => setDomains(e.target.value)}
            className="w-full rounded-lg border border-line bg-carbon px-3 py-2 font-mono text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan/50"
          />
        </div>
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-slate-400">
            Custom IPs
          </label>
          <input
            type="text"
            placeholder="192.168.1.50, 10.0.0.5"
            defaultValue={rules.ips.join(', ')}
            onBlur={(e) => setIps(e.target.value)}
            className="w-full rounded-lg border border-line bg-carbon px-3 py-2 font-mono text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan/50"
          />
        </div>
      </div>
    </div>
  );
}
