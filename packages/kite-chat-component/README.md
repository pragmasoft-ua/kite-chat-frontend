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

To build the JavaScript version of your component:

```bash
npm run build
```

To watch files and rebuild when the files are modified, run the following command in a separate shell:

```bash
npm start
```

Both the TypeScript compiler and lit-analyzer are configured to be very strict. You may want to change `tsconfig.json` to make them less strict.

## Testing

This sample uses modern-web.dev's
[@web/test-runner](https://www.npmjs.com/package/@web/test-runner) for testing. See the
[modern-web.dev testing documentation](https://modern-web.dev/docs/test-runner/overview) for
more information.

Tests can be run with the `test` script, which will run your tests against Lit's development mode (with more verbose errors) as well as against Lit's production mode:

```bash
npm test
```

For local testing during development, the `test:dev:watch` command will run your tests in Lit's development mode (with verbose errors) on every change to your source files:

```bash
npm test:watch
```

Alternatively the `test:prod` and `test:prod:watch` commands will run your tests in Lit's production mode.

## Dev Server

This sample uses modern-web.dev's [@web/dev-server](https://www.npmjs.com/package/@web/dev-server) for previewing the project without additional build steps. Web Dev Server handles resolving Node-style "bare" import specifiers, which aren't supported in browsers. It also automatically transpiles JavaScript and adds polyfills to support older browsers. See [modern-web.dev's Web Dev Server documentation](https://modern-web.dev/docs/dev-server/overview/) for more information.

To run the dev server and open the project in a new browser tab:

```bash
npm run serve
```

There is a development HTML file located at `/dev/index.html` that you can view at http://localhost:8000/dev/index.html. Note that this command will serve your code using Lit's development mode (with more verbose errors). To serve your code against Lit's production mode, use `npm run serve:prod`.

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

## Static Site

This project includes a simple website generated with the [eleventy](11ty.dev) static site generator and the templates and pages in `/docs-src`. The site is generated to `/docs` and intended to be checked in so that GitHub pages can serve the site [from `/docs` on the master branch](https://help.github.com/en/github/working-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

To enable the site go to the GitHub settings and change the GitHub Pages &quot;Source&quot; setting to &quot;master branch /docs folder&quot;.</p>

## Script to include component from CDN

`<script type="module" src="https://unpkg.com/@pragmasoft-ukraine/kite-chat-component@2023.1.1/dist/index.mjs"></script>`

## Static Site with demo is located here

https://pragmasoft-ua.github.io/kite-chat-frontend/

To build the site, run:

```bash
npm run docs
```

To serve the site locally, run:

```bash
npm run docs:serve
```

To watch the site files, and re-build automatically, run:

```bash
npm run docs:watch
```

The site will usually be served at http://localhost:8000.

## Bundling and minification

This starter project doesn't include any build-time optimizations like bundling or minification. We recommend publishing components as unoptimized JavaScript modules, and performing build-time optimizations at the application level. This gives build tools the best chance to deduplicate code, remove dead code, and so on.

For information on building application projects that include LitElement components, see [Build for production](https://lit.dev/docs/tools/production/) on the Lit site.

## More information

See [Get started](https://lit.dev/docs/getting-started/) on the Lit site for more information.

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
