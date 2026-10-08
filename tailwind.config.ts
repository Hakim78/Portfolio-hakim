import type { Config } from 'tailwindcss'

/**
 * Charte : noir profond, blanc chaud, une rampe d'opacités pour les gris.
 * Toutes les couleurs sont des variables CSS (voir globals.css) pour rester
 * cohérentes avec la scène WebGL et le module N.O.V.A.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        elev: 'var(--bg-elev)',
        fg: 'rgb(var(--fg-rgb) / <alpha-value>)',
        line: 'var(--line)',
        mint: '#6cffb8',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-inter-tight)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        label: ['0.6875rem', { lineHeight: '1', letterSpacing: '0.06em', fontWeight: '500' }],
      },
      maxWidth: {
        measure: '64ch',
      },
      transitionTimingFunction: {
        main: 'cubic-bezier(0.625, 0.05, 0, 1)',
      },
    },
  },
  plugins: [],
}

export default config
