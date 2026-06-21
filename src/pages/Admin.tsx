import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserTags, hasTag } from '../data/tags';
import './Admin.css';

const ADMIN_SECTIONS = [
  { id: 'dashboard', label: 'Dashboard', path: '/admin', icon: '📊' },
  { id: 'users', label: 'Users', path: '/admin/users', icon: '👥' },
  { id: 'deposits', label: 'Deposits', path: '/admin/deposits', icon: '💰' },
  { id: 'withdrawals', label: 'Withdrawals', path: '/admin/withdrawals', icon: '💸' },
  { id: 'games', label: 'Games', path: '/admin/games', icon: '🎮' },
  { id: 'bonuses', label: 'Bonuses', path: '/admin/bonuses', icon: '🎁' },
  { id: 'vip', label: 'VIP', path: '/admin/vip', icon: '👑' },
  { id: 'chat', label: 'Chat', path: '/admin/chat', icon: '💬' },
  { id: 'support', label: 'Support', path: '/admin/support', icon: '🎫' },
  { id: 'analytics', label: 'Analytics', path: '/admin/analytics', icon: '📈' },
  { id: 'security', label: 'Security', path: '/admin/security', icon: '🔒' },
  { id: 'settings', label: 'Settings', path: '/admin/settings', icon: '⚙️' },
];

const OWNER_ONLY_SECTIONS = [
  { id: 'level-manager', label: 'Level Manager', path: '/admin/level-manager', icon: '⭐' },
];

export function AdminPage() {
  const { walletAddress, email } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const userTags = getUserTags(walletAddress || '', email || undefined);
  const isAdmin = userTags.includes('owner') || userTags.includes('dev');
  const isOwner = hasTag(walletAddress || '', 'owner', email || undefined);

  if (!isAdmin) {
    return (
      <div className="admin-access-denied">
        <div className="access-denied-content">
          <span className="lock-icon">🔒</span>
          <h1>Access Denied</h1>
          <p>You don't have permission to access the admin panel.</p>
        </div>
      </div>
    );
  }

  const allSections = isOwner ? [...ADMIN_SECTIONS, ...OWNER_ONLY_SECTIONS] : ADMIN_SECTIONS;

  const getCurrentSection = () => {
    const path = location.pathname;
    const section = allSections.find(s => path.startsWith(s.path));
    return section?.label || 'Dashboard';
  };

  const handleSectionClick = (path: string) => {
    setDropdownOpen(false);
    navigate(path);
  };

  return (
    <div className="admin">
      <div className="admin-container">
        <div className="container-header">
          <Link to="/admin" className="header-title text-green-gradient">ADMIN PANEL</Link>
          <div className="admin-filter-navbar">
            <button
              className={`button-toggle ${dropdownOpen ? 'navbar-open' : ''}`}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="button-value">{getCurrentSection()}</div>
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.5176 1.66411e-06L0.482354 8.43375e-08C0.0547936 9.58042e-09 -0.16302 0.516304 0.143533 0.822859L4.66115 5.34052C4.8467 5.52607 5.15325 5.52607 5.33888 5.34052L9.8565 0.822861C10.163 0.516306 9.94516 1.73887e-06 9.5176 1.66411e-06Z" />
              </svg>
            </button>
            {dropdownOpen && (
              <div className="navbar-menu">
                <div className="menu-inner">
                  {allSections.map(section => (
                    <button
                      key={section.id}
                      className="menu-item"
                      onClick={() => handleSectionClick(section.path)}
                    >
                      <span className="menu-icon">{section.icon}</span>
                      {section.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="container-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
