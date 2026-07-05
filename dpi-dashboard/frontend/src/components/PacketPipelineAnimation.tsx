import { useEffect, useRef } from 'react';

const W = 420;
const H = 680;

const NODES = {
  pcap: { x: W / 2, y: 42, label: 'PCAP File' },
  reader: { x: W / 2, y: 108, label: 'Packet Reader' },
  lb: { x: W / 2, y: 178, label: 'Load Balancer' },
  fp: [
    { x: 72, y: 258, label: 'FP0' },
    { x: 156, y: 258, label: 'FP1' },
    { x: 264, y: 258, label: 'FP2' },
    { x: 348, y: 258, label: 'FP3' },
  ],
  merge: { x: W / 2, y: 318, label: '' },
  dpi: { x: W / 2, y: 388, label: 'DPI Detection' },
  filter: { x: W / 2, y: 468, label: 'Filtering Engine' },
  output: { x: W / 2, y: 558, label: 'Output PCAP' },
  drop: { x: 340, y: 528, label: 'Dropped' },
} as const;

type PacketColor = 'blue' | 'yellow' | 'green' | 'red';

interface Packet {
  t: number;
  fp: number;
  outcome: 'forward' | 'drop';
  speed: number;
}

const COLOR_MAP: Record<PacketColor, { fill: string; glow: string }> = {
  blue: { fill: '#22d3ee', glow: 'rgba(34,211,238,0.7)' },
  yellow: { fill: '#ffb020', glow: 'rgba(255,176,32,0.7)' },
  green: { fill: '#39ff9d', glow: 'rgba(57,255,157,0.7)' },
  red: { fill: '#ff3b5c', glow: 'rgba(255,59,92,0.7)' },
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function getPacketPosition(pkt: Packet): { x: number; y: number; color: PacketColor } {
  const { t, fp, outcome } = pkt;
  const fpNode = NODES.fp[fp];

  // Segment boundaries (total journey = 1.0)
  if (t < 0.12) {
    const s = t / 0.12;
    return {
      x: lerp(NODES.pcap.x, NODES.reader.x, s),
      y: lerp(NODES.pcap.y, NODES.reader.y, s),
      color: 'blue',
    };
  }
  if (t < 0.22) {
    const s = (t - 0.12) / 0.1;
    return {
      x: lerp(NODES.reader.x, NODES.lb.x, s),
      y: lerp(NODES.reader.y, NODES.lb.y, s),
      color: 'blue',
    };
  }
  if (t < 0.34) {
    const s = (t - 0.22) / 0.12;
    return {
      x: lerp(NODES.lb.x, fpNode.x, s),
      y: lerp(NODES.lb.y, fpNode.y, s),
      color: 'blue',
    };
  }
  if (t < 0.44) {
    const s = (t - 0.34) / 0.1;
    return {
      x: lerp(fpNode.x, NODES.merge.x, s),
      y: lerp(fpNode.y, NODES.merge.y, s),
      color: 'blue',
    };
  }
  if (t < 0.56) {
    const s = (t - 0.44) / 0.12;
    return {
      x: lerp(NODES.merge.x, NODES.dpi.x, s),
      y: lerp(NODES.merge.y, NODES.dpi.y, s),
      color: 'yellow',
    };
  }
  if (t < 0.68) {
    const s = (t - 0.56) / 0.12;
    return {
      x: lerp(NODES.dpi.x, NODES.filter.x, s),
      y: lerp(NODES.dpi.y, NODES.filter.y, s),
      color: 'yellow',
    };
  }
  if (outcome === 'forward') {
    const s = (t - 0.68) / 0.32;
    return {
      x: lerp(NODES.filter.x, NODES.output.x, s),
      y: lerp(NODES.filter.y, NODES.output.y, s),
      color: 'green',
    };
  }
  const s = (t - 0.68) / 0.32;
  return {
    x: lerp(NODES.filter.x, NODES.drop.x, s),
    y: lerp(NODES.filter.y, NODES.drop.y, s),
    color: 'red',
  };
}

function drawPipeline(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, W, H);

  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#0b0f14');
  bg.addColorStop(1, '#05070a');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Grid
  ctx.strokeStyle = 'rgba(34,211,238,0.04)';
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 28) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 0; y < H; y += 28) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

  const drawLine = (x1: number, y1: number, x2: number, y2: number, dashed = false) => {
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(34,211,238,0.25)';
    ctx.lineWidth = 1.5;
    if (dashed) ctx.setLineDash([4, 6]);
    else ctx.setLineDash([]);
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.setLineDash([]);
  };

  // Trunk lines
  drawLine(NODES.pcap.x, NODES.pcap.y + 16, NODES.reader.x, NODES.reader.y - 16);
  drawLine(NODES.reader.x, NODES.reader.y + 16, NODES.lb.x, NODES.lb.y - 16);

  NODES.fp.forEach((fp) => {
    drawLine(NODES.lb.x, NODES.lb.y + 16, fp.x, fp.y - 14);
    drawLine(fp.x, fp.y + 14, NODES.merge.x, NODES.merge.y);
  });

  drawLine(NODES.merge.x, NODES.merge.y, NODES.dpi.x, NODES.dpi.y - 16);
  drawLine(NODES.dpi.x, NODES.dpi.y + 16, NODES.filter.x, NODES.filter.y - 16);
  drawLine(NODES.filter.x, NODES.filter.y + 16, NODES.output.x, NODES.output.y - 16);
  drawLine(NODES.filter.x + 20, NODES.filter.y + 10, NODES.drop.x - 20, NODES.drop.y, true);

  const drawNode = (x: number, y: number, label: string, accent = '#22d3ee') => {
    const w = label.length > 6 ? 118 : 96;
    const h = 32;
    ctx.fillStyle = 'rgba(15,21,28,0.9)';
    ctx.strokeStyle = accent;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x - w / 2, y - h / 2, w, h, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x, y);
  };

  drawNode(NODES.pcap.x, NODES.pcap.y, NODES.pcap.label);
  drawNode(NODES.reader.x, NODES.reader.y, NODES.reader.label);
  drawNode(NODES.lb.x, NODES.lb.y, NODES.lb.label);
  NODES.fp.forEach((fp) => drawNode(fp.x, fp.y, fp.label, '#67e8f9'));
  drawNode(NODES.dpi.x, NODES.dpi.y, NODES.dpi.label, '#ffb020');
  drawNode(NODES.filter.x, NODES.filter.y, NODES.filter.label);
  drawNode(NODES.output.x, NODES.output.y, NODES.output.label, '#39ff9d');
  drawNode(NODES.drop.x, NODES.drop.y, NODES.drop.label, '#ff3b5c');
}

