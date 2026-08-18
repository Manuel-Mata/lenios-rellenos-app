import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Pos } from './Pos';
import { productService } from '../services/productService';
import { MemoryRouter } from 'react-router-dom';

// Mock del servicio
vi.mock('../services/productService', () => ({
  productService: {
    getAll: vi.fn(),
  },
}));

describe('Pos', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('PU-02: Pos muestra botón "Agregar" bloqueado y etiqueta "Agotado" si stock es 0', async () => {
    const mockProduct = {
      id: 1,
      name: 'Leño Sin Stock',
      description: 'Test',
      price: 150,
      stock: 0,
      isActive: true,
      imageUrl: 'test.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    (productService.getAll as any).mockResolvedValue([mockProduct]);

    render(
      <MemoryRouter>
        <Pos />
      </MemoryRouter>
    );

    // Esperar a que el producto se renderice
    const button = await screen.findByRole('button', { name: /agregar/i });
    
    // Verificar que el botón esté deshabilitado
    expect(button).toBeDisabled();
    
    // Verificar que muestre el texto de agotado en la UI
    expect(screen.getByText('Agotado')).toBeInTheDocument();
  });
});
