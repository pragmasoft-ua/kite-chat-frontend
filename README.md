# 🪁 K1te chat frontend

![Kite Chat](https://github.com/pragmasoft-ua/kite-chat-frontend/blob/main/kite-chat-light.png?raw=true)

![deploy](https://github.com/pragmasoft-ua/kite-chat-frontend/actions/workflows/deploy.yml/badge.svg)

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/@pragmasoft-ukraine/kite-chat-component)

[Docs](https://www.k1te.chat/)

[Demo](https://www.k1te.chat/en/start/demo/)

This project includes **kite-chat** web component, which can be used independently with any 3rd party backend, 🪁 K1te chat client and protocol driver to communicate with the [existing backend](https://github.com/pragmasoft-ua/kite-chat), and documentation for both these modules as a static site (Astro).

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

To build only the component, run:

```bash
npm run build -w @pragmasoft-ukraine/kite-chat-component
```

[More info about component build](packages/kite-chat-component/README.md#build)

To build only the chat client, run:

```bash
npm run build -w @pragmasoft-ukraine/kite-chat
```

[More info about protocol driver build](packages/kite-chat/README.md#build)

To build only the documentation site, run:

```bash
npm run build -w @pragmasoft-ukraine/kite-chat-docs
```

[More info about docs build](packages/kite-chat-docs/README.md#build)

## Testing

Tests can be run with the `test` script, which will run test command in packages if it exist:

```bash
npm test
```

To test only the component, run:

```bash
npm run test -w @pragmasoft-ukraine/kite-chat-component
```

[More info about component testing](packages/kite-chat-component/README.md#test)

To test only the chat client, run:

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

To run the component dev server:

```bash
npm run start -w @pragmasoft-ukraine/kite-chat-component
```

[More info about component dev server](packages/kite-chat-component/README.md#dev-server)

To run the chat client dev server:

```bash
npm run start -w @pragmasoft-ukraine/kite-chat
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

See [Get started](https://www.k1te.chat/en/start/getting-started/) on the documentation site for more information on how to jumpstart using the chat.
