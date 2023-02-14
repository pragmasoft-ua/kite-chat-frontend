import {defineConfig, Plugin, ResolvedConfig} from 'vite';

const NAME = 'inline-shared-worker';

/**
 * Found and reported a bug in Vite related to inline shared worker
 * https://github.com/vitejs/vite/issues/11956
 *
 * This Vite plugin is a workaround until the bug above is fixed.
 */
function inlineSharedWorker(): Plugin {
  let config: ResolvedConfig;
  return {
    name: NAME,
    enforce: 'pre',

    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },

    async load(id) {
      if (id.indexOf(NAME) > 0) {
        const [input] = id.split('?', 1);
        const {format, plugins, rollupOptions} = config.worker;
        const {rollup} = await import('rollup');
        const bundle = await rollup({
          ...rollupOptions,
          input,
          plugins,
          preserveEntrySignatures: false,
        });
        try {
          const {
            output: [outputChunk],
          } = await bundle.generate({
            format,
          });
          return (
            'export default "data:application/javascript;base64,' +
            btoa(outputChunk.code) +
            '"'
          );
        } finally {
          await bundle.close();
        }
      }
      return;
    },
  };
}

export default defineConfig({
  plugins: [inlineSharedWorker()],
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
    },
  },
});
