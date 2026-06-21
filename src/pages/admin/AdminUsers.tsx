import { useState, useEffect } from 'react';
import './AdminPanel.css';

export function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [balanceAmount, setBalanceAmount] = useState('');

  useEffect(() => {
    loadUsers();
  }, [searchTerm]);

  const loadUsers = () => {
    // Load users from localStorage
    const allUsers = Object.keys(localStorage).filter(key => key.startsWith('endfun_stats_'));
    const usersData = allUsers.map(key => {
      try {
        const userData = JSON.parse(localStorage.getItem(key) || '{}');
        return {
          id: key.replace('endfun_stats_', ''),
          walletAddress: key.replace('endfun_stats_', ''),
          ...userData
        };
      } catch (e) {
        return null;
      }
    }).filter(Boolean);

    // Filter by search term
    const filteredUsers = searchTerm 
      ? usersData.filter((user: any) => 
          user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.walletAddress?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : usersData;

    setUsers(filteredUsers);
  };

  const handleUserClick = (user: any) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleAddBalance = () => {
    if (!selectedUser || !balanceAmount) return;
    
    const amount = parseFloat(balanceAmount);
    if (isNaN(amount) || amount <= 0) return;

    // Update user balance in localStorage
    const userKey = `endfun_stats_${selectedUser.walletAddress}`;
    const userData = JSON.parse(localStorage.getItem(userKey) || '{}');
    userData.balance = (userData.balance || 0) + amount;
    localStorage.setItem(userKey, JSON.stringify(userData));

    // Refresh users list
    loadUsers();
    setBalanceAmount('');
    alert(`Added ${amount} SOL to ${selectedUser.username}`);
  };

  const handleBanUser = () => {
    if (!selectedUser) return;
    
    if (confirm(`Are you sure you want to ban ${selectedUser.username}?`)) {
      // Mark user as banned in localStorage
      const userKey = `endfun_stats_${selectedUser.walletAddress}`;
      const userData = JSON.parse(localStorage.getItem(userKey) || '{}');
      userData.isBanned = true;
      localStorage.setItem(userKey, JSON.stringify(userData));

      // Refresh users list
      loadUsers();
      setShowModal(false);
      alert(`Banned ${selectedUser.username}`);
    }
  };

  const handleMuteUser = () => {
    if (!selectedUser) return;
    
    if (confirm(`Are you sure you want to mute ${selectedUser.username}?`)) {
      // Mark user as muted in localStorage
      const userKey = `endfun_stats_${selectedUser.walletAddress}`;
      const userData = JSON.parse(localStorage.getItem(userKey) || '{}');
      userData.isMuted = true;
      localStorage.setItem(userKey, JSON.stringify(userData));

      // Refresh users list
      loadUsers();
      setShowModal(false);
      alert(`Muted ${selectedUser.username}`);
    }
  };

  const formatWallet = (wallet: string) => {
    if (!wallet) return 'N/A';
    return `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>User Management</h1>
        <div className="admin-actions">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-search"
          />
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-label">Total Users</div>
            <div className="stat-value">{users.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Active Users</div>
            <div className="stat-value">{users.filter((u: any) => !u.isBanned).length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Banned Users</div>
            <div className="stat-value">{users.filter((u: any) => u.isBanned).length}</div>
          </div>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Wallet</th>
                <th>Balance</th>
                <th>Total Wagered</th>
                <th>Level</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.username || 'N/A'}</td>
                  <td className="wallet-cell">{formatWallet(user.walletAddress)}</td>
                  <td>{(user.balance || 0).toFixed(3)} SOL</td>
                  <td>{(user.totalWagered || 0).toFixed(3)} SOL</td>
                  <td>{user.level || 1}</td>
                  <td>
                    <span className={`status-badge ${user.isBanned ? 'banned' : 'active'}`}>
                      {user.isBanned ? 'Banned' : 'Active'}
                    </span>
                  </td>
                  <td>
                    <button className="btn-action btn-view" onClick={() => handleUserClick(user)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>User Profile: {selectedUser.username || 'Unknown'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="user-profile-header">
                <div className="user-avatar-large">{selectedUser.username?.[0]?.toUpperCase() || '?'}</div>
                <div className="user-profile-info">
                  <h3>{selectedUser.username || 'Unknown'}</h3>
                  <span className={`status-badge ${selectedUser.isBanned ? 'banned' : 'active'}`}>
                    {selectedUser.isBanned ? 'Banned' : 'Active'}
                  </span>
                </div>
              </div>

              <div className="user-profile-sections">
                <div className="user-profile-section">
                  <h4>Account Information</h4>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Wallet Address</span>
                      <span className="info-value wallet-full">{selectedUser.walletAddress || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Balance</span>
                      <span className="info-value green">{(selectedUser.balance || 0).toFixed(3)} SOL</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Total Wagered</span>
                      <span className="info-value">{(selectedUser.totalWagered || 0).toFixed(3)} SOL</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Total Deposited</span>
                      <span className="info-value green">{(selectedUser.totalDeposited || 0).toFixed(3)} SOL</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Total Withdrawn</span>
                      <span className="info-value red">{(selectedUser.totalWithdrawn || 0).toFixed(3)} SOL</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Level</span>
                      <span className="info-value">{selectedUser.level || 1}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">XP</span>
                      <span className="info-value">{selectedUser.xp || 0}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Games Played</span>
                      <span className="info-value">{selectedUser.gamesPlayed || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="user-profile-section">
                  <h4>Balance Management</h4>
                  <div className="add-balance-form">
                    <input
                      type="number"
                      placeholder="Amount (SOL)"
                      value={balanceAmount}
                      onChange={(e) => setBalanceAmount(e.target.value)}
                      step="0.001"
                    />
                    <button className="btn-primary" onClick={handleAddBalance}>
                      Add Balance
                    </button>
                  </div>
                </div>

                <div className="user-profile-section">
                  <h4>Account Actions</h4>
                  <div className="action-buttons">
                    <button className="btn-action btn-ban" onClick={handleBanUser}>Ban User</button>
                    <button className="btn-action btn-mute" onClick={handleMuteUser}>Mute User</button>
                    <button className="btn-action btn-edit">Edit Profile</button>
                    <button className="btn-action btn-delete">Delete Account</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
