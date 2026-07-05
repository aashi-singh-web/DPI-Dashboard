import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCpu, FiLock, FiBarChart2 } from 'react-icons/fi';
import NetworkBackground from '../components/NetworkBackground';

const quickFacts = [
  { icon: FiCpu, label: 'Multi-threaded engine', desc: 'Parallel packet processing at line rate' },
  { icon: FiLock, label: 'Rule-based blocking', desc: 'App, domain, and IP-level enforcement' },
  { icon: FiBarChart2, label: 'Live statistics', desc: 'Full breakdown of every capture' },
];

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-line/60 px-6 py-28 md:py-36">
        <NetworkBackground />
        <div className="relative mx-auto max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="label-eyebrow mb-5"
          >
            Deep Packet Inspection Engine
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl"
          >
            Deep Packet Inspection Dashboard
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-slate-400"
          >
            Analyze network traffic. Detect applications. Apply blocking rules.
            Generate filtered PCAP files.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex justify-center"
          >
            <Link to="/dashboard" className="btn-primary">
              Start Analysis <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-5 sm:grid-cols-3">
          {quickFacts.map((fact) => (
            <div key={fact.label} className="glass glass-hover p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan/10 text-cyan">
                <fact.icon size={20} />
              </span>
              <h3 className="mt-4 font-mono text-sm font-semibold uppercase tracking-wide text-white">
                {fact.label}
              </h3>
              <p className="mt-2 text-sm text-slate-400">{fact.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
