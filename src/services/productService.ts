import type { Product } from '../types';

// Mock initial data
const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Leño Sabor Salchicha',
    description: 'Delicioso leño relleno de salchicha.',
    price: 15.00,
    stock: 20,
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=80'
  },
  {
    id: 2,
    name: 'Leño de Carne Ahumada',
    description: 'Leño relleno de carne ahumada selecta.',
    price: 25.00,
    stock: 10,
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1544025162-8111f4e705b9?w=800&q=80'
  },
  {
    id: 3,
    name: 'Leño BBQ Texas',
    description: 'Sabor BBQ al estilo Texas.',
    price: 24.00,
    stock: 0,
    isActive: false,
    imageUrl: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=800&q=80'
  },
  {
    id: 4,
    name: 'Leños Sabor Arrachera',
    description: 'Exquisita arrachera en un leño.',
    price: 30.00,
    stock: 15,
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&q=80'
  }
];

class ProductService {
  private getProducts(): Product[] {
    const stored = localStorage.getItem('lenos_products');
    if (!stored) {
      this.saveProducts(INITIAL_PRODUCTS);
      return INITIAL_PRODUCTS;
    }
    return JSON.parse(stored);
  }

  private saveProducts(products: Product[]) {
    localStorage.setItem('lenos_products', JSON.stringify(products));
  }

  async getAll(): Promise<Product[]> {
    return this.getProducts();
  }

  async getById(id: number): Promise<Product | undefined> {
    return this.getProducts().find(p => p.id === id);
  }

  async create(product: Omit<Product, 'id'>): Promise<Product> {
    const products = this.getProducts();
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const newProduct = { ...product, id: newId };
    products.push(newProduct);
    this.saveProducts(products);
    return newProduct;
  }

  async update(id: number, productUpdate: Partial<Product>): Promise<Product> {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');
    
    products[index] = { ...products[index], ...productUpdate };
    this.saveProducts(products);
    return products[index];
  }

  async delete(id: number): Promise<void> {
    const products = this.getProducts();
    const filtered = products.filter(p => p.id !== id);
    this.saveProducts(filtered);
  }
  
  async toggleStatus(id: number): Promise<Product> {
    const product = await this.getById(id);
    if (!product) throw new Error('Product not found');
    return this.update(id, { isActive: !product.isActive });
  }
}

export const productService = new ProductService();
