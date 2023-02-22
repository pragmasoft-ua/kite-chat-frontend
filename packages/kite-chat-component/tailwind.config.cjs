/* eslint-env node */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html'],
  theme: {
    extend: {
      colors: {
        'primary-color': 'var(--kite-primary-color, rgb(0 128 192))',
      },
    },
  },
  plugins: [],
};
