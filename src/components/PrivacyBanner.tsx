import { useState, useEffect } from 'react';
import { Shield, X, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import './PrivacyBanner.css';

const STORAGE_KEY = 'lenosrellenos_privacy_accepted';

export function PrivacyBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem(STORAGE_KEY);
    if (!accepted) {
      // Small delay so it doesn't flash on first render
      const timer = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setVisible(false);
  };

  const handleClose = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="privacy-banner"
      role="dialog"
      aria-modal="false"
      aria-label="Aviso de privacidad"
      id="privacy-banner"
    >
      <div className="privacy-banner-inner">
        <div className="privacy-banner-icon" aria-hidden="true">
          <Shield size={22} />
        </div>
        <div className="privacy-banner-text">
          <strong>Tu privacidad importa.</strong>{' '}
          Al usar esta aplicación y proporcionar tus datos de entrega o información de proyecto, aceptas nuestro{' '}
          <Link
            to="/privacidad"
            className="privacy-banner-link"
            id="privacy-banner-link"
            onClick={handleClose}
          >
            Aviso de Privacidad <ExternalLink size={11} className="privacy-link-icon" />
          </Link>
          , en cumplimiento de la LFPDPPP.
        </div>
        <div className="privacy-banner-actions">
          <Link
            to="/privacidad"
            className="btn privacy-banner-btn-read"
            id="privacy-banner-read-btn"
            onClick={handleClose}
          >
            Leer aviso
          </Link>
          <button
            className="btn btn-primary privacy-banner-btn-accept"
            id="privacy-banner-accept-btn"
            onClick={handleAccept}
          >
            Entendido
          </button>
          <button
            className="privacy-banner-close"
            onClick={handleClose}
            aria-label="Cerrar aviso de privacidad"
            id="privacy-banner-close-btn"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
