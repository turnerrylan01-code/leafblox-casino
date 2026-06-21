import { useState, useEffect } from 'react';
import './AdminPanel.css';

export function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadWithdrawals();
  }, [searchTerm]);

  const loadWithdrawals = () => {
    // Load real withdrawal data from localStorage
    const allUsers = Object.keys(localStorage).filter(key => key.startsWith('endfun_stats_'));
    const withdrawalsData: any[] = [];

    allUsers.forEach(key => {
      try {
        const userData = JSON.parse(localStorage.getItem(key) || '{}');
        if (userData.totalWithdrawn > 0) {
          withdrawalsData.push({
            id: key.replace('endfun_stats_', ''),
            user: userData.username || 'Unknown',
            amount: userData.totalWithdrawn,
            address: key.replace('endfun_stats_', ''),
            status: 'completed',
            date: new Date().toISOString().split('T')[0]
          });
        }
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    });

    setWithdrawals(withdrawalsData);
  };

  const filteredWithdrawals = withdrawals.filter(withdrawal =>
    withdrawal.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    withdrawal.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = (id: number) => {
    setWithdrawals(withdrawals.map(w => 
      w.id === id ? { ...w, status: 'completed' } : w
    ));
  };

  const handleReject = (id: number) => {
    setWithdrawals(withdrawals.map(w => 
      w.id === id ? { ...w, status: 'rejected' } : w
    ));
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Withdrawals Management</h1>
        <div className="admin-actions">
          <input
            type="text"
            placeholder="Search withdrawals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-search"
          />
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-label">Total Withdrawals</div>
            <div className="stat-value">{withdrawals.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Pending</div>
            <div className="stat-value">{withdrawals.filter(w => w.status === 'pending').length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Volume</div>
            <div className="stat-value">{withdrawals.reduce((sum, w) => sum + w.amount, 0).toFixed(2)} SOL</div>
          </div>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Amount (SOL)</th>
                <th>Wallet Address</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWithdrawals.map((withdrawal) => (
                <tr key={withdrawal.id}>
                  <td>#{withdrawal.id}</td>
                  <td>{withdrawal.user}</td>
                  <td>{withdrawal.amount.toFixed(3)}</td>
                  <td className="address">{withdrawal.address}</td>
                  <td>
                    <span className={`status-badge ${withdrawal.status}`}>
                      {withdrawal.status}
                    </span>
                  </td>
                  <td>{withdrawal.date}</td>
                  <td>
                    {withdrawal.status === 'pending' && (
                      <>
                        <button 
                          className="btn-action btn-approve"
                          onClick={() => handleApprove(withdrawal.id)}
                        >
                          Approve
                        </button>
                        <button 
                          className="btn-action btn-reject"
                          onClick={() => handleReject(withdrawal.id)}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {withdrawal.status !== 'pending' && (
                      <span className="action-complete">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
