import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface Node {
  x: number;
  y: number;
  id: number;
}

// Deterministic pseudo-random layout so the graph looks organic but never
// shifts between renders/reloads.
function generateNodes(count: number, seed: number): Node[] {
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  return Array.from({ length: count }, (_, id) => ({
    id,
    x: rand() * 100,
    y: rand() * 100,
  }));
}

function distance(a: Node, b: Node) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export default function NetworkBackground() {
  const nodes = useMemo(() => generateNodes(26, 42), []);
  const edges = useMemo(() => {
    const result: [Node, Node][] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (distance(nodes[i], nodes[j]) < 22) {
          result.push([nodes[i], nodes[j]]);
        }
      }
    }
    return result;
  }, [nodes]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-grid bg-[size:48px_48px] opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_70%)]" />
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full opacity-70"
      >
        {edges.map(([a, b], i) => (
          <motion.line
            key={i}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke="#22d3ee"
            strokeWidth={0.08}
            initial={{ opacity: 0.05 }}
            animate={{ opacity: [0.05, 0.25, 0.05] }}
            transition={{ duration: 4 + (i % 5), repeat: Infinity, delay: (i % 7) * 0.3 }}
          />
        ))}
        {nodes.map((n) => (
          <motion.circle
            key={n.id}
            cx={n.x}
            cy={n.y}
            r={0.5}
            fill="#39ff9d"
            initial={{ opacity: 0.3 }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, delay: (n.id % 6) * 0.4 }}
          />
        ))}
      </svg>
      <div className="absolute inset-x-0 top-0 h-40 animate-scan bg-gradient-to-b from-cyan/10 to-transparent" />
    </div>
  );
}
