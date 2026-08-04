import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import type { Product } from '../types';
import { productService } from '../services/productService';
import './ProductModal.css';

interface ProductModalProps {
  product?: Product;
  onClose: () => void;
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80' // default placeholder
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        isActive: product.isActive,
        imageUrl: product.imageUrl,
      });
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    let parsedValue: any = value;
    if (type === 'number') {
      parsedValue = parseFloat(value) || 0;
    }
    
    setFormData(prev => ({ ...prev, [name]: parsedValue }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (product) {
        await productService.update(product.id, formData);
      } else {
        await productService.create(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Hubo un error al guardar el producto');
    }
  };

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="modal-content glass shadow-lg rounded-lg">
        <div className="modal-header">
          <h3>{product ? 'Editar Producto' : 'Nuevo Producto'}</h3>
          <button className="icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label htmlFor="name">Nombre del Producto</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              className="input-field" 
              value={formData.name}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción Breve</label>
            <textarea 
              id="description" 
              name="description" 
              className="input-field" 
              rows={3}
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Precio ($)</label>
              <input 
                type="number" 
                id="price" 
                name="price" 
                className="input-field" 
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="stock">Stock Inicial</label>
              <input 
                type="number" 
                id="stock" 
                name="stock" 
                className="input-field" 
                min="0"
                value={formData.stock}
                onChange={handleChange}
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="imageUrl">URL de Imagen</label>
            <input 
              type="url" 
              id="imageUrl" 
              name="imageUrl" 
              className="input-field" 
              value={formData.imageUrl}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                name="isActive"
                checked={formData.isActive}
                onChange={handleCheckboxChange}
              />
              <span className="checkbox-text">Producto Activo (Visible en Menú)</span>
            </label>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={18} />
              <span>{product ? 'Actualizar' : 'Guardar'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
