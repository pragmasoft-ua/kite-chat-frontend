import { z } from 'astro/zod';
import { i18nSchema as originali18nSchema } from '@astrojs/starlight/schema';

export function i18nSchema() {
	return originali18nSchema().merge(kitei18nSchema());
}

export function builtinI18nSchema() {
	return kitei18nSchema().required().strict();
}

export function kitei18nSchema() {
	return z
		.object({
			'kite.helloMsg': z
				.string()
				.describe('Text displayed in the first kite chat message.'),

			'kite.heading': z.string().describe('Text displayed in the chat heading.'),
		})
		.partial();
}