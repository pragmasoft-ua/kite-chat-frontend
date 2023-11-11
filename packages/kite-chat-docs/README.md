# 🪁 Kite chat static documentation site

[Stable version](https://www.k1te.chat/)

[Test version](https://www.k1te.chat/test/)

This project includes **kite-chat** docs static site built with Astro Starlight template and Tailwind CSS.

Components are built using Astro with TypeScript.

## Setup

Install dependencies:

```bash
npm i
```

## Build

This project uses [starlight](https://starlight.astro.build/getting-started/) integration for
[Astro](https://docs.astro.build/en/getting-started/) to generate static docs website.

To generate the docs run:

```bash
npm run build
```

It builds docs in production enviroment by default. To build test version run:

```bash
npm run build:test
```

The docs is generated from /src/content/docs directory.

To preview generated site run:

```bash
npm run preview
```

## Dev Server

Astro comes with a built-in development server that has everything you need for project development.
The astro dev command will start the local development server so that you can see your website in action for the very first time.

To run the dev server and open the project in a new browser tab:

```bash
npm run dev
```

It runs docs in development enviroment by default. To run test version run:

```bash
npm run dev:test
```

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
