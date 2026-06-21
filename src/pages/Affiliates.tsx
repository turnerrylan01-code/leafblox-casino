import { useState, useEffect } from 'react';
import './Affiliates.css';

interface ReferredUser {
  username: string;
  earned: number;
  wagered: number;
}

export function AffiliatesPage() {
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [referralCode, setReferralCode] = useState('ABC123');
  const [stats, setStats] = useState({
    referred: 0,
    earned: 0,
    available: 0,
    wagered: 0
  });
  const [referredUsers, setReferredUsers] = useState<ReferredUser[]>([]);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
      setStats({
        referred: 5,
        earned: 1500,
        available: 500,
        wagered: 10000
      });
      setReferredUsers([
        { username: 'User1', earned: 100, wagered: 500 },
        { username: 'User2', earned: 200, wagered: 1000 },
        { username: 'User3', earned: 150, wagered: 750 },
      ]);
    }, 1000);
  }, []);

  const handleCopyCode = () => {
    const link = `https://leafblox.com/?a=${referralCode}`;
    navigator.clipboard.writeText(link);
    alert('Copied to your clipboard.');
  };

  const handleSetCode = () => {
    if (code.trim() === '' || code.trim().length < 2) {
      alert('Your entered affiliate code is invalid.');
      return;
    }
    setReferralCode(code);
    alert('Code set successfully!');
    setCode('');
  };


  const formatValue = (value: number) => {
    return (value / 1000).toFixed(2);
  };

  return (
    <div className="affiliates">
      <div className="affiliates-banner">
        <div className="banner-icons">
          <span>🎁</span>
          <span>⭐</span>
          <span>⭐</span>
          <span>💰</span>
          <span>💰</span>
          <span>💰</span>
        </div>
        <div className="banner-text">REFER YOUR FRIENDS AND EARN INCREDIBLE REWARDS WHEN THEY SIGN UP!</div>
      </div>

      <div className="affiliates-code">
        <div className="code-icons">
          <span>🔗</span>
          <span>🔗</span>
        </div>
        <div className="code-inner">
          <div className="inner-info">
            <div className="info-text">
              <span className="gradient-green">COPY AND SHARE YOUR REFERRAL CODE</span>
              <div className="text-link">
                https://leafblox.com/?a={referralCode}
                <button onClick={handleCopyCode} className="button-copy">
                  📋
                </button>
              </div>
            </div>
          </div>
          <div className="inner-input">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              type="text"
              placeholder="SET YOUR REFERRAL CODE"
            />
            <button onClick={handleSetCode} className="button-code">
              <div className="button-inner">SET CODE</div>
            </button>
          </div>
        </div>
      </div>

      <div className="affiliates-stats">
        <div className="stats-element">
          <div className="element-inner">
            {loading ? (
              <div className="inner-loading"></div>
            ) : (
              <div className="inner-content">
                <div className="content-name">TOTAL REFERRALS</div>
                <div className="content-amount">{stats.referred}</div>
              </div>
            )}
          </div>
        </div>
        <div className="stats-element">
          <div className="element-inner">
            {loading ? (
              <div className="inner-loading"></div>
            ) : (
              <div className="inner-content">
                <div className="content-name">TOTAL WAGERED</div>
                <div className="content-amount">
                  <span>💰</span>
                  <div className="amount-value">
                    <span>{formatValue(stats.wagered).split('.')[0]}</span>.{formatValue(stats.wagered).split('.')[1]}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="stats-element">
          <div className="element-inner">
            {loading ? (
              <div className="inner-loading"></div>
            ) : (
              <div className="inner-content">
                <div className="content-name">TOTAL EARNED</div>
                <div className="content-amount">
                  <span>💰</span>
                  <div className="amount-value">
                    <span>{formatValue(stats.earned).split('.')[0]}</span>.{formatValue(stats.earned).split('.')[1]}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="stats-element element-available">
          <div className="element-inner">
            {loading ? (
              <div className="inner-loading"></div>
            ) : (
              <div className="inner-content">
                <div className="content-info">
                  <span className="gradient-green">AVAILABLE COMMISSION</span>
                  <div className="info-amount">
                    <span>💰</span>
                    <div className="amount-value">
                      <span>{formatValue(stats.available).split('.')[0]}</span>.{formatValue(stats.available).split('.')[1]}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="affiliates-referred">
        <div className="referred-header">
          <div className="header-user">USER</div>
          <div className="header-earned">TOTAL EARNED</div>
          <div className="header-deposited">TOTAL WAGERED</div>
        </div>
        <div className="referred-list">
          {loading ? (
            <div className="list-loading">Loading...</div>
          ) : referredUsers.length > 0 ? (
            <div className="list-data">
              {referredUsers.map((user, index) => (
                <div key={index} className="referred-element">
                  <div className="element-user">{user.username}</div>
                  <div className="element-earned">
                    <span>💰</span>
                    {formatValue(user.earned)}
                  </div>
                  <div className="element-wagered">
                    <span>💰</span>
                    {formatValue(user.wagered)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="list-empty">No referred users found.</div>
          )}
        </div>
      </div>
    </div>
  );
}

