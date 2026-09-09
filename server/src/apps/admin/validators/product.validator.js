import { z } from 'zod';

const CATEGORY_SLUGS = [
  'fire-protection-system',
  'fire-detection-alarm-system',
  'fire-suppression-system',
  'fire-extinguisher',
  'ms-seamless-pipe',
];

const specificationSchema = z.object({
  label: z.string().min(1, 'Specification label is required').max(100),
  value: z.string().min(1, 'Specification value is required').max(500),
});

export const createProductSchema = z.object({
  name: z
    .string()
    .min(1, 'Product name is required')
    .max(200)
    .trim(),
  slug: z
    .string()
    .min(1, 'Product slug is required')
    .max(200)
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens'),
  category: z.enum(CATEGORY_SLUGS, {
    errorMap: () => ({ message: `Category must be one of: ${CATEGORY_SLUGS.join(', ')}` }),
  }),
  image: z.string().url('Image must be a valid URL').optional().or(z.literal('')),
  order: z.number().int().min(0).optional().default(0),
  graphicType: z.string().max(100).optional(),
  specs: z.array(specificationSchema).max(20).optional(),
  description: z.string().max(2000).optional(),
});

export const updateProductSchema = z.object({
  name: z.string().min(1).max(200).trim().optional(),
  slug: z
    .string()
    .min(1)
    .max(200)
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens')
    .optional(),
  category: z.enum(CATEGORY_SLUGS).optional(),
  image: z.string().url().optional().or(z.literal('')),
  order: z.number().int().min(0).optional(),
  graphicType: z.string().max(100).optional(),
  specs: z.array(specificationSchema).max(20).optional(),
  description: z.string().max(2000).optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field must be provided for update' }
);

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().max(100).optional(),
  category: z
    .enum(['all', ...CATEGORY_SLUGS])
    .optional()
    .default('all'),
  sortBy: z.enum(['name', 'order', 'createdAt', 'updatedAt']).default('order'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});