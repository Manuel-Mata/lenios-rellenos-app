import prisma from '../prisma';
import { CreateProductInput, UpdateProductInput } from '../validators/admin-product.validator';

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

  /**
   * Actualiza el stock de un producto
   */
  async updateStock(id: number, stock: number) {
    // Validar existencia previa
    const existing = await this.getProductById(id);
    if (!existing) {
      return null;
    }

    return prisma.product.update({
      where: { id },
      data: { stock },
    });
  }

  /**
   * Crea un nuevo producto (Admin)
   */
  async createProduct(data: CreateProductInput) {
    return prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        image: data.image,
        stock: data.stock,
        active: data.active,
      },
    });
  }

  /**
   * Actualiza un producto existente (Admin)
   */
  async updateProduct(id: number, data: UpdateProductInput) {
    const existing = await this.getProductById(id);
    if (!existing) {
      return null;
    }

    return prisma.product.update({
      where: { id },
      data,
    });
  }

  /**
   * Alterna el estado activo/inactivo de un producto (Admin)
   */
  async toggleStatus(id: number) {
    const existing = await this.getProductById(id);
    if (!existing) {
      return null;
    }

    return prisma.product.update({
      where: { id },
      data: { active: !existing.active },
    });
  }

  /**
   * Elimina un producto por su ID (Admin)
   */
  async deleteProduct(id: number) {
    const existing = await this.getProductById(id);
    if (!existing) {
      return null;
    }

    return prisma.product.delete({
      where: { id },
    });
  }
}

export const productService = new ProductService();
export default productService;
