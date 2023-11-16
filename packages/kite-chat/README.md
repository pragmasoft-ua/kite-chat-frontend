# 🪁 Kite chat

![Kite Chat](https://github.com/pragmasoft-ua/kite-chat-frontend/blob/main/kite-chat-light.png?raw=true)

![deploy](https://github.com/pragmasoft-ua/kite-chat-frontend/actions/workflows/deploy.yml/badge.svg)

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/@pragmasoft-ukraine/kite-chat)

This project includes 🪁K1te chat client to communicate with the [🪁K1te chat backend](https://github.com/pragmasoft-ua/kite-chat).

## Setup

Install dependencies:

```bash
npm i
```

## Build

This sample uses the TypeScript compiler to produce JavaScript that runs in modern browsers.
It uses [Vite](https://vitejs.dev/guide/) to bundle package. It bundles code with [Rollup](https://rollupjs.org/), pre-configured to output highly optimized static assets for production.

To build the JavaScript version of your driver:

```bash
npm run build
```

The TypeScript compiler is configured to be very strict. You may want to change `tsconfig.json` to make it less strict.

## Testing

This project uses
[@swc/jest](https://swc.rs/docs/usage/jest) for testing. See the
[jest documentation](https://jestjs.io/docs/getting-started) for
more information.

Tests can be run with the `test` script:

```bash
npm test
```

For local testing during development, the `test:watch` command will run your tests on every change to your source files:

```bash
npm test:watch
```

## Dev Server

This sample uses [Vite](https://vitejs.dev/guide/) as build tool. It`s dev server provides [rich feature enhancements](https://vitejs.dev/guide/features) over [native ES modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), for example extremely fast [Hot Module Replacement (HMR)](https://vitejs.dev/guide/features#hot-module-replacement).

To run the dev server and open the project in a new browser tab:

```bash
npm run start
```

There is a development HTML file located at `/index.html` that you can view at http://localhost:5173/index.html. Note that this command will serve your code using Lit's development mode (with more verbose errors).

## Linting

Linting of TypeScript files is provided by [ESLint](eslint.org) and [TypeScript ESLint](https://github.com/typescript-eslint/typescript-eslint). In addition, [lit-analyzer](https://www.npmjs.com/package/lit-analyzer) is used to type-check and lint lit-html templates with the same engine and rules as lit-plugin.

The rules are mostly the recommended rules from each project, but some have been turned off to make LitElement usage easier. The recommended rules are pretty strict, so you may want to relax them by editing `.eslintrc.json` and `tsconfig.json`.

To lint the project run:

```bash
npm run lint
```

## Formatting

[Prettier](https://prettier.io/) is used for code formatting. It has been pre-configured according to the Lit's style. You can change this in `.prettierrc.json`.

Prettier has not been configured to run when committing files, but this can be added with Husky and and `pretty-quick`. See the [prettier.io](https://prettier.io/) site for instructions.

## Debug workers

[Chrome chrome://inspect/#workers](chrome://inspect/#workers)

[Firefox about:debugging#/runtime/this-firefox](about:debugging#/runtime/this-firefox)

Driver uses inline module type shared worker for communication with the backend.

Production build bundles worker module and deps to iife so production library created with `npm run build` is compatible with all modern browsers.

## BroadcastChannel

https://bugzilla.mozilla.org/show_bug.cgi?id=1821171

Unfortunately it does not work in Firefox, only works in Chrome. Had to get rid of it.

## Script to include K1te chat client ESM module from the CDN

`<script type="module" src="https://unpkg.com/@pragmasoft-ukraine/kite-chat/dist/kite-chat.js"></script>`

## Publish

Package is published automatically by gh actions from main branch. To upgrade version run:

```bash
npm version patch
```

## More information

See [Backend Example](https://www.k1te.chat/en/guides/backend-example/) on the Kite Chat docs site for more information.
