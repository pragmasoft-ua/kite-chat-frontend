import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import lit from '@astrojs/lit';
import { loadEnv } from 'vite';
import replace from '@rollup/plugin-replace';

import tailwind from "@astrojs/tailwind";

const mode = process.env.NODE_ENV;
console.log(mode);

const base = mode == 'test' ? '/test' : '';

// https://main.vitejs.dev/config/#using-environment-variables-in-config
const {
  WS_ENDPOINT,
} = loadEnv(mode, process.cwd(), '');

// https://astro.build/config
export default defineConfig({
  site: 'https://www.k1te.chat',
  base: base,
  outDir: mode == 'test' ? 'dist/test' : 'dist',
  integrations: [lit(), starlight({
    title: 'Kite Chat',
    favicon: `/images/kite.svg`,
    head: [
      // Add ICO favicon fallback for Safari.
      {
        tag: 'link',
        attrs: {
          rel: 'icon',
          href: `${base}/images/kite.ico`,
          sizes: '32x32',
        },
      },
    ],
    logo: {
      src: './src/assets/kite.svg',
    },
    customCss: [
      // Path to your Tailwind base styles:
      './src/tailwind.css',
    ],
    social: {
      github: 'https://github.com/pragmasoft-ua/kite-chat-frontend'
    },
    sidebar: [ {
      label: 'Start Here',
      translations: {
        'uk-UA': 'Почніть тут',
      },
      items: [
      // Each item here is one entry in the navigation menu.
      {
        label: 'Getting Started',
        translations: {
          'uk-UA': 'Початок роботи',
        },
        link: '/start/getting-started/'
      },
      {
        label: 'Chat Demo',
        translations: {
          'uk-UA': 'Приклад використання',
        },
        link: '/start/demo/'
      }]
    }, {
      label: 'Guides',
      translations: {
        'uk-UA': 'Посібники',
      },
      items: [
      // Each item here is one entry in the navigation menu.
      {
        label: 'Backend Example',
        translations: {
          'uk-UA': "Приклад бекенду",
        },
        link: '/guides/backend-example/'
      }, {
        label: 'Telegram bot',
        link: '/guides/telegram-bot/'
      }, {
        label: 'Troubleshooting',
        link: '/guides/troubleshooting/'
      }
    ]
    }, {
      label: 'Reference',
      translations: {
        'uk-UA': 'Довідка',
      },
      autogenerate: {
        directory: 'reference'
      }
    }],
    defaultLocale: 'root', // optional
    locales: {
      // English docs
      root: {
        label: 'English',
        lang: 'en', // lang is required for root locales
      },
      // Ukranian docs
      ua: {
        label: 'Українська',
        lang: 'uk-UA',
      },
    },
    components: {
      Hero: './src/components/overrided/Hero.astro',
      ThemeProvider: './src/components/overrided/ThemeProvider.astro',
      Banner: './src/components/overrided/Banner.astro',
      PageFrame: './src/components/overrided/PageFrame.astro',
    },
  }), tailwind({ applyBaseStyles: false })],

  //https://docs.astro.build/en/guides/integrations-guide/node/#syntaxerror-named-export-compile-not-found
  vite: {
    ssr: {
      noExternal: ['execa', 'is-stream', 'npm-run-path', /^unist-util/],
    },
    define: {
      __BRANCH__: JSON.stringify(mode === "test" ? "test" : "main"),
      //override vite MODE variables
      'import.meta.env.DEV': mode === "development",
      'import.meta.env.PROD': mode !== "development",
      'import.meta.env.MODE': JSON.stringify(mode),
    },
    plugins: [
      replace({
        __BASE_URL__: base,
        __WS_ENDPOINT__: WS_ENDPOINT,
        __BACKEND_PACKAGE_IMPORT__: mode === "test" 
          ? `${base}/kite-chat.js` 
          : "https://unpkg.com/@pragmasoft-ukraine/kite-chat/dist/kite-chat.js"
      })
    ]
  },
});