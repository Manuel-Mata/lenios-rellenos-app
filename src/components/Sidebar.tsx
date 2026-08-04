import { Link, useLocation } from 'react-router-dom';
import { Home, Package, ShoppingCart, Users, Settings, LogOut } from 'lucide-react';
import './Sidebar.css';

export function Sidebar() {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Gestión de Productos', path: '/products', icon: Package },
    { name: 'Control de Stock', path: '/stock', icon: ShoppingCart },
    { name: 'Clientes', path: '/customers', icon: Users },
    { name: 'Configuración', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="sidebar bg-surface shadow-md">
      <div className="sidebar-header">
        <h1 className="logo-text text-primary">Leños Rellenos</h1>
        <p className="subtitle text-muted">Panel de Administración</p>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            
            return (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={`nav-link ${isActive ? 'active' : ''}`}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="btn btn-outline w-full justify-center text-danger">
          <LogOut size={20} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
