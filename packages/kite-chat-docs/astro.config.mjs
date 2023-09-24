import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { loadEnv } from 'vite';

import tailwind from "@astrojs/tailwind";

const mode = process.env.NODE_ENV;
console.log(mode);

// https://main.vitejs.dev/config/#using-environment-variables-in-config
const { 
  APP_MODE, 
  WS_ENDPOINT,
} = loadEnv(mode, process.cwd(), '');

// https://astro.build/config
export default defineConfig({
  site: 'https://www.k1te.chat',
  base: mode == 'test' ? '/test' : '',
  outDir: mode == 'test' ? 'dist/test' : 'dist',
  integrations: [starlight({
    title: 'Kite Chat',
    favicon: '/kite.svg',
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
        label: 'Use Components',
        translations: {
          'uk-UA': "Використання компонентів",
        },
        link: '/guides/components/'
      }]
    }, {
      label: 'Reference',
      translations: {
        'uk-UA': 'Довідка',
      },
      autogenerate: {
        directory: 'reference'
      }
    }],
    defaultLocale: 'en',
    locales: {
      // English docs
      en: {
        label: 'English',
      },
      // Ukranian docs
      ua: {
        label: 'Українська',
        lang: 'uk-UA',
      },
    },
  }), tailwind({ applyBaseStyles: false })],

  //https://docs.astro.build/en/guides/integrations-guide/node/#syntaxerror-named-export-compile-not-found
  vite: {
    ssr: {
      noExternal: ['execa', 'is-stream', 'npm-run-path', /^unist-util/],
    },
    define: {
      __APP_MODE__: JSON.stringify(APP_MODE),
      __WS_ENDPOINT__: JSON.stringify(WS_ENDPOINT),
      __BASE_URL__: APP_MODE === "test" ? "/test" : "", 
    },
  },
});