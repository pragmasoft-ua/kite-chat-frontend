import {defineConfig} from 'vite';

export default defineConfig({
  worker: {
    format: 'es',
  },
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
    },
  },
});
