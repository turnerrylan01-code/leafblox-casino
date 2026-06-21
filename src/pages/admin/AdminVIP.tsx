import { useState, useEffect } from 'react';
import './AdminPanel.css';

export function AdminVIP() {
  const [vipTiers, setVipTiers] = useState<any[]>([]);

  useEffect(() => {
    loadVipTiers();
  }, []);

  const loadVipTiers = () => {
    // Load real VIP tiers from localStorage
    const storedVipTiers = JSON.parse(localStorage.getItem('vip_tiers_config') || '[]');
    
    // If no VIP tiers exist, create default ones
    if (storedVipTiers.length === 0) {
      const defaultVipTiers = [
        { 
          id: 1, 
          name: 'Bronze', 
          color: '#cd7f32', 
          xpRequired: 5000, 
          dailyBonus: 0.01, 
          weeklyBonus: 0.05, 
          monthlyBonus: 0.2,
          rakeback: 2,
          cashback: 1,
          members: 0
        },
        { 
          id: 2, 
          name: 'Silver', 
          color: '#c0c0c0', 
          xpRequired: 25000, 
          dailyBonus: 0.05, 
          weeklyBonus: 0.25, 
          monthlyBonus: 1.0,
          rakeback: 5,
          cashback: 2,
          members: 0
        },
        { 
          id: 3, 
          name: 'Gold', 
          color: '#ffd700', 
          xpRequired: 100000, 
          dailyBonus: 0.1, 
          weeklyBonus: 0.5, 
          monthlyBonus: 2.0,
          rakeback: 8,
          cashback: 3,
          members: 0
        },
        { 
          id: 4, 
          name: 'Platinum', 
          color: '#e5e4e2', 
          xpRequired: 500000, 
          dailyBonus: 0.25, 
          weeklyBonus: 1.0, 
          monthlyBonus: 5.0,
          rakeback: 12,
          cashback: 5,
          members: 0
        },
        { 
          id: 5, 
          name: 'Diamond', 
          color: '#b9f2ff', 
          xpRequired: 2000000, 
          dailyBonus: 0.5, 
          weeklyBonus: 2.5, 
          monthlyBonus: 10.0,
          rakeback: 15,
          cashback: 7,
          members: 0
        },
      ];
      localStorage.setItem('vip_tiers_config', JSON.stringify(defaultVipTiers));
      
      // Calculate real member counts from user data
      const allUsers = Object.keys(localStorage).filter(key => key.startsWith('user_stats_'));
      allUsers.forEach(key => {
        try {
          const userData = JSON.parse(localStorage.getItem(key) || '{}');
          const xp = userData.xp || 0;
          
          // Determine VIP tier based on XP
          for (let i = defaultVipTiers.length - 1; i >= 0; i--) {
            if (xp >= defaultVipTiers[i].xpRequired) {
              defaultVipTiers[i].members++;
              break;
            }
          }
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      });
      
      setVipTiers(defaultVipTiers);
    } else {
      setVipTiers(storedVipTiers);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>VIP System</h1>
        <button className="btn-primary">Add VIP Tier</button>
      </div>

      <div className="admin-content">
        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-label">Total VIP Members</div>
            <div className="stat-value">{vipTiers.reduce((sum, tier) => sum + tier.members, 0)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total VIP Bonuses</div>
            <div className="stat-value">{vipTiers.reduce((sum, tier) => sum + (tier.dailyBonus * tier.members), 0).toFixed(2)} SOL/day</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Active Tiers</div>
            <div className="stat-value">{vipTiers.length}</div>
          </div>
        </div>

        <div className="vip-tiers-grid">
          {vipTiers.map((tier) => (
            <div key={tier.id} className="vip-tier-card" style={{ borderColor: tier.color }}>
              <div className="tier-header" style={{ backgroundColor: tier.color }}>
                <h3>{tier.name}</h3>
              </div>
              
              <div className="tier-details">
                <div className="tier-detail">
                  <span className="detail-label">XP Required:</span>
                  <span className="detail-value">{tier.xpRequired.toLocaleString()}</span>
                </div>
                <div className="tier-detail">
                  <span className="detail-label">Daily Bonus:</span>
                  <span className="detail-value">{tier.dailyBonus} SOL</span>
                </div>
                <div className="tier-detail">
                  <span className="detail-label">Weekly Bonus:</span>
                  <span className="detail-value">{tier.weeklyBonus} SOL</span>
                </div>
                <div className="tier-detail">
                  <span className="detail-label">Monthly Bonus:</span>
                  <span className="detail-value">{tier.monthlyBonus} SOL</span>
                </div>
                <div className="tier-detail">
                  <span className="detail-label">Rakeback:</span>
                  <span className="detail-value">{tier.rakeback}%</span>
                </div>
                <div className="tier-detail">
                  <span className="detail-label">Cashback:</span>
                  <span className="detail-value">{tier.cashback}%</span>
                </div>
                <div className="tier-detail">
                  <span className="detail-label">Members:</span>
                  <span className="detail-value">{tier.members}</span>
                </div>
              </div>

              <div className="tier-actions">
                <button className="btn-action btn-edit">Edit</button>
                <button className="btn-action btn-delete">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
