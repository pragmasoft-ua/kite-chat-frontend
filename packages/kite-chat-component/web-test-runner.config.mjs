/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {legacyPlugin} from '@web/dev-server-legacy';
import {playwrightLauncher} from '@web/test-runner-playwright';
import {esbuildPlugin} from '@web/dev-server-esbuild';

// https://modern-web.dev/docs/test-runner/cli-and-configuration/
export default {
  rootDir: '.',
  files: ['./test/**/*_test.ts'],
  nodeResolve: true,
  testFramework: {
    // https://mochajs.org/api/mocha
    config: {
      ui: 'bdd',
      timeout: '80000',
    },
  },
  browsers: [
    playwrightLauncher({product: 'chromium'}),
    playwrightLauncher({product: 'firefox'}),
    playwrightLauncher({product: 'webkit'}),
  ],
  plugins: [
    esbuildPlugin({ ts: true }),
    // Detect browsers without modules (e.g. IE11) and transform to SystemJS
    // (https://modern-web.dev/docs/dev-server/plugins/legacy/).
    legacyPlugin({
      polyfills: {
        webcomponents: true,
        // Inject lit's polyfill-support module into test files, which is required
        // for interfacing with the webcomponents polyfills
        custom: [
          {
            name: 'lit-polyfill-support',
            path: 'node_modules/lit/polyfill-support.js',
            test: "!('attachShadow' in Element.prototype) || !('getRootNode' in Element.prototype) || window.ShadyDOM && window.ShadyDOM.force",
            module: false,
          },
        ],
      },
    }),
  ],
};
