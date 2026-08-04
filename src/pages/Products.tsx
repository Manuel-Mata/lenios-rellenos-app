import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Power } from 'lucide-react';
import { productService } from '../services/productService';
import type { Product } from '../types';
import { ProductModal } from '../components/ProductModal';
import './Products.css';

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();

  const loadProducts = async () => {
    const data = await productService.getAll();
    setProducts(data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleAdd = () => {
    setEditingProduct(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      await productService.delete(id);
      loadProducts();
    }
  };

  const handleToggleStatus = async (id: number) => {
    await productService.toggleStatus(id);
    loadProducts();
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingProduct(undefined);
    loadProducts();
  };

  return (
    <div className="products-page animate-fade-in">
      <div className="page-header">
        <div>
          <h2 className="page-title">Gestión de Productos y Stock</h2>
          <p className="text-muted">Administra tu menú y la disponibilidad de los leños.</p>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>
          <Plus size={20} />
          <span>Agregar Producto</span>
        </button>
      </div>

      <div className="products-table-container glass rounded-lg shadow-sm">
        <table className="products-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th className="text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>
                  <div className="product-cell">
                    <img src={product.imageUrl} alt={product.name} className="product-image" />
                    <div>
                      <div className="product-name">{product.name}</div>
                      <div className="product-desc text-muted">{product.description}</div>
                    </div>
                  </div>
                </td>
                <td>${product.price.toFixed(2)}</td>
                <td>
                  <span className={`stock-badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                    {product.stock}
                  </span>
                </td>
                <td>
                  <button 
                    className={`status-btn ${product.isActive ? 'active' : 'inactive'}`}
                    onClick={() => handleToggleStatus(product.id)}
                    title={product.isActive ? 'Desactivar' : 'Activar'}
                  >
                    <Power size={16} />
                    <span>{product.isActive ? 'Activo' : 'Inactivo'}</span>
                  </button>
                </td>
                <td>
                  <div className="actions-cell">
                    <button className="action-btn edit" onClick={() => handleEdit(product)} title="Editar">
                      <Edit2 size={18} />
                    </button>
                    <button className="action-btn delete" onClick={() => handleDelete(product.id)} title="Eliminar">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-8 text-muted">
                  No hay productos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <ProductModal 
          product={editingProduct} 
          onClose={handleModalClose} 
        />
      )}
    </div>
  );
}
