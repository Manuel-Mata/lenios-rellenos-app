import { useState, useEffect } from 'react';
import { Package, ShoppingCart, Users, TrendingUp } from 'lucide-react';
import { productService } from '../services/productService';
import type { Product } from '../types';
import './Dashboard.css';

export function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await productService.getAll();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  const activeProducts = products.filter(p => p.isActive).length;
  const inactiveProducts = products.filter(p => !p.isActive).length;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2 className="page-title">Dashboard</h2>
        <p className="text-muted">Bienvenido, Gabriel Barrón</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card glass">
          <div className="stat-icon bg-primary">
            <Package size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Productos Activos</span>
            <span className="stat-value">{activeProducts}</span>
          </div>
        </div>
        
        <div className="stat-card glass">
          <div className="stat-icon bg-secondary">
            <Package size={24} color="white" />
          </div>
          <div className="stat-info">
            <span className="stat-label">Productos Inactivos</span>
            <span className="stat-value">{inactiveProducts}</span>
          </div>
        </div>

        <div className="stat-card glass">
          <div className="stat-icon bg-primary" style={{ backgroundColor: '#f59e0b' }}>
            <ShoppingCart size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Pedidos Pendientes</span>
            <span className="stat-value">5</span>
          </div>
        </div>

        <div className="stat-card glass">
          <div className="stat-icon bg-primary" style={{ backgroundColor: '#10b981' }}>
            <Users size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Clientes Frecuentes</span>
            <span className="stat-value">12</span>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-section glass rounded-lg p-6">
          <div className="section-header">
            <h3>Ventas del Día</h3>
            <button className="btn btn-outline text-primary"><TrendingUp size={16} /> Ver Reporte</button>
          </div>
          <div className="sales-amount">
            <span className="currency">$</span>
            <span className="amount">1,200</span>
          </div>
          <p className="text-muted">Estado del Negocio: <span className="text-success font-semibold">Abierto Ahora</span></p>
        </div>

        <div className="dashboard-section glass rounded-lg p-6">
          <div className="section-header">
            <h3>Pedidos Recientes</h3>
            <button className="btn btn-outline text-primary">Ver Todos</button>
          </div>
          <div className="recent-orders">
            <p className="text-muted text-center py-4">No hay pedidos recientes mostrados.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
