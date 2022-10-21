import {defineConfig} from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/humane-chat-frontend/',
  build: {
    outDir: '../../docs',
    emptyOutDir: true,
  },
});
