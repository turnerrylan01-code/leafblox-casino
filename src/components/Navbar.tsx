import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { GAMES } from '../data/games';
import { hasTag } from '../data/tags';
import { SolIcon } from './SolIcon';
import './Navbar.css';

export function Navbar() {
  const {
    balance, setShowDeposit, setShowWithdraw,
    solanaPrice, currency, setShowCurrencyModal,
  } = useApp();
  const { logout, walletAddress, email } = useAuth();
  const [gamesOpen, setGamesOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [sidebarMobile, setSidebarMobile] = useState<'Chat' | 'Navbar' | null>(null);
  const [hoveredGame, setHoveredGame] = useState(GAMES[0].name);
  const [balanceHovered, setBalanceHovered] = useState(false);
  const gamesRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isOwner = walletAddress && hasTag(walletAddress, 'owner', email || undefined);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (gamesRef.current && !gamesRef.current.contains(e.target as Node)) setGamesOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const hovered = GAMES.find(g => g.name === hoveredGame) ?? GAMES[0];

  const handleGameClick = (game: typeof GAMES[number]) => {
    if (game.soon) return;
    setGamesOpen(false);
    navigate(game.path);
  };

  const handleLogout = async () => {
    setProfileOpen(false);
    await logout();
    navigate('/login');
  };

  const getDisplayBalance = () => {
    if (balanceHovered && currency === 'SOL') {
      return `$${(balance * solanaPrice).toFixed(2)}`;
    }
    if (currency === 'USD') {
      return `$${(balance * solanaPrice).toFixed(2)}`;
    }
    return `${balance.toFixed(3)} SOL`;
  };

  return (
    <nav id="navbar">
      <div className="navbar-left">
        <button 
          onClick={() => setSidebarMobile(sidebarMobile === 'Chat' ? null : 'Chat')} 
          className="button-chat"
        >
          <div className="button-inner">
            <span>💬</span>
          </div>
        </button>
        <Link to="/" className="link-logo">
          <span className="logo-ghost">🍀</span>
          <span className="logo-text">Leaf Blox</span>
        </Link>
        <Link to="/" className="link-home">
          <div className="link-inner">
            <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 3.78027L3.15384 10.2486C3.15384 10.2578 3.15155 10.2712 3.14696 10.2895C3.14247 10.3077 3.14008 10.3209 3.14008 10.3302V16.8801C3.14008 17.1166 3.22654 17.3216 3.39941 17.4942C3.57224 17.6668 3.7769 17.7537 4.01344 17.7537H9.25322V12.5137H12.7469V17.7539H17.9866C18.2231 17.7539 18.4281 17.6672 18.6007 17.4942C18.7735 17.3218 18.8603 17.1167 18.8603 16.8801V10.3302C18.8603 10.2939 18.8553 10.2665 18.8465 10.2486L11 3.78027Z" />
              <path d="M21.8482 8.77487L18.86 6.29133V0.723807C18.86 0.596528 18.8191 0.491857 18.737 0.409936C18.6555 0.32811 18.5508 0.287198 18.4233 0.287198H15.8033C15.6759 0.287198 15.5713 0.32811 15.4893 0.409936C15.4075 0.491857 15.3667 0.596576 15.3667 0.723807V3.38471L12.0372 0.600878C11.7464 0.364339 11.4006 0.246094 11.0003 0.246094C10.6 0.246094 10.2543 0.364339 9.96325 0.600878L0.151633 8.77487C0.0606786 8.84751 0.0108283 8.9453 0.00155609 9.06814C-0.00766837 9.19088 0.0241154 9.29808 0.0970029 9.38899L0.943024 10.3988C1.01591 10.4806 1.11131 10.5307 1.2296 10.549C1.33882 10.5582 1.44803 10.5262 1.55724 10.4535L11 2.5796L20.4429 10.4534C20.5158 10.5169 20.6112 10.5486 20.7295 10.5486H20.7705C20.8886 10.5306 20.9838 10.4802 21.0571 10.3986L21.9032 9.38894C21.9759 9.29784 22.0078 9.19083 21.9984 9.06795C21.989 8.94545 21.939 8.84766 21.8482 8.77487Z" />
            </svg>
          </div>
        </Link>
        <div className="navbar-games" ref={gamesRef}>
          <button
            className={`nav-link games-btn ${gamesOpen ? 'active' : ''}`}
            onClick={() => setGamesOpen(!gamesOpen)}
          >
            <span className="nav-icon">🎲</span> GAMES <span className="chevron">▾</span>
          </button>
          {isOwner && (
            <Link to="/admin" className="nav-link admin-btn">
              <span className="nav-icon">⚙️</span> ADMIN
            </Link>
          )}
          {gamesOpen && (
            <div className="games-dropdown">
              <div className="games-list">
                {GAMES.map(game => (
                  <button
                    key={game.id}
                    className={`game-item ${hoveredGame === game.name ? 'hovered' : ''} ${location.pathname === game.path ? 'active' : ''}`}
                    onMouseEnter={() => setHoveredGame(game.name)}
                    onClick={() => handleGameClick(game)}
                  >
                    {game.name}
                    {game.soon && <span className="soon-badge">SOON</span>}
                  </button>
                ))}
              </div>
              <div className="games-preview">
                <div className="preview-image">
                  <div className="preview-glow" />
                  <div className="preview-content">
                    <span className="preview-mult">{hovered.previewMultiplier ?? '2.0x'}</span>
                    <span className="preview-label">{hovered.previewLabel ?? 'POT MULTIPLIER'}</span>
                  </div>
                </div>
                <div className="preview-footer">
                  <span>??</span> Leaf Blox ORIGINALS
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="navbar-mid">
        {!walletAddress ? (
          <button className="auth-button" onClick={() => setShowDeposit(true)}>
            Connect Wallet
          </button>
        ) : (
          <div className="navbar-cashier">
            <div 
              className="balance-display"
              onMouseEnter={() => setBalanceHovered(true)}
              onMouseLeave={() => setBalanceHovered(false)}
              onClick={() => setShowCurrencyModal(true)}
              style={{ cursor: 'pointer' }}
            >
              <SolIcon />
              <span>{getDisplayBalance()}</span>
            </div>
            <button className="btn-secondary nav-withdraw" onClick={() => setShowWithdraw(true)}>
              Withdraw
            </button>
            <button className="btn-primary nav-deposit" onClick={() => setShowDeposit(true)}>
              Deposit
            </button>
          </div>
        )}
      </div>

      <div className="navbar-center">
        <div className="social-links">
          <a href="https://x.com/memecoindev69" target="_blank" rel="noopener noreferrer" className="social-link">
            <span>𝕏</span>
          </a>
          <a href="https://discord.gg/drNBRtKyTJ" target="_blank" rel="noopener noreferrer" className="social-link">
            <span>💬</span>
          </a>
          <a href="https://leafblox.online" target="_blank" rel="noopener noreferrer" className="social-link">
            <span>✈️</span>
          </a>
        </div>
      </div>

      <div className="navbar-right">
        {!walletAddress ? (
          <button className="auth-button" onClick={() => setShowDeposit(true)}>
            Connect Wallet
          </button>
        ) : (
          <div className="right-auth">
            <div className="profile-menu" ref={profileRef}>
              <button className="profile-avatar" onClick={() => setProfileOpen(!profileOpen)}>
                <div className="avatar-placeholder">🍀</div>
              </button>
              {profileOpen && (
                <div className="profile-dropdown">
                  <Link to="/profile" onClick={() => setProfileOpen(false)}>Profile</Link>
                  <Link to="/fairness" onClick={() => setProfileOpen(false)}>Fairness</Link>
                  <button type="button" onClick={handleLogout}>Log Out</button>
                </div>
              )}
            </div>
          </div>
        )}
        <button 
          onClick={() => setSidebarMobile(sidebarMobile === 'Navbar' ? null : 'Navbar')} 
          className="button-toggle"
        >
          <div className="button-inner">
            <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="-0.000976562" y="0.889648" width="12.0008" height="1.62403" />
              <rect x="-0.000976562" y="4.1377" width="12.0008" height="1.62403" />
              <rect x="-0.000976562" y="7.38574" width="12.0008" height="1.62403" />
            </svg>
          </div>
        </button>
      </div>

      <div className={`navbar-mobile ${sidebarMobile === 'Navbar' ? 'mobile-open' : ''}`}>
        <Link onClick={() => setSidebarMobile(null)} to="/">
          <span>🏠</span>
          <span className="text-green-gradient-exact">Home</span>
        </Link>
        {walletAddress && (
          <div className="mobile-user">
            <Link onClick={() => setSidebarMobile(null)} to="/profile">
              <span>👤</span>
              Profile
            </Link>
            <Link onClick={() => setSidebarMobile(null)} to="/rewards">
              <span>🎁</span>
              Rewards
            </Link>
            <Link onClick={() => setSidebarMobile(null)} to="/leaderboard">
              <span>🏆</span>
              <span className="text-green-gradient-exact">Leaderboard</span>
            </Link>
            {isOwner && (
              <Link onClick={() => setSidebarMobile(null)} to="/admin">
                <span>⚙️</span>
                Admin
              </Link>
            )}
            <button onClick={handleLogout}>
              <span>🚪</span>
              Sign Out
            </button>
          </div>
        )}
        <div className="mobile-games">
          ALL GAMES
          {GAMES.map(game => (
            <Link 
              key={game.id}
              onClick={() => setSidebarMobile(null)} 
              to={game.path}
              className={location.pathname === game.path ? 'router-link-exact-active' : ''}
            >
              <span>🎲</span>
              <span className="text-green-gradient-exact">{game.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}


