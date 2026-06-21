import { useState, useEffect } from 'react';
import './AdminPanel.css';

export function AdminDeposits() {
  const [deposits, setDeposits] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadDeposits();
  }, [searchTerm]);

  const loadDeposits = () => {
    // Load real deposit data from localStorage
    const allUsers = Object.keys(localStorage).filter(key => key.startsWith('endfun_stats_'));
    const depositsData: any[] = [];

    allUsers.forEach(key => {
      try {
        const userData = JSON.parse(localStorage.getItem(key) || '{}');
        if (userData.totalDeposited > 0) {
          depositsData.push({
            id: key.replace('endfun_stats_', ''),
            user: userData.username || 'Unknown',
            amount: userData.totalDeposited,
            txid: key.replace('endfun_stats_', ''),
            status: 'completed',
            date: new Date().toISOString().split('T')[0]
          });
        }
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    });

    setDeposits(depositsData);
  };

  const filteredDeposits = deposits.filter(deposit =>
    deposit.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deposit.txid?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Deposits Management</h1>
        <div className="admin-actions">
          <input
            type="text"
            placeholder="Search deposits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-search"
          />
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-label">Total Deposits</div>
            <div className="stat-value">{deposits.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Volume</div>
            <div className="stat-value">{deposits.reduce((sum, d) => sum + d.amount, 0).toFixed(2)} SOL</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Pending</div>
            <div className="stat-value">{deposits.filter(d => d.status === 'pending').length}</div>
          </div>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Amount (SOL)</th>
                <th>TxID</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeposits.map((deposit) => (
                <tr key={deposit.id}>
                  <td>#{deposit.id}</td>
                  <td>{deposit.user}</td>
                  <td>{deposit.amount.toFixed(3)}</td>
                  <td className="txid">{deposit.txid}</td>
                  <td>
                    <span className={`status-badge ${deposit.status}`}>
                      {deposit.status}
                    </span>
                  </td>
                  <td>{deposit.date}</td>
                  <td>
                    <button className="btn-action btn-view">View</button>
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
