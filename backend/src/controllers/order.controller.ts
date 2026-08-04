import { Request, Response } from 'express';
import { createOrderSchema } from '../validators/order.validator';
import orderService from '../services/order.service';

export class OrderController {
  /**
   * POST /api/v1/pedidos
   * Crea un pedido validando datos, stock, calculando total y generando WhatsApp link
   */
  async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const parseResult = createOrderSchema.safeParse(req.body);

      if (!parseResult.success) {
        const issues = parseResult.error.issues || (parseResult.error as any).errors || [];
        const errorMessages = issues.map((e: any) => e.message).join(', ');
        res.status(400).json({
          error: `Datos de pedido inválidos: ${errorMessages}`,
          details: issues,
        });
        return;
      }

      const orderResult = await orderService.createOrder(parseResult.data);
      res.status(201).json(orderResult);
    } catch (error: any) {
      // Errores de validación de negocio (stock insuficiente, producto inactivo/inexistente)
      if (
        error.message?.includes('Stock insuficiente') ||
        error.message?.includes('no existe') ||
        error.message?.includes('no está disponible')
      ) {
        res.status(400).json({ error: error.message });
        return;
      }

      console.error('Error al crear pedido:', error);
      res.status(500).json({ error: 'Error interno al procesar el pedido' });
    }
  }
}

export const orderController = new OrderController();
export default orderController;
