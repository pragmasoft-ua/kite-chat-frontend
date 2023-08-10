import {defineConfig} from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  //  base: '/kite-chat-frontend/',
  build: {
    outDir: '../../docs',
    emptyOutDir: true,
  },
});
