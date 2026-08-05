import { ShoppingCart, Trash2, Minus, Plus, AlertCircle } from 'lucide-react';
import { useCartStore, type CartItem } from '../store/useCartStore';
import { Link } from 'react-router-dom';
import './CartPage.css';

export function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, getSubtotal, getTotal } = useCartStore();

  const handleClearCart = () => {
    if (window.confirm('¿Estás seguro de que quieres vaciar todo el carrito?')) {
      clearCart();
    }
  };

  if (items.length === 0) {
    return (
      <div className="cart-page animate-fade-in">
        <div className="page-header">
          <h2 className="page-title">Mi Carrito</h2>
        </div>
        <div className="empty-cart glass">
          <ShoppingCart size={64} className="text-muted mb-4" />
          <h3>Tu carrito está vacío</h3>
          <p className="text-muted mb-6">Parece que aún no has agregado ningún producto.</p>
          <Link to="/pos" className="btn btn-primary">
            Ir a la Tienda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page animate-fade-in">
      <div className="page-header flex-between">
        <h2 className="page-title">Mi Carrito</h2>
        <button className="btn btn-outline text-danger" onClick={handleClearCart}>
          <Trash2 size={18} />
          <span>Vaciar Carrito</span>
        </button>
      </div>

      <div className="cart-content">
        <div className="cart-items-container glass">
          <div className="cart-items-list">
            {items.map((item: CartItem) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.imageUrl} alt={item.name} />
                </div>
                
                <div className="cart-item-details">
                  <div className="cart-item-header">
                    <h4>{item.name}</h4>
                    <button 
                      className="remove-item-btn text-danger" 
                      onClick={() => removeItem(item.id)}
                      title="Eliminar producto"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <div className="cart-item-price">
                    ${item.price.toFixed(2)} c/u
                  </div>
                  
                  <div className="cart-item-actions">
                    <div className="quantity-controls">
                      <button 
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={16} />
                      </button>
                      
                      <span className="qty-display">{item.quantity}</span>
                      
                      <button 
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    <div className="item-total-price">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                  
                  {item.quantity >= item.stock && (
                    <div className="stock-warning">
                      <AlertCircle size={14} />
                      <span>Has alcanzado el límite de stock disponible ({item.stock})</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="cart-summary glass">
          <h3>Resumen del Pedido</h3>
          
          <div className="summary-row">
            <span className="text-muted">Subtotal ({items.reduce((acc: number, item: CartItem) => acc + item.quantity, 0)} artículos)</span>
            <span>${getSubtotal().toFixed(2)}</span>
          </div>

          
          <div className="summary-row">
            <span className="text-muted">Descuento</span>
            <span>$0.00</span>
          </div>
          
          <div className="summary-divider"></div>
          
          <div className="summary-row total">
            <span>Total</span>
            <span className="total-price">${getTotal().toFixed(2)}</span>
          </div>
          
          <button className="btn btn-primary btn-block checkout-btn mt-6">
            Proceder al Pago
          </button>
          
          <Link to="/pos" className="btn btn-outline btn-block mt-4 justify-center">
            Seguir Comprando
          </Link>
        </div>
      </div>
    </div>
  );
}
