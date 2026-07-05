import { FiZap, FiSearch, FiBarChart2 } from 'react-icons/fi';

const highlights = [
  {
    icon: FiZap,
    emoji: '⚡',
    title: 'Multi-threaded Processing',
    desc: 'The engine distributes packets across multiple worker threads, enabling fast and efficient inspection of large PCAP captures while maintaining accurate flow processing.',
  },
  {
    icon: FiSearch,
    emoji: '🔍',
    title: 'Deep Packet Inspection',
    desc: 'Identifies applications by inspecting packet contents beyond IP addresses and ports, allowing precise traffic classification and intelligent filtering based on applications, domains, or IP addresses.',
  },
  {
    icon: FiBarChart2,
    emoji: '📊',
    title: 'Interactive Analytics',
    desc: 'Visualizes packet statistics, detected applications, protocol distribution, thread utilization, blocking results, downloadable reports, and filtered PCAP files through an easy-to-use dashboard.',
  },
];

export default function About() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <p className="label-eyebrow">About</p>
      <h1 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
        Analyze, Classify &amp; Filter Network Traffic
      </h1>
      <p className="mt-6 leading-relaxed text-slate-400">
        This project provides a browser-based interface for a multi-threaded Deep Packet
        Inspection (DPI) Engine written in C++. Users can upload a PCAP file, inspect
        detected network applications, apply custom blocking rules for applications,
        domains, or IP addresses, and generate a filtered PCAP with detailed traffic
        analytics.
      </p>
      <p className="mt-4 leading-relaxed text-slate-400">
        The engine parses network packets, extracts protocols and domain information,
        classifies traffic into real-world applications such as YouTube, GitHub, Google,
        Facebook, Discord, Spotify, and many more, then produces interactive
        visualizations and downloadable reports through an intuitive web dashboard.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        {highlights.map((item) => (
          <div key={item.title} className="glass p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan/10 text-cyan">
              <item.icon size={20} />
            </span>
            <h3 className="mt-4 font-mono text-sm font-semibold uppercase tracking-wide text-white">
              {item.emoji} {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
