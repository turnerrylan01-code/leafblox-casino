import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { saveStats, loadStats, statsStorageKey, getLevelFromXP, LEVELS } from '../lib/auth';
import './Profile.css';

export function ProfilePage() {
  const { logout, walletAddress } = useAuth();
  const { 
    username, 
    balance, 
    totalWagered, 
    totalDeposited, 
    totalWithdrawn, 
    level, 
    xp, 
    setUsername,
    setAvatar,
    avatar
  } = useApp();
  const [activeTab, setActiveTab] = useState<'wagered' | 'stats' | 'settings'>('wagered');
  const [editUsername, setEditUsername] = useState(username);
  const [editAvatar, setEditAvatar] = useState(avatar);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [currentLevel, setCurrentLevel] = useState(getLevelFromXP(0));
  const [userStats, setUserStats] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (walletAddress) {
      const stats = loadStats(statsStorageKey(walletAddress));
      setCurrentLevel(getLevelFromXP(stats.xp));
      setUserStats(stats);
    }
  }, [walletAddress, xp]);

  const totalProfit = totalWithdrawn - totalDeposited;
  
  // Calculate progress to next level
  const currentLevelIndex = LEVELS.findIndex(l => l.name === currentLevel.name);
  const nextLevel = currentLevelIndex < LEVELS.length - 1 ? LEVELS[currentLevelIndex + 1] : null;
  const progressToNext = nextLevel ? ((xp - currentLevel.xpRequired) / (nextLevel.xpRequired - currentLevel.xpRequired)) * 100 : 100;
  const xpNeeded = nextLevel ? nextLevel.xpRequired - xp : 0;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSaveSettings = () => {
    setUsername(editUsername);
    setAvatar(editAvatar);
    
    if (walletAddress) {
      const stats = loadStats(statsStorageKey(walletAddress));
      
      if (profilePictureFile) {
        const reader = new FileReader();
        reader.onloadend = () => {
          stats.profilePictureUrl = reader.result as string;
          saveStats(statsStorageKey(walletAddress), stats);
        };
        reader.readAsDataURL(profilePictureFile);
      }
      
      alert('Settings saved successfully!');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePictureFile(file);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'wagered':
        return (
          <div className="profile-section">
            <h3>Wagered</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Total Wagered</div>
                <div className="stat-value">{totalWagered.toFixed(3)} SOL</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Current Balance</div>
                <div className="stat-value">{balance.toFixed(3)} SOL</div>
              </div>
            </div>
          </div>
        );
      case 'stats':
        return (
          <div className="profile-section">
            <h3>Stats (SOL)</h3>
            <div className="stats-grid">
              <div className={`stat-card ${totalProfit >= 0 ? 'positive' : 'negative'}`}>
                <div className="stat-label">Total Profit</div>
                <div className="stat-value">{totalProfit.toFixed(3)} SOL</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Total Deposited</div>
                <div className="stat-value">{totalDeposited.toFixed(3)} SOL</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Total Withdrawn</div>
                <div className="stat-value">{totalWithdrawn.toFixed(3)} SOL</div>
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="profile-section">
            <h3>Settings</h3>
            <div className="settings-form">
              <div className="form-group">
                <label>Username</label>
                <input 
                  type="text" 
                  value={editUsername} 
                  onChange={(e) => setEditUsername(e.target.value)}
                  placeholder="Enter username"
                />
              </div>
              <div className="form-group">
                <label>Profile Picture (Emoji)</label>
                <input 
                  type="text" 
                  value={editAvatar} 
                  onChange={(e) => setEditAvatar(e.target.value)}
                  placeholder="Enter emoji"
                  maxLength={2}
                />
              </div>
              <div className="form-group">
                <label>Profile Picture Upload</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              <button className="save-button" onClick={handleSaveSettings}>
                Save Settings
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="profile">
      <div className="profile-container">
        <div className="profile-header">
          <div className="header-user">
            <div className="user-avatar">
              {userStats?.profilePictureUrl ? (
                <img src={userStats.profilePictureUrl} alt="Profile" className="profile-picture" />
              ) : (
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=leafblox" alt="Default Avatar" className="profile-picture" />
              )}
            </div>
            <div className="user-info">
              <div className="info-username">
                <span>{username || 'User'}</span>
              </div>
              <div className="info-level">
                {currentLevel.emoji} {currentLevel.name}
              </div>
            </div>
          </div>
          <div className="header-level">
            <div className="level-box">
              <div className="box-inner">{currentLevel.emoji}</div>
            </div>
            <div className="level-info">
              <div className="level-name">{currentLevel.name}</div>
              <div className="level-xp">{xp.toLocaleString()} XP</div>
              {nextLevel ? (
                <div className="progress-text">
                  <span>{xpNeeded.toLocaleString()} XP needed for {nextLevel.name}</span>
                </div>
              ) : (
                <div className="progress-text">
                  <span>MAX LEVEL REACHED!</span>
                </div>
              )}
              {nextLevel ? (
                <div className="level-progress">
                  <div className="progress-bar" style={{ width: `${progressToNext}%` }}></div>
                </div>
              ) : (
                <div className="level-progress">
                  <div className="progress-bar" style={{ width: '100%' }}></div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="profile-tabs">
          <button 
            className={`tab-button ${activeTab === 'wagered' ? 'active' : ''}`}
            onClick={() => setActiveTab('wagered')}
          >
            Wagered
          </button>
          <button 
            className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            Stats
          </button>
          <button 
            className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
          <button className="tab-button logout_button" onClick={handleLogout}>
            Log Out
          </button>
        </div>

        <div className="profile-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}


