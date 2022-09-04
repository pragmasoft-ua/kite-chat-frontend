/* eslint-env node */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/*.{js,ts}'],
  theme: {
    extend: {
      colors: {
        'primary-color': 'var(--primary-color, theme(colors.blue.600))',
      },
    },
  },
  plugins: [],
};
