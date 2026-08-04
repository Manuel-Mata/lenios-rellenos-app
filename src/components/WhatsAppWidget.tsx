import { useState, useRef, useEffect } from 'react';
import './WhatsAppWidget.css';

const WHATSAPP_NUMBER = '5213751837635'; // Mexico country code +52 1 + 10 digits

export function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const widgetRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setIsOpen(false);
    setMessage('');
  };

  const quickButtons = [
    '🪵 Hacer un pedido',
    '❓ Consulta de producto',
    '🛠️ Soporte técnico'
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.addEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="whatsapp-widget-container" ref={widgetRef}>
      {isOpen && (
        <div className="whatsapp-popup animate-fade-in-up">
          <div className="whatsapp-header">
            <div className="whatsapp-header-info">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="whatsapp-icon-small"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              <div>
                <h4>Atención al Cliente</h4>
                <p>En línea</p>
              </div>
            </div>
            <button className="whatsapp-close" onClick={() => setIsOpen(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          
          <div className="whatsapp-body">
            <div className="whatsapp-message-bubble bot-bubble">
              Hola 👋 ¿En qué podemos ayudarte hoy? Elige una opción o escribe tu mensaje.
            </div>
            
            <div className="whatsapp-quick-actions">
              {quickButtons.map((btn, idx) => (
                <button 
                  key={idx} 
                  className="whatsapp-quick-btn"
                  onClick={() => handleSend(btn)}
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>
          
          <div className="whatsapp-footer">
            <input 
              type="text" 
              placeholder="Escribe un mensaje..." 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSend(message);
                }
              }}
            />
            <button 
              className="whatsapp-send-btn"
              onClick={() => handleSend(message)}
              disabled={!message.trim()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </div>
        </div>
      )}
      
      <button 
        className={`whatsapp-trigger ${isOpen ? 'active' : ''}`}
        onClick={handleToggle}
        aria-label="Abrir chat de WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
      </button>
    </div>
  );
}
