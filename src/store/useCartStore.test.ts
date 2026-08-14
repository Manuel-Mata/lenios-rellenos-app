import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from './useCartStore';

describe('useCartStore', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it('PU-03: calcula el subtotal exacto de los productos', () => {
    const { addItem, getSubtotal } = useCartStore.getState();
    
    // Crear mocks de productos
    const productA = { 
      id: 1, 
      name: 'Prod A', 
      price: 50, 
      stock: 10, 
      isActive: true, 
      imageUrl: '', 
      description: '', 
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
    const productB = { 
      id: 2, 
      name: 'Prod B', 
      price: 100, 
      stock: 10, 
      isActive: true, 
      imageUrl: '', 
      description: '', 
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
    
    // Agregar al carrito
    addItem(productA, 2); // 50 * 2 = 100
    addItem(productB, 1); // 100 * 1 = 100
    
    // Validar subtotal (100 + 100 = 200)
    expect(getSubtotal()).toBe(200);
  });
});
