import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../types';

export interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product: Product, quantity: number = 1) => {
        set((state: CartStore) => {
          const existingItem = state.items.find((item: CartItem) => item.id === product.id);
          
          if (existingItem) {
            // Validar stock al incrementar
            const newQuantity = Math.min(existingItem.quantity + quantity, product.stock);
            
            return {
              items: state.items.map((item: CartItem) => 
                item.id === product.id 
                  ? { ...item, quantity: newQuantity } 
                  : item
              )
            };
          }
          
          // Validar stock al agregar nuevo
          const initialQuantity = Math.min(quantity, product.stock);
          
          if (initialQuantity <= 0) return state; // No agregar si no hay stock
          
          return {
            items: [...state.items, { ...product, quantity: initialQuantity }]
          };
        });
      },
      
      removeItem: (productId: number) => {
        set((state: CartStore) => ({
          items: state.items.filter((item: CartItem) => item.id !== productId)
        }));
      },
      
      updateQuantity: (productId: number, quantity: number) => {
        set((state: CartStore) => {
          return {
            items: state.items.map((item: CartItem) => {
              if (item.id === productId) {
                // Validación: no permitir cantidad > stock disponible, o menor que 1
                const newQuantity = Math.max(1, Math.min(quantity, item.stock));
                return { ...item, quantity: newQuantity };
              }
              return item;
            })
          };
        });
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getSubtotal: () => {
        const { items } = get();
        return items.reduce((total: number, item: CartItem) => total + (item.price * item.quantity), 0);
      },
      
      getTotal: () => {
        // Por ahora Total = Subtotal (sin impuestos extra), pero se prepara para el futuro
        return get().getSubtotal();
      }
    }),
    {
      name: 'lenios-cart-storage', // name of item in localStorage (must be unique)
    }
  )
);

