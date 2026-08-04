import prisma from '../prisma';

export class ProductService {
  /**
   * Obtiene la lista de productos con filtro opcional por disponibilidad
   */
  async getAllProducts(availableOnly: boolean = false) {
    const whereClause = availableOnly
      ? {
          active: true,
          stock: {
            gt: 0,
          },
        }
      : {};

    return prisma.product.findMany({
      where: whereClause,
      orderBy: {
        id: 'asc',
      },
    });
  }

  /**
   * Obtiene un producto por su ID
   */
  async getProductById(id: number) {
    return prisma.product.findUnique({
      where: { id },
    });
  }
}

export const productService = new ProductService();
export default productService;
