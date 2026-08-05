import { z } from 'zod';

export const updateStockSchema = z.object({
  stock: z
    .number({ message: 'El stock debe ser un número válido' })
    .int('El stock debe ser un número entero')
    .min(0, 'El stock no puede ser negativo'),
});

export const createProductSchema = z.object({
  name: z
    .string({ message: 'El nombre es obligatorio' })
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres'),
  description: z.string().trim().optional(),
  price: z
    .number({ message: 'El precio es obligatorio' })
    .positive('El precio debe ser mayor a 0'),
  image: z.string().trim().optional(),
  stock: z
    .number({ message: 'El stock debe ser un número válido' })
    .int('El stock debe ser un número entero')
    .min(0, 'El stock no puede ser negativo')
    .default(0),
  active: z.boolean().optional().default(true),
});

export const updateProductSchema = createProductSchema.partial();

export type UpdateStockInput = z.infer<typeof updateStockSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
