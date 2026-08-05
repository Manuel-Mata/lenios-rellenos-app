import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, ShoppingCart, Loader2 } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import './AiChatWidget.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  recommendations?: any[];
}

export function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const initialMessage: Message[] = [{
    id: '1',
    role: 'assistant',
    content: '¡Hola! Soy tu asistente virtual de Leños Rellenos. 🪵\n¿Cuál es tu sabor favorito o qué antojo tienes hoy?'
  }];
  const [messages, setMessages] = useState<Message[]>(initialMessage);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Extraer historial para contexto (solo últimos 5 mensajes)
      const userHistory = messages
        .filter(m => m.role === 'user')
        .slice(-5)
        .map(m => m.content);

      const response = await fetch('http://localhost:5000/api/v1/ia/recomendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preferencia: userMessage.content,
          userHistory
        })
      });


      if (!response.ok) {
        if (response.status === 429) throw new Error('Demasiadas solicitudes. Espera un momento.');
        throw new Error('Error al conectar con el servidor.');
      }

      const data = await response.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        recommendations: data.recommendations
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error: any) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: error.message || 'Lo siento, tuve un problema procesando tu solicitud. Por favor intenta de nuevo.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAddToCart = (product: any) => {
    addItem(product, 1);
    // Mostrar feedback visual
    alert(`¡${product.name} añadido al carrito!`);
  };

  return (
    <>
      <button 
        className={`ai-widget-button ${isOpen ? 'hidden' : ''}`}
        onClick={() => setIsOpen(true)}
      >
        <Bot size={28} />
      </button>

      <div className={`ai-chat-window glass shadow-lg ${isOpen ? 'open' : ''}`}>
        <div className="ai-chat-header bg-primary text-white">
          <div className="flex items-center gap-2">
            <Bot size={24} />
            <div className="flex flex-col">
              <h3 className="font-semibold m-0 text-white">LeñoBot</h3>
              <span className="text-xs opacity-80">Asistente Virtual</span>
            </div>
          </div>
          <button className="icon-btn text-white hover-bg-transparent" onClick={() => {
            setIsOpen(false);
            // Limpiar chat al cerrar
            setTimeout(() => setMessages(initialMessage), 300);
          }}>
            <X size={20} />
          </button>
        </div>

        <div className="ai-chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`message-wrapper ${msg.role}`}>
              <div className="message-bubble">
                <p>{msg.content}</p>
                
                {msg.recommendations && msg.recommendations.length > 0 && (
                  <div className="recommendations-container">
                    {msg.recommendations.map((prod, idx) => (
                      <div key={idx} className="recommendation-card">
                        <img src={prod.imageUrl} alt={prod.name} />
                        <div className="rec-info">
                          <h4>{prod.name}</h4>
                          <p className="text-muted text-xs">{prod.ai_description}</p>
                          <div className="rec-footer">
                            <span className="price font-bold">${prod.price.toFixed(2)}</span>
                            <button 
                              className="btn btn-sm btn-primary"
                              onClick={() => handleAddToCart(prod)}
                            >
                              <ShoppingCart size={14} /> Agregar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="message-wrapper assistant">
              <div className="message-bubble loading">
                <Loader2 size={18} className="animate-spin text-muted" />
                <span className="text-muted text-sm">Analizando gustos...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="ai-chat-input-area">
          <textarea 
            placeholder="Escribe tus antojos aquí..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
            rows={2}
          />
          <button 
            className="btn btn-primary send-btn"
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </>
  );
}
