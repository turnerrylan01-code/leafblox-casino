import { useApp } from '../context/AppContext';
import './CurrencyModal.css';

export function CurrencyModal() {
  const { showCurrencyModal, setShowCurrencyModal, currency, setCurrency, solanaPrice } = useApp();

  if (!showCurrencyModal) return null;

  return (
    <div className="modal-overlay" onClick={() => setShowCurrencyModal(false)}>
      <div className="currency-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Change Balance Currency</h2>
          <button className="modal-close" onClick={() => setShowCurrencyModal(false)}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          <p className="modal-description">
            Select your preferred currency for displaying your balance.
          </p>
          <div className="currency-options">
            <button
              className={`currency-option ${currency === 'SOL' ? 'active' : ''}`}
              onClick={() => setCurrency('SOL')}
            >
              <div className="currency-icon">◎</div>
              <div className="currency-info">
                <span className="currency-name">Solana (SOL)</span>
                <span className="currency-price">1 SOL = ${solanaPrice.toFixed(2)} USD</span>
              </div>
              {currency === 'SOL' && <span className="checkmark">✓</span>}
            </button>
            <button
              className={`currency-option ${currency === 'USD' ? 'active' : ''}`}
              onClick={() => setCurrency('USD')}
            >
              <div className="currency-icon">$</div>
              <div className="currency-info">
                <span className="currency-name">US Dollar (USD)</span>
                <span className="currency-price">Based on live SOL price</span>
              </div>
              {currency === 'USD' && <span className="checkmark">✓</span>}
            </button>
          </div>
          <div className="modal-note">
            <small>* Hover over your balance to see USD conversion when using SOL</small>
          </div>
        </div>
      </div>
    </div>
  );
}
