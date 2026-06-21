import { useState } from 'react';
import { useApp } from '../context/AppContext';
import './Upgrader.css';

export function UpgraderPage() {
  const { balance, setBalance } = useApp();
  const [upgraderAmount, setUpgraderAmount] = useState('0.10');
  const [upgraderMode, setUpgraderMode] = useState<'under' | 'over'>('under');
  const [chance] = useState(0);
  const [items] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const validateInput = () => {
    let value = upgraderAmount.replace(',', '.').replace(/[^\d.]/g, '');
    value = value.indexOf('.') >= 0 ? value.substr(0, value.indexOf('.')) + '.' + value.substr((value.indexOf('.') + 1), 2).replace('.', '') : value;
    setUpgraderAmount(value);
  };

  const setAmountAction = (action: string) => {
    let amount = Math.floor(parseFloat(upgraderAmount) * 1000);

    if (action === '1/2') {
      amount = Math.floor(amount / 2);
    } else if (action === '2x') {
      amount = Math.floor(amount * 2);
    } else if (action === 'max') {
      amount = balance <= 1000000 ? balance : 1000000;
    }

    setUpgraderAmount((Math.floor(amount / 10) / 100).toFixed(2));
  };

  const handleUpgrade = () => {
    const amount = Math.floor(parseFloat(upgraderAmount) * 1000);

    if (isNaN(amount) || amount <= 0 || amount > balance) return;

    setLoading(true);

    setTimeout(() => {
      const success = Math.random() > 0.5;
      if (success) {
        setBalance(balance - amount / 1000 + amount / 1000 * 2);
      } else {
        setBalance(balance - amount / 1000);
      }
      setLoading(false);
    }, 1000);
  };

  const getPercentageAmount = () => {
    return 50;
  };

  return (
    <div className="upgrader">
      <div className="upgrader-game">
        <div className="game-controls">
          <div className="controls-title">USE YOUR BALANCE TO UPGRADE</div>
          <div className="controls-amount">
            <div className="amount-input">
              <input
                value={upgraderAmount}
                onInput={validateInput}
                type="text"
                placeholder="BET AMOUNT"
              />
              <div className="input-buttons">
                <button onClick={() => setAmountAction('1/2')}>
                  <div className="button-inner">1/2</div>
                </button>
                <button onClick={() => setAmountAction('2x')}>
                  <div className="button-inner">2x</div>
                </button>
                <button onClick={() => setAmountAction('max')}>
                  <div className="button-inner">MAX</div>
                </button>
              </div>
            </div>
            <input
              type="range"
              min="0.01"
              max="100000"
              step="0.01"
              style={{
                backgroundImage: `-webkit-gradient(linear, left top, right top, color-stop(${getPercentageAmount()}%, #164368), color-stop(${getPercentageAmount()}%, rgba(0, 0, 0, 0.35)))`
              }}
            />
          </div>
          <button className="button-fair">
            <div className="button-inner">
              <svg width="12" height="15" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M12.0001 2.30199V3.8031H10.941C9.76198 3.80425 8.60479 3.48508 7.59306 2.87967L6.25388 2.07004C6.17599 2.02293 6.0867 1.99803 5.99567 1.99803C5.90465 1.99803 5.81535 2.02293 5.73747 2.07004L4.40266 2.8753C3.39067 3.48009 2.23365 3.79922 1.05471 3.79872H3.60219e-10V2.30199C-5.0177e-06 2.16926 0.0524184 2.04191 0.145859 1.94765C0.239299 1.85339 0.36619 1.79986 0.49891 1.7987H1.05909C2.32857 1.79901 3.574 1.45247 4.66087 0.796506L6.00005 0L7.33485 0.800882C8.42243 1.45521 9.6674 1.80162 10.9366 1.80308H11.5012C11.6328 1.80533 11.7584 1.85862 11.8515 1.9517C11.9446 2.04478 11.9979 2.17037 12.0001 2.30199Z" />
                <path fillRule="evenodd" clipRule="evenodd" d="M10.941 4.81404C9.58091 4.8134 8.2466 4.44276 7.08102 3.74182L6.00005 3.08536L4.91908 3.72869C3.75456 4.43362 2.42034 4.80878 1.05909 4.81404H0V6.12696C0.00306513 7.64623 0.438442 9.13326 1.25526 10.4143C2.07207 11.6953 3.23659 12.7174 4.61273 13.3612L6.00005 14.0045L7.37862 13.3612C8.75673 12.7191 9.92335 11.6976 10.7418 10.4164C11.5603 9.13521 11.9968 7.64729 12.0001 6.12696V4.81404H10.941ZM6.25388 9.19044C6.16095 9.27977 6.03705 9.32966 5.90815 9.32966C5.77924 9.32966 5.65534 9.27977 5.56241 9.19044L4.16196 7.78999L4.86656 7.08539L5.9169 8.13135L7.66746 6.38079L8.37206 7.08539L6.25388 9.19044Z" />
              </svg>
              FAIRNESS
            </div>
          </button>
        </div>
        <div className="game-mid">
          <div className="mid-spinner">
            <div className="spinner-graph">
              <svg width="280px" height="280px" viewBox="0 0 32.75 32.75" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16.365" cy="16.365" r="15.91549430918954" strokeDasharray="99 1"></circle>
              </svg>
            </div>
            <div className="spinner-inner">
              CHANCE
              <div className="inner-chance">
                {chance.toFixed(2)}<span>%</span>
              </div>
              <div className="inner-tickets">
                0.00000 - 1.00000
              </div>
            </div>
          </div>
          <button 
            onClick={() => setUpgraderMode(upgraderMode === 'under' ? 'over' : 'under')} 
            className={`button-toggle ${upgraderMode === 'under' ? 'button-under' : ''}`}
          >
            <span>ROLL</span>
            {upgraderMode.toUpperCase()}
          </button>
          <button onClick={handleUpgrade} className="button-upgrade" disabled={loading}>
            <div className="button-inner">
              <span>UPGRADE</span>
            </div>
          </button>
        </div>
        <div className="game-items">
          <div className="items-title">SELECT ITEMS TO UPGRADE</div>
          <div className="items-image">
            <svg width="136" height="86" viewBox="0 0 136 86" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M47.3304 86L20.9692 83.5775L4.19383 74.493L0 60.5634L4.19383 49.662L12.5815 39.9718L16.7753 37.5493L23.3656 32.7042L29.3568 30.2817L32.9515 21.1972L35.9471 10.2958L44.3348 3.02817L47.3304 2.42254L61.7093 1.21127L79.6828 0L94.0617 1.21127L107.242 4.23944L110.238 6.66197L113.233 18.7746L120.423 21.1972L130.608 26.6479L136 35.7324L134.802 48.4507L127.013 58.7465L108.441 70.8592L78.4846 81.1549L47.3304 86Z" fill="url(#paint0_linear_4806_774)" fillOpacity="0.27"/>
              <defs>
                <linearGradient id="paint0_linear_4806_774" x1="68" y1="0" x2="68" y2="86" gradientUnits="userSpaceOnUse">
                  <stop/>
                  <stop offset="1" stopOpacity="0.28"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="items-info"></div>
        </div>
      </div>
      <div className="upgrader-items">
        <div className="items-header">
          <div className="header-search">
            <input type="text" placeholder="Search items..." />
          </div>
          <div className="header-filters">
            <select className="filter-amount">
              <option value="">All Amounts</option>
              <option value="low">Low</option>
              <option value="high">High</option>
            </select>
            <select className="filter-sort">
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
            </select>
          </div>
        </div>
        <div className="items-content">
          {loading ? (
            <div className="content-loading">Loading...</div>
          ) : items.length > 0 ? (
            <div className="content-list">
              {items.map((item) => (
                <div key={item._id} className="item-element">
                  <div className="element-name">{item.name}</div>
                  <div className="element-price">{item.price}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="content-empty">No boxes found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
