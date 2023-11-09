# 🪁 Kite chat frontend

[Docs](https://www.k1te.chat/)

[Demo](https://www.k1te.chat/en/start/demo/)

This project includes **kite-chat** web component,
a protocol driver to communicate with the chat backend
and docs static site.

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

To build the packages and docs run:

```bash
npm run build
```

To build only component run:

```bash
npm run build -w @pragmasoft-ukraine/kite-chat-component
```

[More info about component build](packages/kite-chat-component/README.md#build)

To build component driver run:

```bash
npm run build -w @pragmasoft-ukraine/kite-chat
```

[More info about driver build](packages/kite-chat/README.md#build)

To build docs run:

```bash
npm run build -w @pragmasoft-ukraine/kite-chat-docs
```

[More info about docs build](packages/kite-chat-docs/README.md#build)

## Testing

Tests can be run with the `test` script, which will run test command in packages if it exist:

```bash
npm test
```

To test only component run:

```bash
npm run test -w @pragmasoft-ukraine/kite-chat-component
```

[More info about component testing](packages/kite-chat-component/README.md#test)

To build component driver run:

```bash
npm run test -w @pragmasoft-ukraine/kite-chat
```

[More info about driver testing](packages/kite-chat/README.md#test)

## Dev Server

The default start command will run docs locally:

```bash
npm run start
```

[More info about docs dev server](packages/kite-chat-docs/README.md#dev-server)

To run component dev server:

```bash
npm run test -w @pragmasoft-ukraine/kite-chat-component
```

[More info about component dev server](packages/kite-chat-component/README.md#dev-server)

To run component driver dev server:

```bash
npm run test -w @pragmasoft-ukraine/kite-chat
```

[More info about driver dev server](packages/kite-chat/README.md#dev-server)

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

## CI/CD Workflow

This project utilizes GitHub Actions for Continuous Integration and Deployment. The workflow includes linting, testing, documentation builds, and npm package publishing.

### Setup gh actions

1. **GitHub Actions Secrets:**
   - Create `NPM_TOKEN` secret with your npm token.
   - Ensure `GITHUB_TOKEN` secret is available for deployment.

2. **Triggers:**
   - Workflow triggers on `main` and `test` branch pushes.
   - Manual triggering is available in the Actions tab.

3. **Dependencies:**
   - Node.js v18 is used. Ensure compatible dependencies.

4. **Artifact Uploads:**
   - Documentation and package builds artifacts are uploaded.

5. **Deployment:**
   - Documentation auto-deploys to GitHub Pages.
   - npm packages auto-publish with version checks.

## More information

See [Get started](https://www.k1te.chat/en/start/getting-started/) on the Lit site for more information.

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