function drawPacket(ctx: CanvasRenderingContext2D, x: number, y: number, color: PacketColor) {
  const { fill, glow } = COLOR_MAP[color];
  const r = 5;

  ctx.save();
  ctx.shadowColor = glow;
  ctx.shadowBlur = 14;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();

  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.arc(x, y, r * 0.5, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.globalAlpha = 0.6;
  ctx.fill();
  ctx.restore();
}

export default function PacketPipelineAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const packetsRef = useRef<Packet[]>([]);
  const frameRef = useRef<number>(0);
  const spawnRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.scale(dpr, dpr);

    let last = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      spawnRef.current += dt;
      if (spawnRef.current > 0.35) {
        spawnRef.current = 0;
        packetsRef.current.push({
          t: 0,
          fp: Math.floor(Math.random() * 4),
          outcome: Math.random() < 0.75 ? 'forward' : 'drop',
          speed: 0.14 + Math.random() * 0.06,
        });
      }

      packetsRef.current = packetsRef.current
        .map((p) => ({ ...p, t: p.t + p.speed * dt }))
        .filter((p) => p.t < 1);

      drawPipeline(ctx);
      for (const pkt of packetsRef.current) {
        const pos = getPacketPosition(pkt);
        drawPacket(ctx, pos.x, pos.y, pos.color);
      }

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <div className="glass overflow-hidden p-6">
      <p className="label-eyebrow mb-4 text-center">DPI Pipeline</p>
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          className="rounded-xl border border-line/60"
          aria-hidden="true"
        />
      </div>
      <p className="mt-5 text-center font-mono text-xs text-slate-500">
        Processing capture through the inspection pipeline…
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-4 font-mono text-[10px] uppercase tracking-wider text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-cyan shadow-[0_0_8px_#22d3ee]" />
          Ingress
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-amber shadow-[0_0_8px_#ffb020]" />
          Inspection
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-signal shadow-[0_0_8px_#39ff9d]" />
          Forwarded
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-alert shadow-[0_0_8px_#ff3b5c]" />
          Dropped
        </span>
      </div>
    </div>
  );
}
