import { z } from 'astro/zod';

function attributeSchema() {
    return z.object({
        name: z.string(),
        type: z.string().optional(),
        description: z.string().optional(),
        default: z.string().optional(),
    });
}

function propertySchema() {
    return z.object({
        name: z.string(),
        description: z.string().optional(),
    });
}

export function customElementsSchema() {
    return  z.object({
        tags: z.array(z.object({
            name: z.string(),
            description: z.string().optional(),
            attributes: z.array(attributeSchema()).optional(),
            properties: z.array(attributeSchema()).optional(),
            cssProperties: z.array(propertySchema()).optional(),
            slots: z.array(propertySchema()).optional(),
            cssParts: z.array(propertySchema()).optional(),
            events: z.array(propertySchema()).optional(),
        })).optional(),
    });
}