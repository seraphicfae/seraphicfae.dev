import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).optional(),
    github: z.url().optional(),
    heroImage: image().optional(),
    heroImageCredit: z.string().optional(),
    heroImageCreditUrl: z.url().optional(),
  }),
});

export const collections = { projects };
