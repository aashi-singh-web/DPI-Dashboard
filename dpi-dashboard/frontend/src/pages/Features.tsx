import {
  FiZap,
  FiFileText,
  FiSearch,
  FiLock,
  FiShield,
  FiBarChart2,
  FiUploadCloud,
} from 'react-icons/fi';

const features = [
  {
    icon: FiZap,
    emoji: '⚡',
    title: 'Multi-Threaded Engine',
    desc: 'Processes packets concurrently using multiple worker threads, enabling fast analysis of large network captures with improved throughput.',
  },
  {
    icon: FiFileText,
    emoji: '📄',
    title: 'PCAP Analysis',
    desc: 'Reads standard .pcap capture files and decodes Ethernet, IP, TCP, and UDP packets to extract network information.',
  },
  {
    icon: FiSearch,
    emoji: '🔍',
    title: 'Application Detection',
    desc: 'Recognizes real-world applications such as YouTube, GitHub, Google, Facebook, Discord, Spotify, and more using protocol inspection and TLS SNI analysis.',
  },
  {
    icon: FiLock,
    emoji: '🔒',
    title: 'TLS SNI Extraction',
    desc: 'Extracts the Server Name Indication (SNI) from TLS ClientHello packets to identify encrypted HTTPS traffic without decrypting it.',
  },
  {
    icon: FiShield,
    emoji: '🛡️',
    title: 'Intelligent Blocking',
    desc: 'Applies user-defined rules to block traffic based on applications, domains, or IP addresses and generates a filtered network capture.',
  },
  {
    icon: FiBarChart2,
    emoji: '📊',
    title: 'Traffic Analytics',
    desc: 'Provides detailed insights including packet counts, protocol distribution, detected applications, thread utilization, forwarding statistics, and dropped packets.',
  },
  {
    icon: FiUploadCloud,
    emoji: '📤',
    title: 'Filtered Output',
    desc: 'Generates a clean output PCAP containing only the traffic that satisfies the selected security policies, ready for further inspection in tools like Wireshark.',
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
              {f.emoji} {f.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
