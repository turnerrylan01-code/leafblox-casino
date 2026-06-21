import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { GAMES } from '../data/games';
import './Home.css';

const FULL_IMAGE_GAMES = new Set(['mines', 'latina-tower', 'coinflip', 'crash']);

export function HomePage() {
  const { walletAddress } = useAuth();
  const { username, avatar } = useApp();
  const [userStats, setUserStats] = useState<any>(null);

  useEffect(() => {
    if (walletAddress) {
      import('../lib/auth').then(({ loadStats, statsStorageKey }) => {
        const stats = loadStats(statsStorageKey(walletAddress));
        setUserStats(stats);
      });
    }
  }, [walletAddress]);

  const handleLockShake = (e: React.MouseEvent) => {
    const target = e.currentTarget as HTMLElement;
    target.classList.add('shake');
    setTimeout(() => {
      target.classList.remove('shake');
    }, 500);
  };

  return (
    <div className="home">
      {!walletAddress ? (
        <div className="home-auth-required">
          <div className="auth-required-content">
            <h2>Authentication Required</h2>
            <p>Please connect your wallet using Privy to access the home screen.</p>
            <Link to="/login" className="auth-button">Connect Wallet</Link>
          </div>
        </div>
      ) : (
        <>
          <div className="home-banner">
            <div className="home-banner-user">
              <div className="user-inner">
                <div className="inner-auth auth-blue">
                  <span className="gradient-green">WELCOME BACK,</span>
                  <div className="auth-info">
                    <div className="info-avatar">
                      {userStats?.profilePictureUrl ? (
                        <img src={userStats.profilePictureUrl} alt="Profile" className="profile-picture" />
                      ) : (
                        <div className="avatar-placeholder">{avatar || '🍀'}</div>
                      )}
                    </div>
                    <span>{username || 'User'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="home-games">
            <div className="games-title">ALL GAMES</div>
            <div className="games-grid">
              {GAMES.map((game) => (
                <Link 
                  key={game.id} 
                  to={game.path} 
                  className={`game-box ${game.soon ? 'coming-soon' : ''} ${FULL_IMAGE_GAMES.has(game.id) ? 'game-box-full-image' : ''}`}
                  onClick={(e) => game.soon && e.preventDefault()}
                >
                  <div className="game-box-inner">
                    {game.image ? (
                      <img src={game.image} alt={game.name} className="game-image" />
                    ) : (
                      <div className="game-icon">🎮</div>
                    )}
                    {!FULL_IMAGE_GAMES.has(game.id) && <div className="game-name">{game.name}</div>}
                    {game.soon && <div className="coming-soon-badge">COMING SOON</div>}
                  </div>
                </Link>
              ))}
              <div className="game-box coming-soon" onClick={handleLockShake}>
                <div className="game-box-inner">
                  <div className="game-icon">🔒</div>
                  <div className="game-name">Coming Soon</div>
                  <div className="coming-soon-badge">COMING SOON</div>
                </div>
              </div>
              <div className="game-box coming-soon" onClick={handleLockShake}>
                <div className="game-box-inner">
                  <div className="game-icon">🔒</div>
                  <div className="game-name">Coming Soon</div>
                  <div className="coming-soon-badge">COMING SOON</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}


