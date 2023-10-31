import { z } from 'astro/zod';
import { docsSchema as originalDocsSchema } from '@astrojs/starlight/schema';
import type { SchemaContext } from 'astro:content';

function imageSchema({ image }: SchemaContext) {
	return z.object({
		/** Alt text for screenreaders and other assistive technologies describing your hero image. */
		alt: z.string().default(''),
		/** Relative path to an light image file in your repo, e.g. `../../assets/hero-light.png`. */
		light: image().optional(),
		/** Relative path to an dark image file in your repo, e.g. `../../assets/hero-dark.png`. */
		dark: image().optional(),
	})
	.optional();
}

function bannerSchema() {
	return z.object({
		/** The content of the banner. Supports HTML syntax. */
		content: z.string(),
		/** Docs branch where the banner should be displayed. */
		branch: z.enum(['main', 'test', 'any']).default('any'),
	})
	.optional();
}

export function docsSchema() {
	return ({ image }: SchemaContext) =>
        originalDocsSchema()({ image }).merge(
			z.object({
				hero: originalDocsSchema()({ image }).shape.hero.unwrap().merge(
					z.object({image: imageSchema({ image })})
				).optional(),
				banner: bannerSchema(),
			})
		)
}