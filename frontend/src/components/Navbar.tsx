import { NavLink } from 'react-router-dom';
import { FiActivity } from 'react-icons/fi';

const links = [
  { to: '/', label: 'Home' },
  { to: '/features', label: 'Features' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/about', label: 'About' },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/60 bg-void/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <NavLink to="/" className="flex items-center gap-2 font-mono text-lg font-semibold text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan/10 text-cyan">
            <FiActivity size={18} />
          </span>
          DPI<span className="text-cyan">.dashboard</span>
        </NavLink>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-lg px-4 py-2 font-mono text-sm uppercase tracking-wide transition-colors ${
                  isActive ? 'bg-panel text-cyan' : 'text-slate-400 hover:text-white'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <NavLink to="/dashboard" className="btn-primary hidden md:inline-flex">
          Start Analysis
        </NavLink>

        {/* Mobile nav: simplified horizontal scroll */}
        <div className="flex items-center gap-1 md:hidden">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-lg px-2 py-1 font-mono text-xs uppercase tracking-wide ${
                  isActive ? 'text-cyan' : 'text-slate-400'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}
