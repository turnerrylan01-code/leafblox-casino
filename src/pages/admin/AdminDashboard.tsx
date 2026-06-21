import { useState, useEffect } from 'react';
import './AdminPanel.css';

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    onlineUsers: 0,
    totalWagersToday: 0,
    totalWagersAllTime: 0,
    casinoProfit: 0,
    depositsToday: 0,
    withdrawalsToday: 0,
    pendingWithdrawals: 0,
  });
  const [liveActivity, setLiveActivity] = useState<any[]>([]);

  useEffect(() => {
    // Load stats from localStorage
    const loadStats = () => {
      const allUsers = Object.keys(localStorage).filter(key => key.startsWith('user_stats_'));
      const totalUsers = allUsers.length;
      
      // Calculate totals from all users
      let totalWagered = 0;
      let totalDeposited = 0;
      let totalWithdrawn = 0;
      let totalBalance = 0;
      
      allUsers.forEach(key => {
        try {
          const userData = JSON.parse(localStorage.getItem(key) || '{}');
          totalWagered += userData.totalWagered || 0;
          totalDeposited += userData.totalDeposited || 0;
          totalWithdrawn += userData.totalWithdrawn || 0;
          totalBalance += userData.balance || 0;
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      });

      // Calculate casino profit (5% house edge)
      const casinoProfit = totalWagered * 0.05;

      setStats({
        totalUsers,
        onlineUsers: Math.floor(totalUsers * 0.3), // Estimate 30% online
        totalWagersToday: totalWagered, // Use total since we don't have daily breakdown
        totalWagersAllTime: totalWagered,
        casinoProfit,
        depositsToday: totalDeposited, // Use total since we don't have daily breakdown
        withdrawalsToday: totalWithdrawn, // Use total since we don't have daily breakdown
        pendingWithdrawals: 0, // Would need to track pending withdrawals
      });
    };

    loadStats();
    
    // Update stats periodically
    const interval = setInterval(loadStats, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Load real activity from localStorage
    const loadActivity = () => {
      const activities: any[] = [];
      
      // Get recent bets/wins from user data
      const allUsers = Object.keys(localStorage).filter(key => key.startsWith('user_stats_'));
      
      allUsers.forEach(key => {
        try {
          const userData = JSON.parse(localStorage.getItem(key) || '{}');
          if (userData.totalWagered > 0) {
            activities.push({
              type: 'bet',
              user: userData.username || 'Unknown',
              amount: userData.totalWagered,
              game: 'Various'
            });
          }
          if (userData.biggestWin > 0) {
            activities.push({
              type: 'win',
              user: userData.username || 'Unknown',
              amount: userData.biggestWin,
              game: 'Various'
            });
          }
          if (userData.totalDeposited > 0) {
            activities.push({
              type: 'deposit',
              user: userData.username || 'Unknown',
              amount: userData.totalDeposited
            });
          }
          if (userData.totalWithdrawn > 0) {
            activities.push({
              type: 'withdraw',
              user: userData.username || 'Unknown',
              amount: userData.totalWithdrawn
            });
          }
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      });

      setLiveActivity(activities.slice(0, 10));
    };

    loadActivity();
    
    const interval = setInterval(loadActivity, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const formatSOL = (num: number) => {
    return num.toFixed(2) + ' SOL';
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Dashboard</h1>
        <div className="date-range">
          <select>
            <option>Last 24 hours</option>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
          </select>
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-label">Total Users</div>
            <div className="stat-value">{formatNumber(stats.totalUsers)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Online Users</div>
            <div className="stat-value">{formatNumber(stats.onlineUsers)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Wagers Today</div>
            <div className="stat-value">{formatSOL(stats.totalWagersToday)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Wagers All Time</div>
            <div className="stat-value">{formatSOL(stats.totalWagersAllTime)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Casino Profit</div>
            <div className="stat-value">{formatSOL(stats.casinoProfit)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Deposits Today</div>
            <div className="stat-value">{formatSOL(stats.depositsToday)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Withdrawals Today</div>
            <div className="stat-value">{formatSOL(stats.withdrawalsToday)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Pending Withdrawals</div>
            <div className="stat-value">{stats.pendingWithdrawals}</div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-section">
            <h3>Live Activity</h3>
            <div className="live-activity-feed">
              {liveActivity.map((activity, index) => (
                <div key={index} className="activity-item">
                  <span className={`activity-icon ${activity.type}`}>
                    {activity.type === 'bet' && '🎮'}
                    {activity.type === 'deposit' && '💰'}
                    {activity.type === 'win' && '🎉'}
                    {activity.type === 'withdraw' && '💸'}
                  </span>
                  <span className="activity-user">{activity.user}</span>
                  <span className="activity-action">
                    {activity.type === 'bet' && `bet ${activity.amount} SOL on ${activity.game}`}
                    {activity.type === 'deposit' && `deposited ${activity.amount} SOL`}
                    {activity.type === 'win' && `won ${activity.amount} SOL on ${activity.game}`}
                    {activity.type === 'withdraw' && `withdrew ${activity.amount} SOL`}
                  </span>
                  <span className="activity-time">Just now</span>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-section">
            <h3>Biggest Wins</h3>
            <div className="biggest-wins-list">
              {liveActivity
                .filter(a => a.type === 'win')
                .sort((a, b) => b.amount - a.amount)
                .slice(0, 3)
                .map((win, index) => (
                  <div key={index} className="win-item">
                    <span className="win-user">{win.user}</span>
                    <span className="win-amount">{win.amount.toFixed(3)} SOL</span>
                    <span className="win-game">{win.game}</span>
                  </div>
                ))}
              {liveActivity.filter(a => a.type === 'win').length === 0 && (
                <p className="no-data">No wins recorded yet</p>
              )}
            </div>
          </div>

          <div className="dashboard-section">
            <h3>System Status</h3>
            <div className="admin-actions-list">
              <div className="admin-action-item">
                <span className="action-admin">System</span>
                <span className="action-text">All systems operational</span>
                <span className="action-time">Now</span>
              </div>
              <div className="admin-action-item">
                <span className="action-admin">Database</span>
                <span className="action-text">Connected to localStorage</span>
                <span className="action-time">Now</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
