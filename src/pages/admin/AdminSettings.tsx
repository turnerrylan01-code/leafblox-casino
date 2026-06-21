import { useState, useEffect } from 'react';
import './AdminPanel.css';

export function AdminSettings() {
  const [settings, setSettings] = useState<any>({
    siteName: 'Leaf Blox',
    siteLogo: '🍀',
    maintenanceMode: false,
    faucetAmount: 0.01,
    faucetCooldown: 300,
    referralBonus: 0.1,
    referralPercentage: 5,
    chatEnabled: true,
    chatFilter: true,
    bonusEnabled: true,
    currency: 'SOL',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    // Load real settings from localStorage
    const storedSettings = JSON.parse(localStorage.getItem('adminSettings') || '{}');
    if (Object.keys(storedSettings).length > 0) {
      setSettings(storedSettings);
    }
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings({ ...settings, [key]: value });
  };

  const saveSettings = () => {
    // In production, this would save to your backend API
    localStorage.setItem('adminSettings', JSON.stringify(settings));
    alert('Settings saved successfully!');
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Settings</h1>
        <button className="btn-primary" onClick={saveSettings}>
          Save All Settings
        </button>
      </div>

      <div className="admin-content">
        <div className="settings-sections">
          <div className="settings-section">
            <h3>General Settings</h3>
            <div className="settings-form">
              <div className="form-group">
                <label>Site Name</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => handleSettingChange('siteName', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Site Logo (Emoji)</label>
                <input
                  type="text"
                  value={settings.siteLogo}
                  onChange={(e) => handleSettingChange('siteLogo', e.target.value)}
                  maxLength={2}
                />
              </div>
              <div className="form-group">
                <label>Currency</label>
                <select
                  value={settings.currency}
                  onChange={(e) => handleSettingChange('currency', e.target.value)}
                >
                  <option value="SOL">SOL</option>
                  <option value="USD">USD</option>
                </select>
              </div>
              <div className="form-group">
                <label>Maintenance Mode</label>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h3>Faucet Settings</h3>
            <div className="settings-form">
              <div className="form-group">
                <label>Faucet Amount (SOL)</label>
                <input
                  type="number"
                  step="0.001"
                  value={settings.faucetAmount}
                  onChange={(e) => handleSettingChange('faucetAmount', parseFloat(e.target.value))}
                />
              </div>
              <div className="form-group">
                <label>Cooldown (seconds)</label>
                <input
                  type="number"
                  value={settings.faucetCooldown}
                  onChange={(e) => handleSettingChange('faucetCooldown', parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h3>Referral Settings</h3>
            <div className="settings-form">
              <div className="form-group">
                <label>Referral Bonus (SOL)</label>
                <input
                  type="number"
                  step="0.01"
                  value={settings.referralBonus}
                  onChange={(e) => handleSettingChange('referralBonus', parseFloat(e.target.value))}
                />
              </div>
              <div className="form-group">
                <label>Referral Percentage (%)</label>
                <input
                  type="number"
                  value={settings.referralPercentage}
                  onChange={(e) => handleSettingChange('referralPercentage', parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h3>Chat Settings</h3>
            <div className="settings-form">
              <div className="form-group">
                <label>Chat Enabled</label>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.chatEnabled}
                    onChange={(e) => handleSettingChange('chatEnabled', e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="form-group">
                <label>Chat Filter</label>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.chatFilter}
                    onChange={(e) => handleSettingChange('chatFilter', e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h3>Bonus Settings</h3>
            <div className="settings-form">
              <div className="form-group">
                <label>Bonus System Enabled</label>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.bonusEnabled}
                    onChange={(e) => handleSettingChange('bonusEnabled', e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
