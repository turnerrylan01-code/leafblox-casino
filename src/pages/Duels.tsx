import { useState } from 'react';
import { useApp } from '../context/AppContext';
import './Duels.css';

export function DuelsPage() {
  const { balance, setBalance } = useApp();
  const [duelsAmount, setDuelsAmount] = useState('0.10');
  const [playerCount, setPlayerCount] = useState(2);
  const [fastAnimation, setFastAnimation] = useState(false);
  const [myGames, setMyGames] = useState<any[]>([]);
  const [allGames, setAllGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const validateInput = () => {
    let value = duelsAmount.replace(',', '.').replace(/[^\d.]/g, '');
    value = value.indexOf('.') >= 0 ? value.substr(0, value.indexOf('.')) + '.' + value.substr((value.indexOf('.') + 1), 2).replace('.', '') : value;
    setDuelsAmount(value);
  };

  const setAmountAction = (action: string) => {
    let amount = Math.floor(parseFloat(duelsAmount) * 100);

    if (action === 'clear') {
      amount = 0;
    } else if (action === '2x') {
      amount = Math.floor(amount * 2);
    } else if (action === 'max') {
      amount = Math.floor(balance / 10);
    }

    setDuelsAmount((amount / 100).toFixed(2));
  };

  const handleCreate = () => {
    const amount = Math.floor(parseFloat(duelsAmount) * 1000);

    if (isNaN(amount) || amount <= 0 || amount > balance) return;

    setLoading(true);

    setTimeout(() => {
      const newGame = {
        _id: Date.now().toString(36),
        amount: amount,
        playerCount: playerCount,
        bets: [{ user: { _id: 'user' }, amount: amount }],
        createdAt: new Date().toISOString()
      };

      setMyGames(prev => [newGame, ...prev]);
      setAllGames(prev => [newGame, ...prev]);
      setBalance(balance - amount / 1000);
      setLoading(false);
    }, 500);
  };

  const formatValue = (value: number): string => {
    return (Math.floor(value / 10) / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const getStats = () => {
    let bet = 0;
    let potential = 0;

    for (const game of myGames) {
      const betAmount = game.bets.reduce((sum: number, bet: any) => sum + bet.amount, 0);
      const potentialAmount = Math.floor(game.amount * game.playerCount * 0.95) - betAmount;
      bet = Math.floor(bet + betAmount);
      potential = Math.floor(potential + potentialAmount);
    }

    return { bet, potential };
  };

  const stats = getStats();

  return (
    <div className="duels">
      <div className="duels-controls">
        <div className="controls-title">
          <svg width="37" height="36" viewBox="0 0 37 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.90698 20.2069L15.7558 27.0733L13.0174 29.8191L15.7597 32.5668L13.0194 35.3126L8.22287 30.5065L2.74031 36L0 33.2542L5.48256 27.7588L0.686047 22.9546L3.42636 20.2089L6.16667 22.9527L8.90504 20.2069H8.90698ZM1.05814 0L7.93023 0.0058256L30.8314 22.9546L33.5736 20.2089L36.314 22.9546L31.5194 27.7607L37 33.2542L34.2597 36L28.7771 30.5065L23.9806 35.3126L21.2403 32.5668L23.9806 29.8191L1.06395 6.85668L1.05814 0ZM29.0756 0L35.9419 0.0058256L35.9457 6.84697L28.0911 14.7154L21.2384 7.85091L29.0756 0Z" fill="url(#icon-duels-gradient)"/>
            <defs>
              <linearGradient id="icon-duels-gradient" x1="37" y1="0" x2="-6.31937" y2="10.9114" gradientUnits="userSpaceOnUse">
                <stop stop-color="#00ffc2"/>
                <stop offset="1" stop-color="#00aa6d"/>
              </linearGradient>
            </defs>
          </svg>
          <span>DICE DUELS</span>
        </div>
        <div className="controls-actions">
          <div className="actions-amount">
            <input
              value={duelsAmount}
              onInput={validateInput}
              type="text"
              placeholder="BET AMOUNT"
            />
            <div className="amount-buttons">
              <button onClick={() => setAmountAction('clear')}>
                <div className="button-inner">CLEAR</div>
              </button>
              <button onClick={() => setAmountAction('2x')}>
                <div className="button-inner">2x</div>
              </button>
              <button onClick={() => setAmountAction('max')} className="button-max">
                <div className="button-inner">MAX</div>
              </button>
            </div>
          </div>
          <div className="filter-count">
            <button onClick={() => setPlayerCount(prev => prev === 2 ? 3 : 2)} className={playerCount === 2 ? 'active' : ''}>
              <div className="button-inner">2 PLAYERS</div>
            </button>
            <button onClick={() => setPlayerCount(prev => prev === 3 ? 2 : 3)} className={playerCount === 3 ? 'active' : ''}>
              <div className="button-inner">3 PLAYERS</div>
            </button>
          </div>
          <button onClick={handleCreate} className="button-create" disabled={loading}>
            <div className="button-inner">CREATE DUEL</div>
          </button>
        </div>
      </div>
      <div className="duels-stats">
        <div className="stats-animation">
          <div onClick={() => setFastAnimation(!fastAnimation)} className={`animation-toggle ${fastAnimation ? 'toggle-active' : ''}`}></div>
          FAST ANIMATION
        </div>
        <div className="stats-info">
          <div className="info-buy">
            YOUR BUY IN
            <div className="buy-value">
              <span>{formatValue(stats.bet).split('.')[0]}</span>.{formatValue(stats.bet).split('.')[1]}
            </div>
          </div>
          <div className="info-winnings">
            <span className="gradient-green">POTENTIAL WINNINGS</span>
            <div className="winnings-value">
              <span>{formatValue(stats.potential).split('.')[0]}</span>.{formatValue(stats.potential).split('.')[1]}
            </div>
          </div>
          <div className="info-edge">
            HOUSE EDGE
            <div className="edge-value">
              <span>5</span>.00%
            </div>
          </div>
        </div>
      </div>
      <div className="duels-games">
        <div className="games-my">
          <div className="my-header">
            <div className="header-title">
              <span className="gradient-green">MY GAMES</span>
              ({myGames.length})
            </div>
          </div>
          <div className="my-content">
            {myGames.length > 0 ? (
              <div className="content-list">
                {myGames.map((game) => (
                  <div key={game._id} className="game-element">
                    <div className="element-amount">{formatValue(game.amount)}</div>
                    <div className="element-players">{game.playerCount} Players</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="content-empty">You dont have any active duels. Start by creating one!</div>
            )}
          </div>
        </div>
        <div className="games-all">
          <div className="all-header">
            <div className="header-title">
              <span>ALL GAMES</span>
              ({allGames.length})
            </div>
            <div className="header-actions">
              <select className="filter-sort">
                <option>NEWEST</option>
                <option>HIGHEST PRICE</option>
                <option>LOWEST PRICE</option>
                <option>PARTICIPANTS</option>
              </select>
            </div>
          </div>
          <div className="all-content">
            {allGames.length > 0 ? (
              <div className="content-list">
                {allGames.map((game) => (
                  <div key={game._id} className="game-element">
                    <div className="element-amount">{formatValue(game.amount)}</div>
                    <div className="element-players">{game.playerCount} Players</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="content-empty">There are no duels. Be the first by creating one!</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
