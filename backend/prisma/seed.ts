import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import prisma from '../src/prisma';

dotenv.config();

async function main() {
  console.log('Iniciando seed de la base de datos...');

  // Limpiar datos existentes de forma segura y ordenada
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.admin.deleteMany();

  // 10 productos iniciales con descripciones, precios, stock y fotos
  const products = [
    {
      name: 'Leño de Carnitas',
      description: 'Delicioso leño tradicional relleno de carnitas tiernas estilo Michoacán.',
      price: 45.0,
      stock: 15,
      image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&auto=format&fit=crop&q=60',
      active: true,
    },
    {
      name: 'Leño de Queso Oaxaca',
      description: 'Leño relleno de queso Oaxaca derretido de primera calidad.',
      price: 40.0,
      stock: 20,
      image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=500&auto=format&fit=crop&q=60',
      active: true,
    },
    {
      name: 'Leño de Pollo con Verduras',
      description: 'Pechuga de pollo desmenuzada y sazonada con finas verduras.',
      price: 42.0,
      stock: 18,
      image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500&auto=format&fit=crop&q=60',
      active: true,
    },
    {
      name: 'Leño de Rajas con Crema',
      description: 'Rajas poblanas asadas con elote, crema artesanal y queso fresco.',
      price: 40.0,
      stock: 12,
      image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=500&auto=format&fit=crop&q=60',
      active: true,
    },
    {
      name: 'Leño de Chicharrón Prensado',
      description: 'Chicharrón prensado guisado en salsa roja de chile guajillo.',
      price: 48.0,
      stock: 10,
      image: 'https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?w=500&auto=format&fit=crop&q=60',
      active: true,
    },
    {
      name: 'Leño de Barbacoa',
      description: 'Barbacoa de res jugosa y suave, cocida lentamente con hierbas aromáticas.',
      price: 50.0,
      stock: 8,
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=60',
      active: true,
    },
    {
      name: 'Leño Vegetariano',
      description: 'Mezcla fresca de calabacitas, zanahoria, elote y queso panela asado.',
      price: 38.0,
      stock: 14,
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=60',
      active: true,
    },
    {
      name: 'Leño de Champiñones',
      description: 'Champiñones frescos salteados al ajillo con epazote verde.',
      price: 42.0,
      stock: 11,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60',
      active: true,
    },
    {
      name: 'Leño de Chorizo con Papas',
      description: 'Chorizo artesanal ligeramente picante con papas doradas.',
      price: 45.0,
      stock: 16,
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop&q=60',
      active: true,
    },
    {
      name: 'Leño de Nopales con Queso',
      description: 'Nopales tiernos asados a la plancha con queso fresco y orégano.',
      price: 40.0,
      stock: 13,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60',
      active: true,
    },
  ];

  console.log(`Insertando ${products.length} productos...`);
  for (const product of products) {
    await prisma.product.create({ data: product });
  }
  console.log('Productos insertados con éxito.');

  // Crear usuario Administrador
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@lenios.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(adminPassword, saltRounds);

  const admin = await prisma.admin.create({
    data: {
      email: adminEmail,
      passwordHash,
    },
  });

  console.log(`Usuario administrador creado con éxito: ${admin.email}`);
  console.log('Seed completado exitosamente.');
}

main()
  .catch((e) => {
    console.error('Error durante la ejecución del seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
