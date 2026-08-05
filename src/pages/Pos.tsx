import { useState, useEffect } from 'react';
import { ShoppingCart, Plus } from 'lucide-react';
import { productService } from '../services/productService';
import type { Product } from '../types';
import { useCartStore } from '../store/useCartStore';
import './Pos.css';

export function Pos() {
  const [products, setProducts] = useState<Product[]>([]);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await productService.getAll();
      // Solo mostrar productos activos para la venta
      setProducts(data.filter(p => p.isActive));
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    if (product.stock <= 0) {
      alert('Producto agotado');
      return;
    }
    addItem(product, 1);
  };

  return (
    <div className="pos-page animate-fade-in">
      <div className="page-header">
        <div>
          <h2 className="page-title">Punto de Venta (Tienda)</h2>
          <p className="text-muted">Selecciona los productos para agregarlos al pedido.</p>
        </div>
      </div>

      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className={`product-card glass ${product.stock <= 0 ? 'out-of-stock' : ''}`}>
            <div className="product-image-container">
              <img src={product.imageUrl} alt={product.name} />
              {product.stock <= 0 && <span className="stock-overlay">Agotado</span>}
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="product-desc text-muted">{product.description}</p>
              
              <div className="product-footer">
                <span className="price">${product.price.toFixed(2)}</span>
                <span className="stock-info text-muted">Stock: {product.stock}</span>
              </div>
              
              <button 
                className="btn btn-primary add-to-cart-btn"
                onClick={() => handleAddToCart(product)}
                disabled={product.stock <= 0}
              >
                <Plus size={18} />
                <span>Agregar</span>
              </button>
            </div>
          </div>
        ))}
        
        {products.length === 0 && (
          <div className="empty-state glass">
            <ShoppingCart size={48} className="text-muted mb-4" />
            <h3>No hay productos disponibles</h3>
            <p className="text-muted">Activa productos en el panel de Gestión de Productos para verlos aquí.</p>
          </div>
        )}
      </div>
    </div>
  );
}
