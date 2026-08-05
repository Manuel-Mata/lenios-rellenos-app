import { Request, Response } from 'express';
import {
  updateStockSchema,
  createProductSchema,
  updateProductSchema,
} from '../validators/admin-product.validator';
import productService from '../services/product.service';

export class AdminProductController {
  /**
   * PUT /api/v1/admin/productos/:id/stock
   * Actualiza el stock de un producto
   */
  async updateStock(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const parsedId = Number(id);

      if (isNaN(parsedId) || !Number.isInteger(parsedId) || parsedId <= 0) {
        res.status(400).json({ error: 'El ID del producto debe ser un número entero positivo' });
        return;
      }

      const parseResult = updateStockSchema.safeParse(req.body);
      if (!parseResult.success) {
        const issues = parseResult.error.issues || (parseResult.error as any).errors || [];
        const errorMessages = issues.map((e: any) => e.message).join(', ');
        res.status(400).json({
          error: `Datos de stock inválidos: ${errorMessages}`,
          details: issues,
        });
        return;
      }

      const updatedProduct = await productService.updateStock(parsedId, parseResult.data.stock);

      if (!updatedProduct) {
        res.status(404).json({ error: `Producto con ID ${parsedId} no encontrado` });
        return;
      }

      res.status(200).json(updatedProduct);
    } catch (error) {
      console.error('Error al actualizar stock:', error);
      res.status(500).json({ error: 'Error interno al actualizar el stock del producto' });
    }
  }

  /**
   * GET /api/v1/admin/productos
   * Obtiene todos los productos (incluyendo inactivos y sin stock)
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const products = await productService.getAllProducts(false);
      res.status(200).json(products);
    } catch (error) {
      console.error('Error al obtener productos admin:', error);
      res.status(500).json({ error: 'Error interno al obtener los productos' });
    }
  }

  /**
   * POST /api/v1/admin/productos
   * Crea un nuevo producto
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const parseResult = createProductSchema.safeParse(req.body);
      if (!parseResult.success) {
        const issues = parseResult.error.issues || (parseResult.error as any).errors || [];
        res.status(400).json({
          error: `Datos de producto inválidos: ${issues.map((e: any) => e.message).join(', ')}`,
          details: issues,
        });
        return;
      }

      const newProduct = await productService.createProduct(parseResult.data);
      res.status(201).json(newProduct);
    } catch (error: any) {
      if (error.code === 'P2002') {
        res.status(400).json({ error: 'Ya existe un producto con ese nombre' });
        return;
      }
      console.error('Error al crear producto:', error);
      res.status(500).json({ error: 'Error interno al crear el producto' });
    }
  }

  /**
   * PUT /api/v1/admin/productos/:id
   * Actualiza un producto existente
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const parsedId = Number(id);

      if (isNaN(parsedId) || !Number.isInteger(parsedId) || parsedId <= 0) {
        res.status(400).json({ error: 'El ID del producto debe ser un número entero positivo' });
        return;
      }

      const parseResult = updateProductSchema.safeParse(req.body);
      if (!parseResult.success) {
        const issues = parseResult.error.issues || (parseResult.error as any).errors || [];
        res.status(400).json({
          error: `Datos de producto inválidos: ${issues.map((e: any) => e.message).join(', ')}`,
          details: issues,
        });
        return;
      }

      const updatedProduct = await productService.updateProduct(parsedId, parseResult.data);
      if (!updatedProduct) {
        res.status(404).json({ error: `Producto con ID ${parsedId} no encontrado` });
        return;
      }

      res.status(200).json(updatedProduct);
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      res.status(500).json({ error: 'Error interno al actualizar el producto' });
    }
  }

  /**
   * PATCH /api/v1/admin/productos/:id/toggle
   * Alterna el estado activo/inactivo
   */
  async toggleStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const parsedId = Number(id);

      if (isNaN(parsedId) || !Number.isInteger(parsedId) || parsedId <= 0) {
        res.status(400).json({ error: 'El ID del producto debe ser un número entero positivo' });
        return;
      }

      const updated = await productService.toggleStatus(parsedId);
      if (!updated) {
        res.status(404).json({ error: `Producto con ID ${parsedId} no encontrado` });
        return;
      }

      res.status(200).json(updated);
    } catch (error) {
      console.error('Error al alternar estado de producto:', error);
      res.status(500).json({ error: 'Error interno al alternar estado del producto' });
    }
  }

  /**
   * DELETE /api/v1/admin/productos/:id
   * Elimina un producto
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const parsedId = Number(id);

      if (isNaN(parsedId) || !Number.isInteger(parsedId) || parsedId <= 0) {
        res.status(400).json({ error: 'El ID del producto debe ser un número entero positivo' });
        return;
      }

      const deleted = await productService.deleteProduct(parsedId);
      if (!deleted) {
        res.status(404).json({ error: `Producto con ID ${parsedId} no encontrado` });
        return;
      }

      res.status(200).json({ message: 'Producto eliminado exitosamente', product: deleted });
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      res.status(500).json({ error: 'Error interno al eliminar el producto' });
    }
  }
}

export const adminProductController = new AdminProductController();
export default adminProductController;
