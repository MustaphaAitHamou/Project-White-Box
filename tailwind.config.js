/* eslint-env node */
 
const animate = require('tailwindcss-animate'); // ✅ en CJS pour éviter d'autres soucis

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],                      // bascule avec .dark sur <html>
  content: ['./src/**/*.{js,jsx,ts,tsx}'],  // parcours de toutes les vues
  theme: {
    extend: {
      /* ----- Design tokens (HSL) ----- */
      colors: {
        background : 'hsl(var(--background))',
        foreground : 'hsl(var(--foreground))',
        /*  tokens de bordures */
        border : 'hsl(var(--border))',
        ring   : 'hsl(var(--ring))',

        primary: {
          DEFAULT     : 'hsl(var(--primary))',
          foreground  : 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT     : 'hsl(var(--secondary))',
          foreground  : 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT     : 'hsl(var(--destructive))',
          foreground  : 'hsl(var(--destructive-foreground))',
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
    animate, // …et toutes tes autres lib plugins
  ],
};
