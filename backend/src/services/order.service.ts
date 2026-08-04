import prisma from '../prisma';
import { CreateOrderInput } from '../validators/order.validator';

const BUSINESS_WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || '5213751837635';

export interface OrderItemDetail {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export class OrderService {
  /**
   * Genera el mensaje formateado y la URL de WhatsApp
   */
  generateWhatsAppMessage(
    orderId: number,
    items: OrderItemDetail[],
    total: number,
    customerPhone: string,
    deliveryAddress: string,
    notes?: string
  ): { message: string; url: string } {
    let itemsText = items
      .map(
        (item) =>
          `• ${item.quantity}x *${item.productName}* ($${item.unitPrice.toFixed(2)} c/u) = $${item.subtotal.toFixed(2)}`
      )
      .join('\n');

    let message = `🪵 *Nuevo Pedido - Leños Rellenos* 🪵\n`;
    message += `*Pedido #${orderId}*\n\n`;
    message += `📋 *Detalle del Pedido:*\n${itemsText}\n\n`;
    message += `💰 *Total a pagar:* $${total.toFixed(2)}\n\n`;
    message += `📍 *Dirección de entrega:* ${deliveryAddress}\n`;
    message += `📱 *Teléfono de contacto:* ${customerPhone}\n`;

    if (notes && notes.trim().length > 0) {
      message += `📝 *Notas adicionales:* ${notes.trim()}\n`;
    }

    message += `\n¡Gracias por tu pedido! Estaremos preparándolo en breve. 🪵✨`;

    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${encodedMessage}`;

    return { message, url };
  }

  /**
   * Crea un nuevo pedido con validación de stock, cálculo de total y transacción atómica
   */
  async createOrder(data: CreateOrderInput) {
    const { items, customerPhone, deliveryAddress, notes } = data;

    // 1. Obtener productos de la base de datos
    const productIds = items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    // 2. Validar existencia, estado activo y stock
    const itemDetails: OrderItemDetail[] = [];
    let calculatedTotal = 0;

    for (const item of items) {
      const product = productMap.get(item.productId);

      if (!product) {
        throw new Error(`El producto con ID ${item.productId} no existe`);
      }

      if (!product.active) {
        throw new Error(`El producto "${product.name}" no está disponible actualmente`);
      }

      if (product.stock < item.quantity) {
        throw new Error(
          `Stock insuficiente para "${product.name}". Disponible: ${product.stock}, Solicitado: ${item.quantity}`
        );
      }

      const subtotal = product.price * item.quantity;
      calculatedTotal += subtotal;

      itemDetails.push({
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: product.price,
        subtotal,
      });
    }

    // 3. Ejecutar transacción atómica en Prisma: descontar stock y crear pedido con items
    const createdOrder = await prisma.$transaction(async (tx) => {
      // Descontar inventario de cada producto
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Crear la orden con sus OrderItems
      return tx.order.create({
        data: {
          customerPhone,
          deliveryAddress,
          notes: notes ? notes.trim() : null,
          total: calculatedTotal,
          status: 'pendiente',
          items: {
            create: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: productMap.get(item.productId)!.price,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    });

    // 4. Generar mensaje y URL de WhatsApp
    const { message: whatsappMessage, url: whatsappUrl } = this.generateWhatsAppMessage(
      createdOrder.id,
      itemDetails,
      calculatedTotal,
      customerPhone,
      deliveryAddress,
      notes
    );

    return {
      order: createdOrder,
      whatsappMessage,
      whatsappUrl,
    };
  }
}

export const orderService = new OrderService();
export default orderService;
