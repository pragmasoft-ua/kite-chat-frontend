/* eslint-env node */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html'],
  theme: {
    extend: {
      colors: {
        'primary-color': 'var(--humane-primary-color, theme(colors.blue.600))',
      },
    },
  },
  plugins: [],
};
