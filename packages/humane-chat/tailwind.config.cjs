/* eslint-env node */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    '../humane-chat-component/src/humane-chat.ts',
    '../humane-chat-component/src/humane-msg.ts',
  ],
  theme: {
    extend: {
      colors: {
        'primary-color': 'var(--humane-primary-color, theme(colors.blue.600))',
      },
    },
  },
  plugins: [],
};
