# 🪁 Kite chat

[Demo](https://www.k1te.chat/)

This project includes **kite-chat** web component
and a protocol driver to communicate with the chat backend.

Web component is built using LitElement with TypeScript and Tailwind CSS.

Project is generated from the `lit-starter-ts` template in [the main Lit
repo](https://github.com/lit/lit). Issues and PRs for this template should be
filed in that repo.

## Setup

Install dependencies:

```bash
npm i
```

This project uses npm [workspaces](https://docs.npmjs.com/cli/using-npm/workspaces) and typescript [project references](https://www.typescriptlang.org/docs/handbook/project-references.html).

You need to run `npm run compile` before you start working on the project in your IDE to prebuild type definitions for incremental builds, otherwise you may experience typescript module resolution errors.

## Build

This sample uses the TypeScript compiler to produce JavaScript that runs in modern browsers.

To build the JavaScript version of your component:

```bash
npm run build
```

You very likely may need to edit wss endpoint in the `kite-chat-demo/.env` file after running `ngrok http 80` as explained in the backend project `kite-chat`

To watch files and rebuild when the files are modified, run the following command in a separate shell:

```bash
npm start
```

## Testing (ignore)

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

## Dev Server (ignore)

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

## Static Site (ignore)

This project includes a simple website generated with the [eleventy](11ty.dev) static site generator and the templates and pages in `/docs-src`. The site is generated to `/docs` and intended to be checked in so that GitHub pages can serve the site [from `/docs` on the master branch](https://help.github.com/en/github/working-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

To enable the site go to the GitHub settings and change the GitHub Pages &quot;Source&quot; setting to &quot;master branch /docs folder&quot;.</p>

## Script to include component from CDN

`<script type="module" src="https://unpkg.com/@pragmasoft-ukraine/kite-chat@2023.2.1/dist/kite-chat.js"></script>`

## Static Site with demo is located here

https://www.k1te.chat/

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

## Bundling and minification (ignore)

This starter project doesn't include any build-time optimizations like bundling or minification. We recommend publishing components as unoptimized JavaScript modules, and performing build-time optimizations at the application level. This gives build tools the best chance to deduplicate code, remove dead code, and so on.

For information on building application projects that include LitElement components, see [Build for production](https://lit.dev/docs/tools/production/) on the Lit site.

## More information

See [Get started](https://lit.dev/docs/getting-started/) on the Lit site for more information.

## Debug workers

[Chrome chrome://inspect/#workers](chrome://inspect/#workers)

[Firefox about:debugging#/runtime/this-firefox](about:debugging#/runtime/this-firefox)

Chat library uses inline module type shared worker for communication with the backend.

Production build bundles worker module and deps to iife so production library created with `npm run build` is compatible with all modern browsers.

## Storybook

Tried storybook builder vite. Version 6.x depends on webpack4 manager, which has problems with outdated crypto on
node >16, whereas new storybook version as of 7.0.0-alpha.40 does not support web components.

So far, the only working version is based on webpack5

## BroadcastChannel

https://bugzilla.mozilla.org/show_bug.cgi?id=1821171

Unfortunately it does not work in Firefox, only works in Chrome. Have to get rid of it.

## TODO

- ✅responsive dialog sizing/placement
- ✅scroll snap
- ✅dark/light theme
- ✅primary color for text selection, links, status indicators
- ✅open/close animation
- ✅focus on textarea when dialog is opened
- ✅keyboard shortcut for send
- ✅events
- ✅property converter for datetime property
- ✅shared worker
- ✅npm publishing, unpkg cdn
- ✅switch to monorepo with pnpm build (came back to npm because storybook seems has problems with pnpm links)
- ✅storybook
- ✅cache session in worker to survive page reloads
- ✅BroadcastChannel
- ✅display images
- ✅client side PING
- ✅we need to store connection parameter then parse and send it in join request
- [in progress...] file upload
- send feature flags from server in OK response ?
- as worker esm modules are now supported in firefox, convert iife worker to module
- random animal emoji instead of unknown user name (or used id?). Request user name in chat if not provided (optional?).
- study top layer (possibly relevant) https://developer.chrome.com/blog/what-is-the-top-layer/
- study css anchors https://developer.chrome.com/blog/tether-elements-to-each-other-with-css-anchor-positioning/
- mobile page for demo site. VirtualKeyboard API
- tooltips 'Download file name' on images and files.
- survive page reloads of the only open tab (indexedDb ?)
- rich text message type: entities (urls, @-mentions...), markdown? As a separate plugin? Or better format on the server and send html
- display links and button menus (as pills)
- display error messages
- documentation (Readme, jsdoc)
- localization
- new N (unread) badge on toggle button, autoopen on incoming attr
- smarter datetime format or change display on click from time to date and back https://github.com/pragmasoft-ua/fmt-timestamp
- or alternatively use sticky dates (like in Telegram)
- keyboard shortcuts for buttons (close, attach file, edit, tab to focus)
- message selection, contextual edit/delete menu items (next to close button)
- clipboard api, drag and drop? web share api
- video chats
- webauthn e2e encryption
- Web push
- buttons click animation
- emoji keyboard https://emoji.julien-marcou.fr/
- custom variables for sizing, background pattern, ...?
- aria attributes for controls
- virtual scrolling
- Conversation context (page url, ip, browser lang, time, timezone, location)
- telegram login (other social logins like google/facebook?)
- automate npm publish with github actions
- playwright e2e tests
- use temporal polyfill for timestamp
- document use of https://www.npmjs.com/package/@webcomponents/webcomponentsjs as a polyfill (and test) or remove dependency
- https://www.npmjs.com/package/standard (also exists for ts)
- remember input height
- ❌ consider dockerz html template (use Starlight instead)
- ❌ github sponsorship (not supported in Ukraine)
