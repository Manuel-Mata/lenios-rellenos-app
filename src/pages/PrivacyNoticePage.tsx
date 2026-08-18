import { Shield, FileText, User, Lock, Mail, Phone, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import './PrivacyNoticePage.css';

interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
}

function Accordion({ items }: { items: AccordionItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="privacy-accordion">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id} className={`accordion-item ${isOpen ? 'open' : ''}`}>
            <button
              className="accordion-trigger"
              onClick={() => setOpenId(isOpen ? null : item.id)}
              aria-expanded={isOpen}
              id={`accordion-btn-${item.id}`}
            >
              <span>{item.title}</span>
              {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {isOpen && (
              <div className="accordion-content" role="region" aria-labelledby={`accordion-btn-${item.id}`}>
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function PrivacyNoticePage() {
  const lastUpdated = '4 de agosto de 2026';
  const responsibleName = 'Leños Rellenos';
  const responsibleContact = 'lenosrellenos@gmail.com';

  const simplifiedItems: AccordionItem[] = [
    {
      id: 'responsable',
      title: '¿Quién es el responsable del tratamiento de tus datos?',
      content: (
        <div className="privacy-text-block">
          <p><strong>{responsibleName}</strong> es el responsable del tratamiento de tus datos personales. Puedes contactarnos a través de:</p>
          <ul>
            <li><Mail size={14} className="inline-icon" /> Correo electrónico: <a href={`mailto:${responsibleContact}`}>{responsibleContact}</a></li>
            <li><Phone size={14} className="inline-icon" /> WhatsApp de pedidos (disponible en la aplicación)</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'datos',
      title: '¿Qué datos personales recopilamos?',
      content: (
        <div className="privacy-text-block">
          <p>Recopilamos los datos personales estrictamente necesarios para las finalidades descritas:</p>
          <ul>
            <li><strong>Datos de entrega (sección Leños Rellenos / Carrito):</strong> nombre completo, dirección de entrega, número de teléfono/WhatsApp y notas adicionales del pedido.</li>
            <li><strong>Datos de gestión de proyectos:</strong> nombre del integrante, avance o porcentaje de progreso en tareas asignadas, y correo electrónico de contacto (cuando aplique).</li>
            <li><strong>Datos de uso de la aplicación:</strong> información generada durante la navegación, como productos consultados y pedidos realizados, únicamente para el funcionamiento interno del sistema.</li>
          </ul>
          <p className="privacy-note">No recopilamos datos sensibles (p. ej., datos biométricos, de salud, religión, origen étnico, opiniones políticas) ni datos financieros como números de tarjetas bancarias.</p>
        </div>
      ),
    },
    {
      id: 'finalidades',
      title: '¿Para qué usamos tus datos? (Finalidades)',
      content: (
        <div className="privacy-text-block">
          <p><strong>Finalidades primarias (necesarias para la relación comercial):</strong></p>
          <ul>
            <li>Procesar y gestionar tus pedidos de Leños Rellenos.</li>
            <li>Coordinar la entrega de productos al domicilio indicado.</li>
            <li>Contactarte para confirmar, modificar o dar seguimiento a tu pedido vía WhatsApp.</li>
            <li>Llevar el registro y control de proyectos y avances de los integrantes del equipo.</li>
          </ul>
          <p><strong>Finalidades secundarias (opcionales, puedes oponerte):</strong></p>
          <ul>
            <li>Enviarte promociones, descuentos y novedades del negocio.</li>
            <li>Realizar encuestas de satisfacción sobre el servicio.</li>
          </ul>
          <p className="privacy-note">Si no deseas que tus datos sean utilizados para finalidades secundarias, envíanos un correo a <a href={`mailto:${responsibleContact}`}>{responsibleContact}</a> indicándolo.</p>
        </div>
      ),
    },
    {
      id: 'transferencias',
      title: '¿Con quién compartimos tus datos?',
      content: (
        <div className="privacy-text-block">
          <p>No transferimos ni vendemos tus datos personales a terceros sin tu consentimiento, salvo en los siguientes casos permitidos por la Ley:</p>
          <ul>
            <li>Autoridades competentes que lo requieran mediante orden legal o judicial.</li>
            <li>Proveedores de tecnología que apoyan el funcionamiento de la plataforma (bajo acuerdos de confidencialidad y únicamente para fines técnicos).</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'derechos',
      title: 'Tus derechos ARCO (Acceso, Rectificación, Cancelación, Oposición)',
      content: (
        <div className="privacy-text-block">
          <p>Como titular de tus datos personales tienes derecho a:</p>
          <ul>
            <li><strong>Acceso:</strong> conocer qué datos personales tenemos sobre ti y cómo los usamos.</li>
            <li><strong>Rectificación:</strong> solicitar la corrección de datos inexactos o incompletos.</li>
            <li><strong>Cancelación:</strong> pedir la eliminación de tus datos cuando ya no sean necesarios.</li>
            <li><strong>Oposición:</strong> oponerte al tratamiento de tus datos para finalidades específicas.</li>
          </ul>
          <p>Para ejercer estos derechos, envía tu solicitud a <a href={`mailto:${responsibleContact}`}>{responsibleContact}</a> con:</p>
          <ul>
            <li>Nombre completo y datos de contacto.</li>
            <li>Descripción clara del derecho que deseas ejercer.</li>
            <li>Cualquier documento que ayude a identificarte.</li>
          </ul>
          <p>Responderemos en un plazo máximo de <strong>20 días hábiles</strong>.</p>
        </div>
      ),
    },
  ];

  const integralItems: AccordionItem[] = [
    {
      id: 'integral-cookies',
      title: 'Uso de cookies y tecnologías de rastreo',
      content: (
        <div className="privacy-text-block">
          <p>Esta aplicación puede utilizar tecnologías de seguimiento de sesión (cookies de sesión) para mantener el estado del carrito de compras y de inicio de sesión. Estas cookies son estrictamente necesarias para el funcionamiento de la plataforma y no se utilizan para rastrear tu comportamiento fuera de la aplicación.</p>
          <p>No se utilizan cookies de publicidad ni de rastreo de terceros.</p>
        </div>
      ),
    },
    {
      id: 'integral-seguridad',
      title: 'Medidas de seguridad',
      content: (
        <div className="privacy-text-block">
          <p>Implementamos medidas técnicas y organizacionales razonables para proteger tus datos personales frente a acceso no autorizado, pérdida, alteración o divulgación. Entre ellas:</p>
          <ul>
            <li>Acceso restringido a la base de datos únicamente al personal autorizado.</li>
            <li>Transmisión de datos sobre conexiones seguras cuando está disponible.</li>
            <li>Revisión periódica de nuestras prácticas de seguridad.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'integral-retencion',
      title: 'Tiempo de retención de datos',
      content: (
        <div className="privacy-text-block">
          <p>Conservaremos tus datos personales únicamente durante el tiempo necesario para cumplir con las finalidades descritas en este aviso, o bien mientras exista una relación comercial activa contigo, y por el tiempo que la legislación aplicable lo requiera.</p>
          <p>Una vez cumplida la finalidad, los datos serán eliminados o anonimizados de forma segura.</p>
        </div>
      ),
    },
    {
      id: 'integral-menores',
      title: 'Datos de menores de edad',
      content: (
        <div className="privacy-text-block">
          <p>Esta aplicación no está dirigida a menores de 18 años. No recopilamos intencionalmente datos de menores de edad. Si detectamos que hemos recibido datos de un menor sin el consentimiento de su tutor legal, los eliminaremos de inmediato.</p>
        </div>
      ),
    },
    {
      id: 'integral-cambios',
      title: 'Cambios al aviso de privacidad',
      content: (
        <div className="privacy-text-block">
          <p>Nos reservamos el derecho de modificar este aviso de privacidad en cualquier momento para adaptarlo a cambios legislativos, jurisprudenciales, de política interna o de prácticas de la industria. Cualquier modificación será notificada a través de esta misma página y/o por los canales de contacto registrados. La fecha de la última actualización siempre estará visible al inicio de este aviso.</p>
        </div>
      ),
    },
    {
      id: 'integral-lfpdppp',
      title: 'Marco legal aplicable',
      content: (
        <div className="privacy-text-block">
          <p>Este aviso se emite en cumplimiento de la <strong>Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)</strong> y su Reglamento, así como de los Lineamientos del Aviso de Privacidad publicados por el Instituto Nacional de Transparencia, Acceso a la Información y Protección de Datos Personales (<strong>INAI</strong>).</p>
          <p>Puedes consultar más información sobre tus derechos en <a href="https://home.inai.org.mx" target="_blank" rel="noopener noreferrer">home.inai.org.mx <ExternalLink size={12} className="inline-icon" /></a>.</p>
        </div>
      ),
    },
  ];

  return (
    <div className="privacy-page animate-fade-in">
      {/* Hero */}
      <div className="privacy-hero glass">
        <div className="privacy-hero-icon">
          <Shield size={40} />
        </div>
        <div className="privacy-hero-text">
          <h1 className="privacy-main-title">Aviso de Privacidad</h1>
          <p className="privacy-subtitle">
            <strong>Leños Rellenos</strong> se compromete a proteger tus datos personales.
            Última actualización: <time dateTime="2026-08-04">{lastUpdated}</time>.
          </p>
        </div>
      </div>

      {/* Simplified Notice */}
      <section className="privacy-section" aria-labelledby="simplified-heading">
        <div className="privacy-section-header">
          <div className="privacy-section-badge simplified">
            <FileText size={16} />
            <span>Simplificado</span>
          </div>
          <h2 id="simplified-heading" className="privacy-section-title">Aviso de Privacidad Simplificado</h2>
          <p className="privacy-section-desc">
            Un resumen claro y accesible de cómo manejamos tus datos personales.
          </p>
        </div>
        <Accordion items={simplifiedItems} />
      </section>

      {/* Integral Notice */}
      <section className="privacy-section" aria-labelledby="integral-heading">
        <div className="privacy-section-header">
          <div className="privacy-section-badge integral">
            <Lock size={16} />
            <span>Integral</span>
          </div>
          <h2 id="integral-heading" className="privacy-section-title">Aviso de Privacidad Integral</h2>
          <p className="privacy-section-desc">
            Información completa y detallada conforme a la LFPDPPP.
          </p>
        </div>
        <Accordion items={integralItems} />
      </section>

      {/* Contact Card */}
      <section className="privacy-contact-card glass" aria-label="Contacto para ejercer derechos ARCO">
        <User size={24} className="privacy-contact-icon text-primary" />
        <div>
          <h3>¿Tienes preguntas sobre tus datos?</h3>
          <p className="text-muted">
            Escríbenos directamente y con gusto te atendemos en un plazo máximo de 20 días hábiles.
          </p>
          <a
            href={`mailto:${responsibleContact}`}
            className="btn btn-primary privacy-contact-btn"
            id="privacy-contact-email-btn"
          >
            <Mail size={16} />
            {responsibleContact}
          </a>
        </div>
      </section>
    </div>
  );
}
