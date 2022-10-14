/* eslint-env node */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/humane-chat.ts', './src/humane-msg.ts'],
  theme: {
    extend: {
      colors: {
        'primary-color': 'var(--humane-primary-color, theme(colors.blue.600))',
      },
    },
  },
  plugins: [],
};
