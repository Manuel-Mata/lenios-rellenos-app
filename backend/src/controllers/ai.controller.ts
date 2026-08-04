import { Request, Response } from 'express';
import { z } from 'zod';

// Esquema de validación usando Zod
const recommendSchema = z.object({
  preferencia: z.string().min(2, "La preferencia es muy corta").max(500, "La preferencia es demasiado larga"),
  userHistory: z.array(z.string()).optional(),
});

// Mock de base de datos de productos para el recomendador local
const MOCK_DB_PRODUCTS = [
  { id: 1, name: 'Leño Sabor Salchicha', description: 'Delicioso leño relleno de salchicha con un toque ahumado.', price: 15.00, stock: 20, imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=80' },
  { id: 2, name: 'Leño de Carne Ahumada', description: 'Leño relleno de carne ahumada selecta, ideal para paladares fuertes.', price: 25.00, stock: 10, imageUrl: 'https://images.unsplash.com/photo-1544025162-8111f4e705b9?w=800&q=80' },
  { id: 3, name: 'Leño BBQ Texas', description: 'Sabor BBQ al estilo Texas, dulce y picante.', price: 24.00, stock: 0, imageUrl: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=800&q=80' },
  { id: 4, name: 'Leños Sabor Arrachera', description: 'Exquisita arrachera marinada en un leño crujiente.', price: 30.00, stock: 15, imageUrl: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&q=80' }
];

export const recommendProducts = async (req: Request, res: Response) => {
  try {
    // 1. Validación y Sanitización
    const validatedData = recommendSchema.parse(req.body);
    const { preferencia, userHistory } = validatedData;

    // 2. Mock de Inteligencia Artificial (Simulación de Claude API)
    // En producción, aquí se inicializaría @anthropic-ai/sdk y se pasaría la `preferencia` y el inventario.
    
    console.log(`[AI Mock] Analizando preferencia: "${preferencia}"`);
    console.log(`[AI Mock] Historial de usuario: ${userHistory?.length || 0} mensajes`);

    // Lógica Mock: Simular tiempo de pensamiento de IA
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Lógica Mock: Buscar palabras clave básicas
    const lowercasePref = preferencia.toLowerCase();
    
    // Filtramos productos con stock mayor a 0
    let availableProducts = MOCK_DB_PRODUCTS.filter(p => p.stock > 0);
    
    // Ordenamos por relevancia básica simulada
    if (lowercasePref.includes('carne') || lowercasePref.includes('ahumad')) {
      availableProducts = availableProducts.sort((a, b) => b.name.includes('Carne') ? 1 : -1);
    } else if (lowercasePref.includes('salchicha') || lowercasePref.includes('niño')) {
      availableProducts = availableProducts.sort((a, b) => b.name.includes('Salchicha') ? 1 : -1);
    } else if (lowercasePref.includes('arrachera') || lowercasePref.includes('premium')) {
      availableProducts = availableProducts.sort((a, b) => b.name.includes('Arrachera') ? 1 : -1);
    }

    // Tomar el Top 3
    const top3 = availableProducts.slice(0, 3).map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      imageUrl: product.imageUrl,
      // Personalizar la descripción basado en lo que pidió el usuario (como haría una IA)
      ai_description: `Basado en tu gusto por "${preferencia.substring(0, 20)}...", te recomiendo este ${product.name}. ${product.description}`
    }));

    // Mensaje de respuesta natural simulado
    let aiMessage = `¡Excelente elección! He buscado en nuestro menú y he encontrado estas opciones perfectas para ti:`;
    if (top3.length === 0) {
      aiMessage = `Lo siento, en este momento no tenemos opciones disponibles que coincidan exactamente con eso, pero te invitamos a ver nuestro menú completo.`;
    }

    // 3. Respuesta JSON estructurada
    return res.json({
      success: true,
      message: aiMessage,
      recommendations: top3
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Datos inválidos',
        details: error.issues
      });
    }
    
    console.error('Error en recommendProducts:', error);
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor al procesar la recomendación'
    });
  }
};
