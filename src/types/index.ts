export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  isActive: boolean;
  imageUrl: string;
}

export interface Order {
  id: number;
  clientName: string;
  items: OrderItem[];
  total: number;
  status: 'Pendiente' | 'En Preparación' | 'Por Entregar' | 'Completado';
  date: string;
}

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}
