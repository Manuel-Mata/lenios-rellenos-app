import { Request, Response } from 'express';
import productService from '../services/product.service';

export class ProductController {
  /**
   * GET /api/v1/productos
   * Retorna la lista de productos, opcionalmente filtrada por ?available=true
   */
  async getProducts(req: Request, res: Response): Promise<void> {
    try {
      const availableOnly = req.query.available === 'true';
      const products = await productService.getAllProducts(availableOnly);
      res.status(200).json(products);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      res.status(500).json({ error: 'Error interno al obtener los productos' });
    }
  }

  /**
   * GET /api/v1/productos/:id
   * Retorna el detalle completo de un producto por su ID
   */
  async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const parsedId = Number(id);

      // Validación de ID numérico entero positivo
      if (!Number.isInteger(parsedId) || parsedId <= 0) {
        res.status(400).json({
          error: 'El ID del producto debe ser un número entero válido',
        });
        return;
      }

      const product = await productService.getProductById(parsedId);

      if (!product) {
        res.status(404).json({
          error: 'Producto no encontrado',
        });
        return;
      }

      res.status(200).json(product);
    } catch (error) {
      console.error(`Error al obtener producto con id ${req.params.id}:`, error);
      res.status(500).json({ error: 'Error interno al obtener el producto' });
    }
  }
}

export const productController = new ProductController();
export default productController;
