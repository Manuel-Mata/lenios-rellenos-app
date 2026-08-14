import { ShoppingCart, Trash2, Minus, Plus, AlertCircle, CheckCircle } from 'lucide-react';
import { useCartStore, type CartItem } from '../store/useCartStore';
import { Link } from 'react-router-dom';
import './CartPage.css';
import { useState } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'error' | 'success' | 'info';
}

export function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, getSubtotal, getTotal } = useCartStore();
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [shakeItemId, setShakeItemId] = useState<number | null>(null);

  const showToast = (message: string, type: 'error' | 'success' | 'info' = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handleDecrement = (itemId: number, currentQuantity: number) => {
    if (currentQuantity <= 1) {
      setShakeItemId(itemId);
      showToast('No puedes tener menos de 1 artículo', 'error');
      setTimeout(() => setShakeItemId(null), 600);
      return;
    }
    updateQuantity(itemId, currentQuantity - 1);
    showToast('Cantidad actualizada', 'success');
  };

  const handleIncrement = (itemId: number, currentQuantity: number, stock: number) => {
    if (currentQuantity >= stock) {
      setShakeItemId(itemId);
      showToast(`Stock máximo disponible: ${stock}`, 'error');
      setTimeout(() => setShakeItemId(null), 600);
      return;
    }
    updateQuantity(itemId, currentQuantity + 1);
    showToast('Cantidad actualizada', 'success');
  };

  const handleClearCart = () => {
    if (window.confirm('¿Estás seguro de que quieres vaciar todo el carrito?')) {
      clearCart();
      showToast('Carrito vaciado', 'success');
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
                    <div className={`quantity-controls ${shakeItemId === item.id ? 'shake' : ''}`}>
                      <button 
                        className="qty-btn qty-btn-minus"
                        onClick={() => handleDecrement(item.id, item.quantity)}
                        disabled={item.quantity <= 1}
                        aria-label={`Reducir cantidad de ${item.name}`}
                        title="No puedes tener menos de 1 artículo"
                      >
                        <Minus size={16} />
                      </button>
                      
                      <span className="qty-display" data-testid={`qty-display-${item.id}`}>{item.quantity}</span>
                      
                      <button 
                        className="qty-btn qty-btn-plus"
                        onClick={() => handleIncrement(item.id, item.quantity, item.stock)}
                        disabled={item.quantity >= item.stock}
                        aria-label={`Aumentar cantidad de ${item.name}`}
                        title={item.quantity >= item.stock ? `Stock máximo: ${item.stock}` : 'Aumentar cantidad'}
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

      {toasts.length > 0 && (
        <div className="toast-container">
          {toasts.map(toast => (
            <div key={toast.id} className={`toast toast-${toast.type}`}>
              <div className="toast-content">
                {toast.type === 'success' && <CheckCircle size={18} />}
                {toast.type === 'error' && <AlertCircle size={18} />}
                {toast.type === 'info' && <ShoppingCart size={18} />}
                <span>{toast.message}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
