import { z } from 'zod';

export const orderItemSchema = z.object({
  productId: z
    .number({ message: 'El productId debe ser un número válido' })
    .int('El productId debe ser un número entero')
    .positive('El productId debe ser mayor a 0'),
  quantity: z
    .number({ message: 'La cantidad debe ser un número válido' })
    .int('La cantidad debe ser un número entero')
    .positive('La cantidad debe ser mayor a 0'),
});

export const createOrderSchema = z.object({
  items: z
    .array(orderItemSchema, { message: 'La lista de items es obligatoria' })
    .min(1, 'El pedido debe contener al menos un producto'),
  customerPhone: z
    .string({ message: 'El teléfono del cliente es obligatorio' })
    .trim()
    .regex(/^\d{10}$/, 'El número de teléfono debe contener exactamente 10 dígitos numéricos'),
  deliveryAddress: z
    .string({ message: 'La dirección de entrega es obligatoria' })
    .trim()
    .min(5, 'La dirección de entrega debe tener al menos 5 caracteres'),
  notes: z.string().trim().optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type OrderItemInput = z.infer<typeof orderItemSchema>;
