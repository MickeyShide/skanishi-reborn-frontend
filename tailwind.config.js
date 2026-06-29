/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        ui: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        sk: {
          bg: 'rgb(var(--color-bg) / <alpha-value>)',
          bg2: 'rgb(var(--color-bg2) / <alpha-value>)',
          surface: 'rgb(var(--color-surface) / <alpha-value>)',
          line: 'rgb(var(--color-line) / <alpha-value>)',
          text: 'rgb(var(--color-text) / <alpha-value>)',
          text2: 'rgb(var(--color-text2) / <alpha-value>)',
          text3: 'rgb(var(--color-text3) / <alpha-value>)',
          violet: 'rgb(var(--color-violet) / <alpha-value>)',
          violetHi: 'rgb(var(--color-violet-hi) / <alpha-value>)',
          cyan: 'rgb(var(--color-cyan) / <alpha-value>)',
          gold: 'rgb(var(--color-gold) / <alpha-value>)',
          pink: 'rgb(var(--color-pink) / <alpha-value>)',
          green: 'rgb(var(--color-green) / <alpha-value>)',
          tg: 'rgb(var(--color-telegram) / <alpha-value>)',
          ink: 'rgb(var(--color-ink) / <alpha-value>)',
        },
      },
      spacing: {
        'safe-top': 'var(--safe-area-top)',
        'safe-bottom': 'var(--safe-area-bottom)',
        'safe-left': 'var(--safe-area-left)',
        'safe-right': 'var(--safe-area-right)',
        'content-safe-top': 'var(--content-safe-area-top)',
        'content-safe-bottom': 'var(--content-safe-area-bottom)',
      },
      borderRadius: {
        card: '20px',
      },
      boxShadow: {
        card: '0 8px 30px rgba(0, 0, 0, 0.35)',
        nav: '0 10px 40px rgba(0, 0, 0, 0.50)',
      },
      keyframes: {
        holoShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
        scanMove: {
          '0%, 100%': { top: '10%', opacity: '0.2' },
          '50%': { top: '88%', opacity: '1' },
        },
        pulseRing: {
          '0%': { transform: 'translate(-50%, -50%) scale(0.55)', opacity: '0.7' },
          '100%': { transform: 'translate(-50%, -50%) scale(1.7)', opacity: '0' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.35' },
        },
        screenIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        holo: 'holoShift 7s linear infinite',
        scanline: 'scanMove 2.6s cubic-bezier(.45,0,.55,1) infinite',
        pulse: 'pulseRing 2.4s ease-out infinite',
        blink: 'blink 1.6s ease-in-out infinite',
        screenIn: 'screenIn 180ms ease-out both',
      },
    },
  },
  plugins: [],
};
