# 🪁 Kite chat web component

![Kite Chat](../../kite-chat-light.png)

![deploy](https://github.com/pragmasoft-ua/kite-chat-frontend/actions/workflows/deploy.yml/badge.svg)

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/@pragmasoft-ukraine/kite-chat-component)

This project includes **kite-chat** web component,
which can be used independently of the kite-chat backend with any other backend
and networking protocol.

Web component is built using LitElement with TypeScript and Tailwind CSS.

## Setup

Install dependencies:

```bash
npm i
```

## Build

Chat component uses the TypeScript compiler to produce JavaScript that runs in modern browsers.

Chat component uses [Vite](https://vitejs.dev/guide/) to bundle package. It bundles code with [Rollup](https://rollupjs.org/), pre-configured to output highly optimized static assets for production.

To build the JavaScript version of your component:

```bash
npm run build
```

Both the TypeScript compiler and lit-analyzer are configured to be very strict. You may want to change `tsconfig.json` to make them less strict.

## Testing

This project uses modern-web.dev's
[@web/test-runner](https://www.npmjs.com/package/@web/test-runner) for testing. See the
[modern-web.dev testing documentation](https://modern-web.dev/docs/test-runner/overview) for
more information.

Tests can be run with the `test` script, which will run your tests against Lit's development mode (with more verbose errors) as well as against Lit's production mode:

```bash
npm test
```

For local testing during development, the `test:watch` command will run your tests in Lit's development mode (with verbose errors) on every change to your source files:

```bash
npm test:watch
```

## Dev Server

Chat component uses [Vite](https://vitejs.dev/guide/) as a build tool. It`s dev server provides [rich feature enhancements](https://vitejs.dev/guide/features) over [native ES modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), for example extremely fast [Hot Module Replacement (HMR)](https://vitejs.dev/guide/features#hot-module-replacement).

To run the dev server and open the project in a new browser tab:

```bash
npm run start
```

There is a development HTML file located at `/index.html` that you can view at http://localhost:5173/index.html. Note that this command will serve your code using Lit's development mode (with more verbose errors).

## Editing

If you use VS Code, we highly recommend the [lit-plugin extension](https://marketplace.visualstudio.com/items?itemName=runem.lit-plugin), which enables some extremely useful features for lit-html templates:

- Syntax highlighting
- Type-checking
- Code completion
- Hover-over docs
- Jump to definition
- Linting
- Quick Fixes

The project is setup to recommend lit-plugin to VS Code users if they don't already have it installed.

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

## Publish

Package is published automatically by gh actions from main branch. To upgrade version run:

```bash
npm version patch
```

## Script to include component from CDN

`<script type="module" src="https://unpkg.com/@pragmasoft-ukraine/kite-chat-component/dist/kite-chat-component.mjs"></script>`

## More information

See [Get started](https://www.k1te.chat/en/start/getting-started/) on the Kite Chat docs site for more information.
