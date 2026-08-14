/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // Core palette — warm dark room, not cold digital
        notebook: {
          bg: '#0A0908',
          surface: '#100F0D',
          'surface-alt': '#151412',
          border: '#28251F',
          'border-light': '#36342F',
        },
        ink: {
          primary: '#F5F2ED',
          secondary: '#D4CFC8',
          muted: '#9C9A96',
          faint: '#6B6966',
        },
        blueprint: {
          DEFAULT: '#6366F1',
          light: '#818CF8',
          dim: '#4F46E5',
          faint: 'rgba(99, 102, 241, 0.08)',
        },
        amber: {
          DEFAULT: '#F5A623',
          light: '#FBBF24',
          dim: '#D97706',
          faint: 'rgba(245, 166, 35, 0.08)',
        },
        accent: {
          purple: '#A855F7',
          cyan: '#22D3EE',
          green: '#34D399',
        },
      },
      fontFamily: {
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'display': ['4rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'headline': ['2.5rem', { lineHeight: '1.1', letterSpacing: '-0.015em' }],
        'title': ['2rem', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
        'body': ['1.25rem', { lineHeight: '1.9' }],
        'body-sm': ['1.125rem', { lineHeight: '1.9' }],
        'meta': ['0.9rem', { lineHeight: '1.6', letterSpacing: '0.04em' }],
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
      animation: {
        'reveal': 'reveal 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'slide-up': 'slideUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'slide-in': 'slideIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'fade-in': 'fadeIn 0.7s ease-out forwards',
        'typewriter-cursor': 'blink 1s step-end infinite',
        'mechanical-slide': 'mechanicalSlide 0.6s cubic-bezier(0.33, 1, 0.68, 1) forwards',
        'document-in': 'documentIn 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'stamp': 'stamp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'breathe': 'breathe 8s ease-in-out infinite',
        'grain-drift': 'grainDrift 0.5s steps(4) infinite',
      },
      keyframes: {
        reveal: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-8px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        mechanicalSlide: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        documentIn: {
          '0%': { opacity: '0', transform: 'translateY(8px) scale(0.99)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        stamp: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        breathe: {
          '0%, 100%': { opacity: '0.015' },
          '50%': { opacity: '0.03' },
        },
        grainDrift: {
          '0%': { backgroundPosition: '0% 0%' },
          '25%': { backgroundPosition: '50% 50%' },
          '50%': { backgroundPosition: '100% 0%' },
          '75%': { backgroundPosition: '50% 100%' },
          '100%': { backgroundPosition: '0% 0%' },
        },
      },
      backdropBlur: {
        xs: '2px',
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
      transitionTimingFunction: {
        'mechanical': 'cubic-bezier(0.33, 1, 0.68, 1)',
        'document': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      boxShadow: {
        'paper': '0 1px 3px rgba(0, 0, 0, 0.3), 0 0 0 0.5px rgba(255, 255, 255, 0.05)',
        'paper-hover': '0 4px 12px rgba(0, 0, 0, 0.4), 0 0 0 0.5px rgba(255, 255, 255, 0.08)',
        'annotation': '0 0 0 1px rgba(245, 166, 35, 0.2)',
        'blueprint-glow': '0 0 20px rgba(99, 102, 241, 0.15)',
      },
    },
  },
  plugins: [],
}
