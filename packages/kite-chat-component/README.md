# 🪁 Kite chat web component

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

This sample uses the TypeScript compiler to produce JavaScript that runs in modern browsers.
This sample uses [Vite](https://vitejs.dev/guide/) to bundle package. It bundles code with [Rollup](https://rollupjs.org/), pre-configured to output highly optimized static assets for production.

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

This sample uses [Vite](https://vitejs.dev/guide/) as build tool. It`s dev server provides [rich feature enhancements](https://vitejs.dev/guide/features) over [native ES modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), for example extremely fast [Hot Module Replacement (HMR)](https://vitejs.dev/guide/features#hot-module-replacement).

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

## Script to include component from CDN

`<script type="module" src="https://unpkg.com/@pragmasoft-ukraine/kite-chat-component/dist/kite-chat-component.mjs"></script>`

## More information

See [Get started](https://www.k1te.chat/en/start/getting-started/) on the Kite Chat docs site for more information.

## TODO

- ✅responsive dialog sizing/placement
- ✅scroll snap
- ✅dark/light theme
- ✅primary color for text selection
- ✅open/close animation
- ✅button handlers
- ✅focus on textarea when dialog is opened
- ✅keyboard shortcut for send
- ✅events
- ✅property converter for datetime property
- ✅shared worker
- ✅npm publishing, unpkg cdn
- BUG: content window does not scroll properly
- BUG: @base tailwind styles are not applicable in the context of wc (html, body)
- switch to monorepo with pnpm build
- storybook - use absolute instead of fixed positioning to facilitate storybook stories (may be not needed)
- file upload
- display images
- new N (unread) badge on toggle button, autoopen on incoming attr
- smarter datetime format or change display on click from time to date and back
- cache session in worker to survive page reloads
- keyboard shortcuts for buttons (close, attach file, edit, tab to focus)
- message selection, contextual edit/delete menu items (next to close button)
- clipboard api
- Web push
- BroadcastChannel
- buttons click animation
- display links and button menus (as pills)
- localization
- emoji keyboard https://emoji.julien-marcou.fr/
- custom variables for sizing, background pattern, ...?
- aria attributes for controls
- virtual scrolling
- remember input height
- sticky dates
- Conversation context (page url, ip, browser lang, time, timezone, location)
- github sponsorship
- automate npm publish with github actions
- playwright e2e tests
- use temporal polyfill for timestamp
- https://github.com/43081j/postcss-lit
