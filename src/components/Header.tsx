import { Bell, User } from 'lucide-react';
import './Header.css';

export function Header() {
  return (
    <header className="header bg-surface shadow-sm">
      <div className="header-search">
        {/* Espacio para una barra de búsqueda en el futuro si es necesaria */}
      </div>
      
      <div className="header-actions">
        <button className="icon-btn">
          <Bell size={20} className="text-muted" />
          <span className="badge bg-primary">3</span>
        </button>
        
        <div className="user-profile">
          <div className="avatar bg-secondary">
            <User size={20} color="white" />
          </div>
          <div className="user-info">
            <span className="user-name">Admin Familiar</span>
            <span className="user-role text-muted">Administrador</span>
          </div>
        </div>
      </div>
    </header>
  );
}
