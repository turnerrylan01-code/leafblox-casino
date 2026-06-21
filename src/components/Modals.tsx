import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { ALL_TAGS, getUserTags } from '../data/tags';
import './Modals.css';

export function DepositModal() {
  const { showDeposit, setShowDeposit, balance, deposit } = useApp();
  const [amount, setAmount] = useState('');

  if (!showDeposit) return null;

  const numAmount = parseFloat(amount) || 0;
  const usdEstimate = (numAmount * 68.5).toFixed(2);

  const handleDeposit = () => {
    if (numAmount > 0) {
      deposit(numAmount);
      setAmount('');
      setShowDeposit(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setShowDeposit(false)}>
      <div className="modal deposit-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setShowDeposit(false)}>✕</button>
        <h2 className="modal-title">Deposit</h2>
        <p className="modal-subtitle">Enjoy 0% fees on deposits!</p>
        <div className="modal-row">
          <span>Balance:</span>
          <span>SOL: {balance.toFixed(3)}</span>
        </div>
        <div className="modal-row muted">
          <span>Amount</span>
          <span>≈ ${usdEstimate} USD</span>
        </div>
        <input
          className="modal-input"
          type="number"
          placeholder="0.000"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          min="0"
          step="0.001"
        />
        <button className="btn-primary modal-action" onClick={handleDeposit} disabled={numAmount <= 0}>
          DEPOSIT NOW
        </button>
        <button className="btn-secondary modal-action secondary">
          MORE OPTIONS (BTC, ETH, LTC, USDT)
        </button>
        <div className="modal-social">
          <button className="social-btn">D</button>
          <button className="social-btn">X</button>
        </div>
      </div>
    </div>
  );
}

export function WithdrawModal() {
  const { showWithdraw, setShowWithdraw, balance, withdraw } = useApp();
  const [amount, setAmount] = useState('');

  if (!showWithdraw) return null;

  const numAmount = parseFloat(amount) || 0;
  const usdEstimate = (numAmount * 68.5).toFixed(2);
  const canWithdraw = numAmount > 0 && numAmount <= balance;

  const handleWithdraw = () => {
    if (canWithdraw && withdraw(numAmount)) {
      setAmount('');
      setShowWithdraw(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setShowWithdraw(false)}>
      <div className="modal withdraw-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setShowWithdraw(false)}>✕</button>
        <h2 className="modal-title">Withdraw</h2>
        <p className="modal-subtitle">Enjoy 0% fees on withdrawals!</p>
        <div className="modal-row">
          <span>Balance:</span>
          <span>SOL: {balance.toFixed(3)}</span>
        </div>
        <div className="modal-row muted">
          <span>Amount</span>
          <span>≈ ${usdEstimate} USD</span>
        </div>
        <input
          className="modal-input"
          type="number"
          placeholder="0.000"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          min="0"
          step="0.001"
        />
        <label className="withdraw-wallet">
          <input type="checkbox" defaultChecked />
          <span>I want to withdraw to <span className="wallet-addr">G14ubwg...</span></span>
        </label>
        <button
          className="btn-primary modal-action"
          onClick={handleWithdraw}
          disabled={!canWithdraw}
          style={!canWithdraw ? { background: '#2a2d3e', color: '#6b7280' } : {}}
        >
          WITHDRAW NOW
        </button>
        <button className="btn-secondary modal-action secondary">
          WITHDRAW IN OTHER CURRENCIES
        </button>
        <div className="modal-social">
          <button className="social-btn">D</button>
          <button className="social-btn">X</button>
        </div>
      </div>
    </div>
  );
}

export function ComingSoonModal() {
  const { showComingSoon, setShowComingSoon } = useApp();
  if (!showComingSoon) return null;

  return (
    <div className="modal-overlay" onClick={() => setShowComingSoon(false)}>
      <div className="modal coming-soon-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setShowComingSoon(false)}>✕</button>
        <div className="coming-soon-content">
          <div className="coming-soon-icon">⛓</div>
          <h2>ENDPASS</h2>
          <p>Coming soon — stay tuned!</p>
        </div>
      </div>
    </div>
  );
}

export function TagsModal() {
  const { showTagsModal, setShowTagsModal } = useApp();
  const { walletAddress, email } = useAuth();
  if (!showTagsModal) return null;

  const ownedTagIds = getUserTags(walletAddress || '', email || undefined);

  const roleTags = ALL_TAGS.filter(t => t.category === 'role');
  const wageredTags = ALL_TAGS.filter(t => t.category === 'wagered');
  const winnerTags = ALL_TAGS.filter(t => t.category === 'winner');

  return (
    <div className="modal-overlay" onClick={() => setShowTagsModal(false)}>
      <div className="modal tags-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setShowTagsModal(false)}>✕</button>
        <div className="tags-header">
          <div className="tags-icon">🏷️</div>
          <div>
            <h2>Tags</h2>
            <p>View all available tags</p>
          </div>
        </div>

        <div className="section-divider">Role Tags</div>
        <div className="tags-grid">
          {roleTags.map(tag => {
            const isOwned = ownedTagIds.includes(tag.id);
            return (
              <div key={tag.id} className={`tag-card ${isOwned ? 'owned' : 'locked'}`}>
                <span className="tag-emoji">{tag.emoji}</span>
                <span className="tag-name">{tag.name}</span>
                {!isOwned && <span className="tag-lock">🔒</span>}
              </div>
            );
          })}
        </div>

        <div className="section-divider">Wagered Tags</div>
        <div className="tags-grid">
          {wageredTags.map(tag => {
            const isOwned = ownedTagIds.includes(tag.id);
            return (
              <div key={tag.id} className={`tag-card ${isOwned ? 'owned' : 'locked'}`}>
                <span className="tag-emoji">{tag.emoji}</span>
                <span className="tag-name">{tag.name}</span>
                {!isOwned && <span className="tag-lock">🔒</span>}
              </div>
            );
          })}
        </div>

        <div className="section-divider">Winner Tags</div>
        <div className="tags-grid">
          {winnerTags.map(tag => {
            const isOwned = ownedTagIds.includes(tag.id);
            return (
              <div key={tag.id} className={`tag-card ${isOwned ? 'owned' : 'locked'}`}>
                <span className="tag-emoji">{tag.emoji}</span>
                <span className="tag-name">{tag.name}</span>
                {!isOwned && <span className="tag-lock">🔒</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
