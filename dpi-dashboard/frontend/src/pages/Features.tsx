import {
  FiCpu,
  FiFileText,
  FiSearch,
  FiLock,
  FiShield,
  FiBarChart2,
  FiFilter,
} from 'react-icons/fi';

const features = [
  {
    icon: FiCpu,
    title: 'Multi-threaded engine',
    desc: 'Packets are distributed across worker threads for high-throughput analysis of large captures.',
  },
  {
    icon: FiFileText,
    title: 'PCAP analysis',
    desc: 'Parses Ethernet, IP, TCP, and UDP layers directly from standard .pcap capture files.',
  },
  {
    icon: FiSearch,
    title: 'Application detection',
    desc: 'Identifies the application generating each flow using signature and heuristic matching.',
  },
  {
    icon: FiLock,
    title: 'TLS SNI extraction',
    desc: 'Reads the Server Name Indication field from TLS ClientHello messages to classify encrypted traffic.',
  },
  {
    icon: FiShield,
    title: 'Blocking rules',
    desc: 'Enforce policy by application, domain, or IP address — packets matching a rule are dropped.',
  },
  {
    icon: FiBarChart2,
    title: 'Statistics',
    desc: 'Detailed counters for total, TCP, UDP, forwarded, and dropped packets on every run.',
  },
  {
    icon: FiFilter,
    title: 'Filtering',
    desc: 'Produces a clean output .pcap containing only the traffic that passed your rules.',
  },
];

export default function Features() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <p className="label-eyebrow text-center">Capabilities</p>
      <h1 className="mt-3 text-center font-display text-3xl font-bold text-white sm:text-4xl">
        What the engine does
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-center text-slate-400">
        Every capability below runs inside the C++ engine itself. The dashboard
        only exposes it through a browser.
      </p>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="glass glass-hover p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan/10 text-cyan">
              <f.icon size={20} />
            </span>
            <h3 className="mt-4 font-mono text-sm font-semibold uppercase tracking-wide text-white">
              {f.title}
            </h3>
            <p className="mt-2 text-sm text-slate-400">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
