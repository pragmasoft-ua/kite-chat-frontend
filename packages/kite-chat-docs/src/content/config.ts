import { defineCollection } from 'astro:content';
import { docsSchema } from '../schemas/docsSchema';
import { i18nSchema } from '../schemas/i18n';
import { customElementsSchema } from '../schemas/customElements';

export const collections = {
	docs: defineCollection({ schema: docsSchema() }),
	i18n: defineCollection({ type: 'data', schema: i18nSchema() }),
	customElements: defineCollection({ type: 'data', schema: customElementsSchema() }),
};
