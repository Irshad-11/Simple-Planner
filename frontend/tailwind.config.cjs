// frontend/tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',           // important – enables dark: prefix
  theme: {
    extend: {
      colors: {
        // ─── Light mode (default) ────────────────────────────────
        'light-bg':           '#f8fafc',         // very light cool gray
        'light-bg-secondary': '#ffffff',         // pure white cards/sections
        'light-text':         '#0f172a',         // deep slate
        'light-text-muted':   '#64748b',         // cool gray
        'light-border':       '#e2e8f0',

        'light-accent':       '#6366f1',         // indigo
        'light-accent-hover': '#4f46e5',
        'light-accent-soft':  '#eef2ff',

        // ─── Dark mode ───────────────────────────────────────────
        'dark-bg':            '#0f172a',         // slate-900
        'dark-bg-secondary':  '#1e293b',         // slate-800
        'dark-text':          '#f1f5f9',         // slate-100
        'dark-text-muted':    '#94a3b8',         // slate-400
        'dark-border':        '#334155',

        'dark-accent':        '#818cf8',         // indigo-400 (lighter & more visible on dark)
        'dark-accent-hover':  '#6366f1',
        'dark-accent-soft':   '#312e81',         // indigo-900/40ish feel

        'input-bg': 'var(--input-bg)',

        // Semantic aliases – choose color depending on mode
        bg:           'var(--bg)',
        'bg-secondary': 'var(--bg-secondary)',
        text:         'var(--text)',
        'text-muted': 'var(--text-muted)',
        border:       'var(--border)',
        accent:       'var(--accent)',
        'accent-hover': 'var(--accent-hover)',
        'accent-soft':  'var(--accent-soft)',
      },

      fontFamily: {
        display: ['Inter', 'sans-serif'],
      },

      borderRadius: {
        DEFAULT: '0.375rem',
        lg:      '0.5rem',
        xl:      '0.75rem',
        '2xl':   '1rem',
        '3xl':   '1.5rem',
      },

      transitionProperty: {
        'theme': 'background-color, border-color, color, fill, stroke, box-shadow',
        'width': 'width, padding',
      },

      transitionTimingFunction: {
        'theme': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};