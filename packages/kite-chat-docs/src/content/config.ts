import { defineCollection } from 'astro:content';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';
import { z } from 'astro/zod';
import type { SchemaContext } from 'astro:content';

function imageSchema({ image }: SchemaContext) {
	return z.object({
		/** Alt text for screenreaders and other assistive technologies describing your hero image. */
		alt: z.string().default(''),
		/** Relative path to an light image file in your repo, e.g. `../../assets/hero-light.png`. */
		light: image().optional(),
		/** Relative path to an dark image file in your repo, e.g. `../../assets/hero-dark.png`. */
		dark: image().optional(),
		/** Raw HTML string instead of an image file. Useful for inline SVGs or more complex hero content. */
		html: z.string().optional(),
	})
	.optional();
}

// Get a copy of the original docsSchema
function modifiedDocsSchema() {
	return ({ image }: SchemaContext) =>
		docsSchema()({ image }).merge(
			z.object({
				hero: docsSchema()({ image }).shape.hero.unwrap().merge(
					z.object({image: imageSchema({ image })})
				).optional()
			})
		)
}

export const collections = {
	docs: defineCollection({ schema: modifiedDocsSchema() }),
	i18n: defineCollection({ type: 'data', schema: i18nSchema() }),
};
