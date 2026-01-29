import { z } from 'zod';

// Project validation schemas
export const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, 'Project name is required')
    .max(100, 'Project name must be less than 100 characters')
    .trim(),
  canvasData: z.string().max(10 * 1024 * 1024, 'Canvas data too large (max 10MB)'),
  width: z.number().int().min(1).max(10000).optional().default(1920),
  height: z.number().int().min(1).max(10000).optional().default(1080),
  thumbnailUrl: z.string().url().optional().nullable(),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1).max(100).trim().optional(),
  canvasData: z.string().max(10 * 1024 * 1024).optional(),
  width: z.number().int().min(1).max(10000).optional(),
  height: z.number().int().min(1).max(10000).optional(),
  thumbnailUrl: z.string().url().optional().nullable(),
});

// AI generation validation schemas
export const generateImageSchema = z.object({
  prompt: z
    .string()
    .min(3, 'Prompt must be at least 3 characters')
    .max(2000, 'Prompt must be less than 2000 characters')
    .trim(),
  negativePrompt: z.string().max(1000, 'Negative prompt too long').optional(),
  model: z.enum(['flux-pro', 'flux-dev', 'sdxl', 'sd3']).optional().default('flux-dev'),
  width: z.number().int().min(256).max(2048).optional().default(1024),
  height: z.number().int().min(256).max(2048).optional().default(1024),
  numOutputs: z.number().int().min(1).max(4).optional().default(1),
  guidance: z.number().min(1).max(20).optional().default(7.5),
  steps: z.number().int().min(1).max(100).optional().default(28),
  seed: z.number().int().min(0).optional(),
  aspectRatio: z.string().optional(),
  stylePreset: z.string().optional(),
});

export const enhanceImageSchema = z.object({
  imageUrl: z.string().url('Invalid image URL'),
  operation: z.enum([
    'upscale',
    'background-remove',
    'face-restore',
    'style-transfer',
    'inpaint',
    'outpaint',
  ]),
  scale: z.number().int().min(2).max(4).optional(),
  stylePrompt: z.string().max(1000).optional(),
  maskData: z.string().optional(),
});

// User validation schemas
export const updateUserSchema = z.object({
  name: z.string().min(1).max(100).trim().optional(),
  email: z.string().email().optional(),
  avatarUrl: z.string().url().optional().nullable(),
  preferences: z.record(z.any()).optional(),
});

// Export validation schemas
export const exportImageSchema = z.object({
  format: z.enum(['png', 'jpeg', 'webp', 'svg', 'avif']),
  quality: z.number().int().min(1).max(100).optional().default(90),
  width: z.number().int().min(1).max(10000).optional(),
  height: z.number().int().min(1).max(10000).optional(),
  backgroundColor: z.string().optional(),
  includeMetadata: z.boolean().optional().default(true),
});

// Helper function to validate and return typed data
export function validateRequest<T>(
  schema: z.Schema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}
