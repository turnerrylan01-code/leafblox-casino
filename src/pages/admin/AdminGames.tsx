import { useState, useEffect } from 'react';
import './AdminPanel.css';

export function AdminGames() {
  const [games, setGames] = useState<any[]>([]);

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = () => {
    // Load real game statistics from localStorage
    const allUsers = Object.keys(localStorage).filter(key => key.startsWith('endfun_stats_'));
    
    // Initialize game stats
    const gameStats: any = {
      mines: { totalWagers: 0, houseProfit: 0, gamePnL: 0 },
      'latina-tower': { totalWagers: 0, houseProfit: 0, gamePnL: 0 },
      coinflip: { totalWagers: 0, houseProfit: 0, gamePnL: 0 },
      crash: { totalWagers: 0, houseProfit: 0, gamePnL: 0 },
    };

    // Calculate stats from all users
    allUsers.forEach(key => {
      try {
        const userData = JSON.parse(localStorage.getItem(key) || '{}');
        if (userData.gamePnL) {
          Object.keys(gameStats).forEach(game => {
            if (userData.gamePnL[game]) {
              gameStats[game].totalWagers += Math.abs(userData.gamePnL[game]);
              gameStats[game].gamePnL += userData.gamePnL[game];
            }
          });
        }
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    });

    // Calculate house profit (negative gamePnL = house profit)
    Object.keys(gameStats).forEach(game => {
      gameStats[game].houseProfit = Math.abs(gameStats[game].gamePnL * 0.05); // 5% house edge
    });

    // Load game configuration from localStorage or use defaults
    const gamesConfig = JSON.parse(localStorage.getItem('games_config') || '{}');
    
    const gamesData = [
      { 
        id: 'mines', 
        name: 'Mines', 
        enabled: gamesConfig.mines?.enabled ?? true, 
        maintenance: gamesConfig.mines?.maintenance ?? false, 
        minBet: gamesConfig.mines?.minBet ?? 0.1, 
        maxBet: gamesConfig.mines?.maxBet ?? 100, 
        rtp: gamesConfig.mines?.rtp ?? 95,
        totalWagers: gameStats.mines.totalWagers,
        houseProfit: gameStats.mines.houseProfit
      },
      { 
        id: 'latina-tower', 
        name: 'Latina Tower', 
        enabled: gamesConfig['latina-tower']?.enabled ?? true, 
        maintenance: gamesConfig['latina-tower']?.maintenance ?? false, 
        minBet: gamesConfig['latina-tower']?.minBet ?? 0.1, 
        maxBet: gamesConfig['latina-tower']?.maxBet ?? 100, 
        rtp: gamesConfig['latina-tower']?.rtp ?? 94,
        totalWagers: gameStats['latina-tower'].totalWagers,
        houseProfit: gameStats['latina-tower'].houseProfit
      },
      { 
        id: 'coinflip', 
        name: 'Coin Flip', 
        enabled: gamesConfig.coinflip?.enabled ?? true, 
        maintenance: gamesConfig.coinflip?.maintenance ?? false, 
        minBet: gamesConfig.coinflip?.minBet ?? 0.01, 
        maxBet: gamesConfig.coinflip?.maxBet ?? 50, 
        rtp: gamesConfig.coinflip?.rtp ?? 98,
        totalWagers: gameStats.coinflip.totalWagers,
        houseProfit: gameStats.coinflip.houseProfit
      },
      { 
        id: 'crash', 
        name: 'Crash', 
        enabled: gamesConfig.crash?.enabled ?? false, 
        maintenance: gamesConfig.crash?.maintenance ?? true, 
        minBet: gamesConfig.crash?.minBet ?? 0.1, 
        maxBet: gamesConfig.crash?.maxBet ?? 100, 
        rtp: gamesConfig.crash?.rtp ?? 96,
        totalWagers: gameStats.crash.totalWagers,
        houseProfit: gameStats.crash.houseProfit
      },
    ];
    
    setGames(gamesData);
  };

  const toggleGame = (id: string) => {
    setGames(games.map(g => 
      g.id === id ? { ...g, enabled: !g.enabled } : g
    ));
  };

  const toggleMaintenance = (id: string) => {
    setGames(games.map(g => 
      g.id === id ? { ...g, maintenance: !g.maintenance } : g
    ));
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Games Management</h1>
      </div>

      <div className="admin-content">
        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-label">Active Games</div>
            <div className="stat-value">{games.filter(g => g.enabled).length}/{games.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Wagers</div>
            <div className="stat-value">{games.reduce((sum, g) => sum + g.totalWagers, 0).toLocaleString()}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">House Profit</div>
            <div className="stat-value">{games.reduce((sum, g) => sum + g.houseProfit, 0).toLocaleString()} SOL</div>
          </div>
        </div>

        <div className="games-grid">
          {games.map((game) => (
            <div key={game.id} className="game-card">
              <div className="game-header">
                <h3>{game.name}</h3>
                <div className="game-status">
                  <span className={`status-indicator ${game.enabled ? 'enabled' : 'disabled'}`}>
                    {game.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                  {game.maintenance && (
                    <span className="maintenance-badge">Maintenance</span>
                  )}
                </div>
              </div>
              
              <div className="game-stats">
                <div className="game-stat">
                  <span className="stat-label">Min Bet:</span>
                  <span className="stat-value">{game.minBet} SOL</span>
                </div>
                <div className="game-stat">
                  <span className="stat-label">Max Bet:</span>
                  <span className="stat-value">{game.maxBet} SOL</span>
                </div>
                <div className="game-stat">
                  <span className="stat-label">RTP:</span>
                  <span className="stat-value">{game.rtp}%</span>
                </div>
                <div className="game-stat">
                  <span className="stat-label">Total Wagers:</span>
                  <span className="stat-value">{game.totalWagers.toLocaleString()}</span>
                </div>
                <div className="game-stat">
                  <span className="stat-label">House Profit:</span>
                  <span className="stat-value">{game.houseProfit.toLocaleString()} SOL</span>
                </div>
              </div>

              <div className="game-actions">
                <button 
                  className={`btn-action ${game.enabled ? 'btn-disable' : 'btn-enable'}`}
                  onClick={() => toggleGame(game.id)}
                >
                  {game.enabled ? 'Disable' : 'Enable'}
                </button>
                <button 
                  className={`btn-action ${game.maintenance ? 'btn-end-maintenance' : 'btn-start-maintenance'}`}
                  onClick={() => toggleMaintenance(game.id)}
                >
                  {game.maintenance ? 'End Maintenance' : 'Start Maintenance'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
