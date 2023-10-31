const colors = require('tailwindcss/colors');
const starlightPlugin = require('@astrojs/starlight-tailwind');

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			animation: {
				wave: 'wave 3s infinite',
			},
			keyframes: {
				wave: {
					'0%': { transform: 'rotate(0deg)' },
					'20%': { transform: 'rotate(-4deg)' },
					'50%': { transform: 'rotate(12deg)' },
					'100%': { transform: 'rotate(0deg)' }
				},
			},
			colors: {
				accent: colors.emerald,
				gray: colors.slate,

				"kite-primary-color": "var(--kite-primary-color)",
				"kite-secondary-color": "var(--kite-secondary-color)",
			},
		},
	},
	plugins: [starlightPlugin()],
}
