import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { hasTag } from '../../data/tags';
import './AdminPanel.css';

export function AdminLevelManager() {
  const { walletAddress } = useAuth();
  const [isOwner, setIsOwner] = useState(false);
  
  // Simple levels configuration
  const [levels, setLevels] = useState([
    { id: 1, name: 'Bronze', emoji: '🥉', xp: 0, rewardMultiplier: 1.0, dailyBonus: 0 },
    { id: 2, name: 'Silver', emoji: '🥈', xp: 100, rewardMultiplier: 1.1, dailyBonus: 0.01 },
    { id: 3, name: 'Gold', emoji: '🥇', xp: 500, rewardMultiplier: 1.2, dailyBonus: 0.05 },
    { id: 4, name: 'Platinum', emoji: '💎', xp: 2000, rewardMultiplier: 1.3, dailyBonus: 0.1 },
    { id: 5, name: 'Diamond', emoji: '💠', xp: 10000, rewardMultiplier: 1.5, dailyBonus: 0.25 },
  ]);
  
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  useEffect(() => {
    // Check if user has Owner role
    if (walletAddress && hasTag(walletAddress, 'owner')) {
      setIsOwner(true);
    } else {
      setIsOwner(false);
    }
  }, [walletAddress]);

  if (!isOwner) {
    return (
      <div className="admin-page">
        <div className="access-denied">
          <div className="access-icon">🔒</div>
          <h1>Access Denied</h1>
          <p>You must have the Owner role to access the Level Manager.</p>
        </div>
      </div>
    );
  }

  const handleLevelUpdate = (levelIndex: number, field: string, value: any) => {
    const updatedLevels = [...levels];
    updatedLevels[levelIndex] = { ...updatedLevels[levelIndex], [field]: value };
    setLevels(updatedLevels);
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Level Manager (Owner Only)</h1>
      </div>

      <div className="admin-content">
        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-label">Total Levels</div>
            <div className="stat-value">{levels.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Max XP Required</div>
            <div className="stat-value">{levels[levels.length - 1]?.xp.toLocaleString() || '0'}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Current Players</div>
            <div className="stat-value">0</div>
          </div>
        </div>

        <div className="levels-grid">
          {levels.map((level, index) => (
            <div 
              key={index} 
              className={`level-card ${selectedLevel === index ? 'selected' : ''}`}
              onClick={() => setSelectedLevel(index)}
            >
              <div className="level-header">
                <span className="level-emoji">{level.emoji}</span>
                <h3>{level.name}</h3>
              </div>
              
              <div className="level-details">
                <div className="level-detail">
                  <span className="detail-label">XP Required:</span>
                  <span className="detail-value">{level.xp.toLocaleString()}</span>
                </div>
                <div className="level-detail">
                  <span className="detail-label">Reward Multiplier:</span>
                  <span className="detail-value">{level.rewardMultiplier || '1.0x'}</span>
                </div>
                <div className="level-detail">
                  <span className="detail-label">Daily Bonus:</span>
                  <span className="detail-value">{level.dailyBonus || '0 SOL'}</span>
                </div>
              </div>

              <div className="level-actions">
                <button 
                  className="btn-action btn-edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedLevel(index);
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedLevel !== null && (
          <div className="level-editor">
            <h3>Edit {levels[selectedLevel].name}</h3>
            <div className="editor-form">
              <div className="form-group">
                <label>XP Required</label>
                <input
                  type="number"
                  value={levels[selectedLevel].xp}
                  onChange={(e) => handleLevelUpdate(selectedLevel, 'xp', parseInt(e.target.value))}
                />
              </div>
              <div className="form-group">
                <label>Reward Multiplier</label>
                <input
                  type="number"
                  step="0.1"
                  value={levels[selectedLevel].rewardMultiplier || 1.0}
                  onChange={(e) => handleLevelUpdate(selectedLevel, 'rewardMultiplier', parseFloat(e.target.value))}
                />
              </div>
              <div className="form-group">
                <label>Daily Bonus (SOL)</label>
                <input
                  type="number"
                  step="0.01"
                  value={levels[selectedLevel].dailyBonus || 0}
                  onChange={(e) => handleLevelUpdate(selectedLevel, 'dailyBonus', parseFloat(e.target.value))}
                />
              </div>
              <div className="form-actions">
                <button className="btn-primary">Save Changes</button>
                <button className="btn-secondary" onClick={() => setSelectedLevel(null)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
