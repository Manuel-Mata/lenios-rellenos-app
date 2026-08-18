import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import './PrivacyInlineNotice.css';

interface PrivacyInlineNoticeProps {
  /** Context label shown to the user, e.g. "datos de entrega" or "datos del proyecto" */
  context?: string;
  className?: string;
}

export function PrivacyInlineNotice({
  context = 'tus datos personales',
  className = '',
}: PrivacyInlineNoticeProps) {
  return (
    <aside
      className={`privacy-inline-notice ${className}`}
      role="note"
      aria-label="Aviso de privacidad breve"
      id="privacy-inline-notice"
    >
      <Shield size={14} className="privacy-inline-icon" aria-hidden="true" />
      <p className="privacy-inline-text">
        Al proporcionar {context}, aceptas el tratamiento conforme a nuestro{' '}
        <Link
          to="/privacidad"
          className="privacy-inline-link"
          id="privacy-inline-link"
          aria-label="Ver aviso de privacidad completo"
        >
          Aviso de Privacidad
        </Link>
        {' '}(LFPDPPP). Tus datos se usan únicamente para gestionar tu pedido.
      </p>
    </aside>
  );
}
