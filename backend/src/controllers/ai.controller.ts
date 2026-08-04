import { Request, Response } from 'express';
import { z } from 'zod';
import Anthropic from '@anthropic-ai/sdk';
import 'dotenv/config';

// Esquema de validación
const recommendSchema = z.object({
  preferencia: z.string().min(1, "La preferencia es muy corta").max(500, "La preferencia es demasiado larga"),
  userHistory: z.array(z.string()).optional(),
});

// Base de datos de productos reales
const PRODUCTS = [
  { id: 1, name: 'Leño Sabor Salchicha', description: 'leño relleno de salchicha con toque ahumado', price: 15.00, stock: 20, tags: ['salchicha', 'ahumado', 'económico', 'clásico', 'suave'] },
  { id: 2, name: 'Leño de Carne Ahumada', description: 'carne ahumada selecta, ideal para paladares fuertes', price: 25.00, stock: 10, tags: ['carne', 'ahumado', 'intenso', 'fuerte', 'premium'] },
  { id: 3, name: 'Leño BBQ Texas', description: 'sabor BBQ al estilo Texas, dulce y picante', price: 24.00, stock: 0, tags: ['bbq', 'texano', 'dulce', 'picante', 'ahumado'] },
  { id: 4, name: 'Leños Sabor Arrachera', description: 'arrachera marinada en un leño crujiente', price: 30.00, stock: 15, tags: ['arrachera', 'marinado', 'premium', 'especial', 'carne'] },
];

// Saludos y variaciones dinámicas
const SALUDOS = ['¡Claro!', '¡Con gusto!', '¡Excelente elección!', '¡Qué buen gusto!', '¡Por supuesto!'];
const CIERRES = [
  '¿Te gustaría ordenarlo?',
  '¿Con cuál te quedamos?',
  '¿Te animas a probarlo?',
  '¿Cuál de estos te llama más la atención?',
  '¿Te lo pedimos?'
];

const saludo = () => SALUDOS[Math.floor(Math.random() * SALUDOS.length)];
const cierre = () => CIERRES[Math.floor(Math.random() * CIERRES.length)];

// Motor de respuesta dinámico basado en los datos reales de la app
function generarRespuesta(preferencia: string): string {
  const pref = preferencia.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Detectar intención
  const esVegetariano = /vegetar|sin carne|vegano|verdura|ensalada/.test(pref);
  const esPrecio = /barato|económico|precio|costo|oferta|descuento/.test(pref);
  const esMenu = /menu|que tienen|que hay|opciones|catalogo|todo/.test(pref);
  const esSaludo = /^(hola|buenas|buen dia|buen tarde|hey|hi|hello|saludos)/.test(pref.trim());
  const esGracias = /gracias|thank|perfecto|excelente|genial/.test(pref);

  // Productos disponibles
  const disponibles = PRODUCTS.filter(p => p.stock > 0);
  const agotados = PRODUCTS.filter(p => p.stock === 0);

  // Buscar coincidencias por tags con los productos
  const scored = disponibles.map(product => {
    const score = product.tags.filter(tag => pref.includes(tag)).length;
    return { product, score };
  }).sort((a, b) => b.score - a.score);

  const top = scored.filter(s => s.score > 0).map(s => s.product);
  const recomendado = top.length > 0 ? top[0] : disponibles[Math.floor(Math.random() * disponibles.length)];

  // --- Respuestas según intención ---

  if (esSaludo) {
    return `¡Hola! Bienvenido a Leños Rellenos 🪵 Tenemos ${disponibles.length} opciones deliciosas disponibles hoy. ¿Qué se te antoja — algo suave como nuestra Salchicha ($${disponibles[0].price}) o algo más intenso como la Arrachera ($${PRODUCTS[3].price})? 😋`;
  }

  if (esGracias) {
    return `¡A ti! 😊 Es un placer atenderte. Si se te antoja algo más de nuestro menú, aquí estamos. ¡Buen provecho! 🪵🔥`;
  }

  if (esVegetariano) {
    return `Te cuento con honestidad — nuestra especialidad son los leños de carne, así que no manejamos opciones 100% vegetarianas. Sin embargo, si algún día cambias de antojo, tenemos el **${disponibles[0].name}** ($${disponibles[0].price}) que es más suave y ligero. ¡Siempre serás bienvenido! 🙏`;
  }

  if (esMenu) {
    const lista = disponibles.map(p => `• **${p.name}** — $${p.price.toFixed(2)}`).join('\n');
    const agotadoStr = agotados.length > 0 ? `\n(${agotados.map(p => p.name).join(', ')} — temporalmente agotado)` : '';
    return `¡Aquí está nuestro menú de hoy! 🪵\n\n${lista}${agotadoStr}\n\n¿Cuál te llama la atención?`;
  }

  if (esPrecio) {
    const masBarato = [...disponibles].sort((a, b) => a.price - b.price)[0];
    return `${saludo()} Si buscas la mejor relación precio-calidad, te recomiendo el **${masBarato.name}** a solo $${masBarato.price.toFixed(2)}. Es nuestro clásico favorito — ${masBarato.description}. ¡No decepciona! ${cierre()}`;
  }

  // Respuesta con el producto más relevante
  const segundo = disponibles.find(p => p.id !== recomendado.id);
  const agotadoMsg = agotados.length > 0 ? ` (el ${agotados[0].name} está temporalmente agotado)` : '';

  return `${saludo()} Para lo que buscas, te recomiendo el **${recomendado.name}** a $${recomendado.price.toFixed(2)} — ${recomendado.description}${agotadoMsg}. ${segundo ? `También tenemos el **${segundo.name}** ($${segundo.price.toFixed(2)}) si quieres otra opción. ` : ''}${cierre()}`;
}

export const recommendProducts = async (req: Request, res: Response) => {
  try {
    const validatedData = recommendSchema.parse(req.body);
    const { preferencia } = validatedData;

    console.log(`[AI] Procesando: "${preferencia}"`);

    // 1. Intentar con Claude API real primero
    try {
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

      const message = await client.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: 512,
        system: `Eres el asistente virtual de "Leños Rellenos", una taquería especializada en bolillos (leños) rellenos de carne. 
Productos disponibles hoy:
${PRODUCTS.filter(p => p.stock > 0).map(p => `- ${p.name} ($${p.price}) — ${p.description}`).join('\n')}
${PRODUCTS.filter(p => p.stock === 0).map(p => `- ${p.name} — AGOTADO`).join('\n')}

Responde en español, de forma amigable y conversacional. Máximo 3 oraciones. Sin listas ni formatos especiales.`,
        messages: [{ role: 'user', content: preferencia }],
      });

      const aiMessage = message.content
        .filter(b => b.type === 'text')
        .map(b => (b as { type: 'text'; text: string }).text)
        .join('');

      console.log(`[Claude] ✅ Respuesta de API real`);
      return res.json({ success: true, message: aiMessage });

    } catch {
      // 2. Si falla la API → motor dinámico de la app (sin textos predefinidos)
      console.log(`[App] ⚡ Generando respuesta dinámica local`);
      const respuesta = generarRespuesta(preferencia);
      return res.json({ success: true, message: respuesta });
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Datos inválidos', details: error.issues });
    }
    console.error('Error:', error);
    return res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};
