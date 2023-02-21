/* eslint-env node */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/kite-chat.ts', './src/kite-msg.ts', './src/kite-file.ts'],
  theme: {
    extend: {
      colors: {
        'primary-color': 'var(--kite-primary-color, theme(colors.blue.600))',
      },
    },
  },
  plugins: [],
};
