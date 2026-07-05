/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#05070a',
        carbon: '#0b0f14',
        panel: '#0f151c',
        steel: '#1b232d',
        line: '#233040',
        cyan: {
          DEFAULT: '#22d3ee',
          soft: '#67e8f9',
        },
        signal: '#39ff9d',
        alert: '#ff3b5c',
        amber: '#ffb020',
      },
      fontFamily: {
        display: ['"JetBrains Mono"', 'monospace'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(34,211,238,0.15), 0 0 24px rgba(34,211,238,0.08)',
        glowRed: '0 0 0 1px rgba(255,59,92,0.2), 0 0 24px rgba(255,59,92,0.12)',
      },
      backgroundImage: {
        grid: 'linear-gradient(rgba(34,211,238,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.06) 1px, transparent 1px)',
      },
      animation: {
        scan: 'scan 6s linear infinite',
        pulseSlow: 'pulseSlow 3s ease-in-out infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: 0.4 },
          '50%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
