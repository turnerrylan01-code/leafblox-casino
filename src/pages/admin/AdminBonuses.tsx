import { useState, useEffect } from 'react';
import './AdminPanel.css';

export function AdminBonuses() {
  const [bonuses, setBonuses] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadBonuses();
  }, []);

  const loadBonuses = () => {
    // Load real bonuses from localStorage
    const storedBonuses = JSON.parse(localStorage.getItem('bonuses_config') || '[]');
    
    // If no bonuses exist, create default ones
    if (storedBonuses.length === 0) {
      const defaultBonuses = [
        { id: 1, name: 'Welcome Bonus', type: 'deposit', amount: 0.5, status: 'active', users: 0 },
        { id: 2, name: 'Weekly Rain', type: 'rain', amount: 1.0, status: 'active', users: 0 },
        { id: 3, name: 'VIP Bonus', type: 'vip', amount: 2.0, status: 'paused', users: 0 },
      ];
      localStorage.setItem('bonuses_config', JSON.stringify(defaultBonuses));
      setBonuses(defaultBonuses);
    } else {
      setBonuses(storedBonuses);
    }
  };

  const toggleBonusStatus = (id: number) => {
    setBonuses(bonuses.map(b => 
      b.id === id ? { ...b, status: b.status === 'active' ? 'paused' : 'active' } : b
    ));
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Bonus System</h1>
        <button 
          className="btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          Create Bonus
        </button>
      </div>

      <div className="admin-content">
        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-label">Active Bonuses</div>
            <div className="stat-value">{bonuses.filter(b => b.status === 'active').length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Distributed</div>
            <div className="stat-value">{bonuses.reduce((sum, b) => sum + (b.amount * b.users), 0).toFixed(2)} SOL</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Users</div>
            <div className="stat-value">{bonuses.reduce((sum, b) => sum + b.users, 0)}</div>
          </div>
        </div>

        <div className="bonuses-grid">
          {bonuses.map((bonus) => (
            <div key={bonus.id} className="bonus-card">
              <div className="bonus-header">
                <h3>{bonus.name}</h3>
                <span className={`status-badge ${bonus.status}`}>
                  {bonus.status}
                </span>
              </div>
              
              <div className="bonus-details">
                <div className="bonus-detail">
                  <span className="detail-label">Type:</span>
                  <span className="detail-value">{bonus.type}</span>
                </div>
                <div className="bonus-detail">
                  <span className="detail-label">Amount:</span>
                  <span className="detail-value">{bonus.amount} SOL</span>
                </div>
                <div className="bonus-detail">
                  <span className="detail-label">Users:</span>
                  <span className="detail-value">{bonus.users}</span>
                </div>
              </div>

              <div className="bonus-actions">
                <button 
                  className={`btn-action ${bonus.status === 'active' ? 'btn-pause' : 'btn-activate'}`}
                  onClick={() => toggleBonusStatus(bonus.id)}
                >
                  {bonus.status === 'active' ? 'Pause' : 'Activate'}
                </button>
                <button className="btn-action btn-edit">Edit</button>
                <button className="btn-action btn-delete">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Bonus</h2>
              <button className="modal-close" onClick={() => setShowCreateModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Bonus Name</label>
                <input type="text" placeholder="Enter bonus name" />
              </div>
              <div className="form-group">
                <label>Bonus Type</label>
                <select>
                  <option value="deposit">Deposit Bonus</option>
                  <option value="rain">Rain Bonus</option>
                  <option value="vip">VIP Bonus</option>
                  <option value="referral">Referral Bonus</option>
                </select>
              </div>
              <div className="form-group">
                <label>Amount (SOL)</label>
                <input type="number" step="0.01" placeholder="0.00" />
              </div>
              <div className="form-actions">
                <button className="btn-primary">Create Bonus</button>
                <button className="btn-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
