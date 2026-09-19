import { z } from 'zod';

export const productCategoryEnum = z.enum([
  'fire-protection-system',
  'fire-detection-alarm-system',
  'fire-suppression-system',
  'fire-extinguisher',
  'ms-seamless-pipe',
]);

export const productSpecSchema = z.object({
  label: z.string().min(1, 'Label is required').max(60, 'Label too long'),
  value: z.string().min(1, 'Value is required').max(150, 'Value too long'),
});

export const productFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(120, 'Name must be under 120 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(120, 'Slug must be under 120 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: 'Slug must be lowercase alphanumeric with hyphens (e.g., rn-group-co2-extinguisher-5kg)',
    }),
  category: productCategoryEnum,
  description: z.string().max(2000, 'Description cannot exceed 2000 characters'),
  image: z.string(),
  order: z.coerce.number().min(0, 'Order must be non-negative').max(99999),
  graphicType: z.string().max(50),
  specs: z.array(productSpecSchema).max(20, 'Maximum of 20 specifications allowed'),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

export const loginFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean(),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export const userRoleEnum = z.enum(['super_admin', 'editor', 'support_staff']);

export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80),
  email: z.string().email('Please enter a valid email address'),
  role: userRoleEnum,
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  mfaEnabled: z.boolean(),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;

export const editUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80),
  role: userRoleEnum,
  mfaEnabled: z.boolean(),
});

export type EditUserFormValues = z.infer<typeof editUserSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export const profileUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80),
});

export type ProfileUpdateFormValues = z.infer<typeof profileUpdateSchema>;
