import { FiGithub, FiTerminal } from 'react-icons/fi';

export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <p className="label-eyebrow">About</p>
      <h1 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
        A web front end for a native inspection engine
      </h1>
      <p className="mt-6 leading-relaxed text-slate-400">
        This dashboard is a thin, production-grade layer over an existing C++
        Deep Packet Inspection engine. The engine itself — packet parsing,
        SNI extraction, application detection, and rule enforcement — is
        untouched. This project only adds a browser-based way to run it: an
        upload flow, a rules panel, and a results view, backed by a small
        Express API that spawns the compiled binary and turns its console
        output into structured statistics.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        <div className="glass p-6">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan/10 text-cyan">
            <FiTerminal size={20} />
          </span>
          <h3 className="mt-4 font-mono text-sm font-semibold uppercase tracking-wide text-white">
            Engine, untouched
          </h3>
          <p className="mt-2 text-sm text-slate-400">
            The backend calls the compiled binary exactly as it was designed to
            be run — same arguments, same behavior, same output file.
          </p>
        </div>
        <div className="glass p-6">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan/10 text-cyan">
            <FiGithub size={20} />
          </span>
          <h3 className="mt-4 font-mono text-sm font-semibold uppercase tracking-wide text-white">
            Open architecture
          </h3>
          <p className="mt-2 text-sm text-slate-400">
            Frontend and backend are fully separated, so either half can be
            redeployed, swapped, or extended independently.
          </p>
        </div>
      </div>
    </div>
  );
}
