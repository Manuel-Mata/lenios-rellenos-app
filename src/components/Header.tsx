import { Bell, User, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import './Header.css';

export function Header() {
  const items = useCartStore((state) => state.items);
  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  return (
    <header className="header bg-surface shadow-sm">
      <div className="header-search">
        {/* Espacio para una barra de búsqueda en el futuro si es necesaria */}
      </div>
      
      <div className="header-actions">
        <Link to="/cart" className="icon-btn" style={{ marginRight: '8px' }}>
          <ShoppingCart size={20} className="text-muted" />
          {cartItemCount > 0 && (
            <span className="badge bg-primary">{cartItemCount}</span>
          )}
        </Link>
        <button className="icon-btn">
          <Bell size={20} className="text-muted" />
          <span className="badge bg-primary">3</span>
        </button>
        
        <div className="user-profile">
          <div className="avatar bg-secondary">
            <User size={20} color="white" />
          </div>
          <div className="user-info">
            <span className="user-name">valeria guadalupe calvillo</span>
            <span className="user-role text-muted">Familiar Administrativo</span>
          </div>
        </div>
      </div>
    </header>
  );
}
