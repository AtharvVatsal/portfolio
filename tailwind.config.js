/** @type {import('tailwindcss').Config} */
// Every colour resolves to an archive token in src/index.css (:root), so the
// palette has one source. Values and contrast notes live there.
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        notebook: {
          bg: token('archive-ground'),
          surface: token('archive-ground-sunken'),
          'surface-alt': token('archive-ground-elevated'),
          border: token('archive-hairline'),
          'border-light': token('archive-divider'),
        },
        ink: {
          primary: token('archive-ink'),
          secondary: token('archive-ink-secondary'),
          muted: token('archive-ink-muted'),
          faint: token('archive-ink-faint'),
        },
        accent: {
          DEFAULT: token('archive-accent'),
          strong: token('archive-interactive'),
          deep: token('archive-accent-muted'),
        },
        focus: token('archive-focus'),
        success: token('archive-success'),
        warning: token('archive-warning'),
        error: token('archive-error'),
        // Atmosphere — "light entering a dark room" (gradient and transitions)
        archive: {
          night: token('archive-night'),
          warm: token('archive-warm'),
          amber: token('archive-amber'),
          light: token('archive-light'),
        },
      },
      fontFamily: {
        serif: ['"Instrument Serif"', '"Instrument Serif Fallback"', 'Georgia', 'serif'],
        sans: ['Inter', '"Inter Fallback"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"JetBrains Mono Fallback"', 'ui-monospace', 'monospace'],
      },
      // The archive type scale (see DESIGN-IMPLEMENTATION-CHECKPOINT §29):
      //   micro   0.8125rem uppercase reference lines and compact labels (.meta-label)
      //   meta    0.9rem   references, dates, EXIF, labels (mono or Inter)
      //   small   1rem     supporting prose, captions, UI text
      //   body-sm 1.125rem secondary reading text
      //   body    1.25rem  reading text
      //   lead    1.5rem   introductions, statements in Inter
      //   title   2rem     subsection / card titles (serif)
      //   headline 2.5rem  section headings (serif)
      //   display 4rem     page titles (serif)
      fontSize: {
        'display': ['4rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'headline': ['2.5rem', { lineHeight: '1.1', letterSpacing: '-0.015em' }],
        'title': ['2rem', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
        'lead': ['1.5rem', { lineHeight: '1.6' }],
        'body': ['1.25rem', { lineHeight: '1.9' }],
        'body-sm': ['1.125rem', { lineHeight: '1.9' }],
        'small': ['1rem', { lineHeight: '1.7' }],
        'meta': ['0.9rem', { lineHeight: '1.6', letterSpacing: '0.04em' }],
        'micro': ['0.8125rem', { lineHeight: '1.4', letterSpacing: '0.08em' }],
      },
      maxWidth: {
        'reading': '800px',
        'narrow': '680px',
        'wide': '1000px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '88': '22rem',
        '100': '25rem',
        '120': '30rem',
        'section': '8rem',
        'section-lg': '10rem',
      },
      zIndex: {
        '45': '45',
        '60': '60',
        '90': '90',
        '100': '100',
      },
      borderWidth: {
        '0.5': '0.5px',
      },
    },
  },
  plugins: [],
}
