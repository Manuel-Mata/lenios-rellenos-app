import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { CartPage } from './CartPage';
import { useCartStore } from '../store/useCartStore';
import { MemoryRouter } from 'react-router-dom';

describe('CartPage', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it('PU-01: CartPage impide reducir la cantidad de un artículo a menos de 1', () => {
    // Setup initial state with one item in cart
    const mockProduct = {
      id: 1,
      name: 'Leño Especial',
      description: 'Test',
      price: 150,
      stock: 5,
      isActive: true,
      imageUrl: 'test.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    useCartStore.getState().addItem(mockProduct, 1);

    render(
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>
    );

    // Encontrar el botón de restar
    // Nota: El botón de restar es el primer botón con la clase qty-btn y un icono Minus
    const minusButtons = document.querySelectorAll('.qty-btn');
    const minusButton = minusButtons[0]; // El de restar

    expect(minusButton).toBeDisabled();

    // Intentar forzar click (aunque esté deshabilitado, en DOM real no hace nada,
    // pero verificamos que Zustand no permita bajar de 1 si llamamos a updateQuantity)
    const { updateQuantity } = useCartStore.getState();
    updateQuantity(1, 0); // Intentar actualizar a 0
    
    // Validar el estado
    expect(useCartStore.getState().items[0].quantity).toBe(1);
  });
});
