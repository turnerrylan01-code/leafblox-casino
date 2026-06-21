import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { hasTag } from '../data/tags';
import { LEVELS, loadStats, saveStats, statsStorageKey } from '../lib/auth';
import './LevelAdmin.css';

export function LevelAdminPage() {
  const { walletAddress } = useAuth();
  const [targetWallet, setTargetWallet] = useState('');
  const [selectedLevel, setSelectedLevel] = useState(LEVELS[0].name);
  const [message, setMessage] = useState('');
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (walletAddress) {
      setIsOwner(hasTag(walletAddress, 'owner'));
    }
  }, [walletAddress]);

  const handleSetLevel = () => {
    if (!targetWallet.trim()) {
      setMessage('Please enter a wallet address');
      return;
    }

    try {
      const stats = loadStats(statsStorageKey(targetWallet));
      const level = LEVELS.find(l => l.name === selectedLevel);
      
      if (level) {
        stats.xp = level.xpRequired;
        stats.level = level.xpRequired;
        saveStats(statsStorageKey(targetWallet), stats);
        setMessage(`Successfully set ${targetWallet} to ${selectedLevel} (${level.xpRequired.toLocaleString()} XP)`);
        setTargetWallet('');
      } else {
        setMessage('Invalid level selected');
      }
    } catch (error) {
      console.error('Error setting level:', error);
      setMessage('Failed to set level. Please check the wallet address.');
    }
  };

  if (!isOwner) {
    return (
      <div className="level-admin">
        <div className="admin-denied">
          <h2>Access Denied</h2>
          <p>You need the Owner tag to access this panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="level-admin">
      <div className="admin-container">
        <h2>Level Management</h2>
        <p className="admin-description">Set user levels by wallet address</p>
        
        <div className="admin-form">
          <div className="form-group">
            <label>Target Wallet Address</label>
            <input
              type="text"
              value={targetWallet}
              onChange={(e) => setTargetWallet(e.target.value)}
              placeholder="Enter Solana wallet address"
            />
          </div>
          
          <div className="form-group">
            <label>Select Level</label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
            >
              {LEVELS.map((level) => (
                <option key={level.name} value={level.name}>
                  {level.emoji} {level.name} ({level.xpRequired.toLocaleString()} XP)
                </option>
              ))}
            </select>
          </div>
          
          <button className="admin-button" onClick={handleSetLevel}>
            Set Level
          </button>
        </div>
        
        {message && (
          <div className={`admin-message ${message.includes('Successfully') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
        
        <div className="admin-info">
          <h3>Level Requirements</h3>
          <div className="level-list">
            {LEVELS.map((level) => (
              <div key={level.name} className="level-item">
                <span className="level-emoji">{level.emoji}</span>
                <span className="level-name">{level.name}</span>
                <span className="level-xp">{level.xpRequired.toLocaleString()} XP</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
