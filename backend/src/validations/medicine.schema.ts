import { z } from 'zod';

export const searchMedicinesQuerySchema = z.object({
  query: z.string().optional(),

  latitude: z
    .string()
    .optional()
    .refine(val => {
      if (!val) return true;
      const num = parseFloat(val);
      return !isNaN(num) && num >= -90 && num <= 90;
    }, { message: 'Latitude must be a number between -90 and 90' }),

  longitude: z
    .string()
    .optional()
    .refine(val => {
      if (!val) return true;
      const num = parseFloat(val);
      return !isNaN(num) && num >= -180 && num <= 180;
    }, { message: 'Longitude must be a number between -180 and 180' }),

  delivery: z
    .string()
    .optional()
    .refine(val => val === 'true' || val === 'false', { message: 'Delivery must be "true" or "false"' }),

  sort: z.enum(['price_asc', 'price_desc']).optional(),
});

export const medicineDetailsParamsSchema = z.object({
  id: z.string().length(24, 'Invalid medicine ID length').regex(/^[0-9a-fA-F]{24}$/, 'Invalid medicine ID format'),
});


export const medicineSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  strength: z.string().optional(),
  unit: z.string().optional(),
  type: z.enum(['Tablet', 'Syrup', 'Injection']),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  requiresPrescription: z
    .preprocess((val) => {
      if (typeof val === 'string') return val === 'true';
      return val;
    }, z.boolean().optional()),
  price: z.preprocess((val) => (typeof val === 'string' ? Number(val) : val), z.number().positive('Price must be positive')),
  quantity: z.preprocess((val) => (typeof val === 'string' ? Number(val) : val), z.number().int().nonnegative('Quantity cannot be negative')),
});
