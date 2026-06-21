import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Rewards.css';

interface Box {
  _id: string;
  name: string;
  image: string;
  locked: boolean;
  cooldown: boolean;
}

export function RewardsPage() {
  const [loading, setLoading] = useState(true);
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [code, setCode] = useState('');
  const [rakebackInfo, setRakebackInfo] = useState<{ name: string; percentage: number } | null>(null);
  const [rakebackAvailable, setRakebackAvailable] = useState(0);
  const [rakebackProgress, setRakebackProgress] = useState(0);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
      setBoxes([
        { _id: '1', name: 'Level 1 Case', image: '🎁', locked: false, cooldown: false },
        { _id: '2', name: 'Level 2 Case', image: '🎁', locked: false, cooldown: false },
        { _id: '3', name: 'Level 3 Case', image: '🎁', locked: false, cooldown: false },
        { _id: '4', name: 'Level 4 Case', image: '🎁', locked: false, cooldown: false },
        { _id: '5', name: 'Level 5 Case', image: '🎁', locked: false, cooldown: false },
        { _id: '6', name: 'Level 6 Case', image: '🎁', locked: true, cooldown: false },
        { _id: '7', name: 'Level 7 Case', image: '🎁', locked: true, cooldown: false },
      ]);
      setRakebackInfo({ name: 'bronze', percentage: 0.05 });
      setRakebackAvailable(1.5);
      setRakebackProgress(20);
    }, 1000);
  }, []);

  const handleClaimCode = () => {
    if (code.trim() === '') {
      alert('Your entered code is invalid.');
      return;
    }
    alert(`Code claimed: ${code}`);
    setCode('');
  };

  const formatValue = (value: number) => {
    return value.toFixed(2);
  };

  const getBoxState = (box: Box) => {
    if (box.cooldown) return 'cooldown';
    if (box.locked) return 'locked';
    return 'ready';
  };

  return (
    <div className="rewards">
      <div className="rewards-banner">
        <div className="rewards-code">
          <div className="code-inner">
            <div className="inner-bg">
              <div className="bg-image"></div>
            </div>
            <div className="inner-image">
              <span>💰</span>
            </div>
            <div className="inner-title">EARN FREE REWARDS</div>
            <div className="inner-info">Start your journey on Leaf Blox with a little bonus! Redeem a code to earn a free 10 Robux.</div>
            <div className="inner-input">
              <div className="input-content">
                <span>💰</span>
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  type="text"
                  placeholder="Enter a code..."
                />
                <button onClick={handleClaimCode} className="button-claim">
                  <div className="button-inner">CLAIM</div>
                </button>
              </div>
              <div className="input-info">
                Don't have a code? Use code <span>ROLL</span>
              </div>
            </div>
          </div>
        </div>
        <div className="rewards-rakeback">
          <div className="rakeback-inner">
            <div className="inner-image">
              <span>💎</span>
            </div>
            <div className="inner-header">
              <span>RAKEBACK</span>
              {rakebackInfo ? (
                <div className={`header-rank rank-${rakebackInfo.name}`}>
                  <span>{rakebackInfo.name}</span>
                </div>
              ) : (
                <div className="header-unranked">
                  <span>UNRANKED</span>
                </div>
              )}
            </div>
            <div className="inner-info">
              Increase your tier to earn more gems!<br />
              You currently earn <span>{rakebackInfo ? rakebackInfo.percentage : '0.00'}%</span> rakeback on all bets
            </div>
            <div className="inner-bar">
              <div className="bar-progress" style={{ width: `${rakebackProgress}%` }}></div>
            </div>
            <div className="inner-bottom">
              <div className="bottom-earnings">
                <span>Available Earnings</span>
                <div className="earnings-amount">
                  <span>💰</span>
                  <div className="amount-value">
                    <span>{formatValue(rakebackAvailable).split('.')[0]}</span>.{formatValue(rakebackAvailable).split('.')[1]}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="rewards-boxes">
        <div className="boxes-title">DAILY CASES</div>
        <div className="boxes-content">
          {loading ? (
            <div className="content-loading">
              <div className="loading-placeholder"></div>
              <div className="loading-placeholder"></div>
              <div className="loading-placeholder"></div>
              <div className="loading-placeholder"></div>
              <div className="loading-placeholder"></div>
              <div className="loading-placeholder"></div>
              <div className="loading-placeholder"></div>
            </div>
          ) : boxes.length > 0 ? (
            <div className="content-list">
              {boxes.map((box) => (
                <Link key={box._id} to="/unbox" className={`rewards-box-element element-${getBoxState(box)}`}>
                  <div className="element-state">{getBoxState(box)}</div>
                  <div className="element-name">
                    <div className="name-inner">{box.name}</div>
                  </div>
                  <div className="element-image">
                    <span>{box.image}</span>
                  </div>
                  <div className="element-info">
                    {getBoxState(box) === 'ready' && <div className="info-ready">READY TO OPEN</div>}
                    {getBoxState(box) === 'locked' && <div className="info-locked">UNLOCKS ONCE YOU REACH LVL 5</div>}
                    {getBoxState(box) === 'cooldown' && (
                      <div className="info-cooldown">
                        <span>READY IN</span>
                        06:02:52
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="content-empty">There are no cases.</div>
          )}
        </div>
      </div>
    </div>
  );
}
