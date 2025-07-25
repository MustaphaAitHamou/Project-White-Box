/* eslint-env node */
/** @type {import('tailwindcss').Config} */

import animate from 'tailwindcss-animate'

export default {
  darkMode: ['class'],                      // bascule avec .dark sur <html>
  content: ['./src/**/*.{js,jsx,ts,tsx}'],  // parcours de toutes les vues
  theme: {
    extend: {
      /* ----- Design tokens (HSL) ----- */
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        /*  tokens de bordures */
        border: 'hsl(var(--border))',
        ring  : 'hsl(var(--ring))',

        primary: {
          DEFAULT    : 'hsl(var(--primary))',
          foreground : 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT    : 'hsl(var(--secondary))',
          foreground : 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT    : 'hsl(var(--destructive))',
          foreground : 'hsl(var(--destructive-foreground))',
        },
      },

      /* coins arrondis génériques */
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [
    animate,                                // …et toutes tes autres lib plugins
  ],
}
