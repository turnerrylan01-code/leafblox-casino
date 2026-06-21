import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { addXP, statsStorageKey } from '../lib/auth';
import './Mines.css';

interface GameState {
  state: 'active' | 'completed';
  amount: number;
  minesCount: number;
  revealed: Array<{ tile: number; value: string }>;
  deck: string[];
  payout: number;
}

export function MinesPage() {
  const { balance, setBalance } = useApp();
  const { authUserId } = useAuth();
  const [minesAmount, setMinesAmount] = useState('0.10');
  const [minesCount, setMinesCount] = useState(1);
  const [game, setGame] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(false);

  const formatValue = (value: number): string => {
    return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const validateInput = () => {
    let value = minesAmount.replace(',', '.').replace(/[^\d.]/g, '');
    value = value.indexOf('.') >= 0 ? value.substr(0, value.indexOf('.')) + '.' + value.substr((value.indexOf('.') + 1), 2).replace('.', '') : value;
    setMinesAmount(value);
  };

  const setAmountAction = (action: '2x' | 'max') => {
    let amount = Math.floor(parseFloat(minesAmount) * 1000);
    if (action === '2x') {
      amount = Math.floor(amount * 2);
    } else if (action === 'max') {
      amount = balance <= 1000000 ? balance : 1000000;
    }
    setMinesAmount(parseFloat(Math.floor(amount / 10) / 100).toFixed(2));
  };

  const isCount = (count: number): boolean => {
    return Number(minesCount) === count;
  };

  const factorialNumber = (number: number): number => {
    let value = number;
    for (let i = number; i > 1; i--) {
      value = value * (i - 1);
    }
    return value;
  };

  const getWinMultiplier = (): number => {
    if (!game || game.revealed.length === 0) return 1;
    
    const first = 25 === game.revealed.length ? 1 : factorialNumber(25) / (factorialNumber(game.revealed.length) * factorialNumber(25 - game.revealed.length));
    const second = (25 - game.minesCount) === game.revealed.length ? 1 : factorialNumber(25 - game.minesCount) / (factorialNumber(game.revealed.length) * factorialNumber((25 - game.minesCount) - game.revealed.length));

    let multiplier = 0.95 * (first / second);
    multiplier = multiplier < 1 ? 1.01 : multiplier;
    multiplier = Math.round(multiplier * 100) / 100;

    return multiplier;
  };

  const getCashoutAmount = (): number => {
    if (!game) return 0;
    return Math.floor(game.amount * getWinMultiplier());
  };

  const getRevealedTile = (tile: number): string | null => {
    if (!game) return null;
    
    if (game.state === 'completed' && game.deck[tile] === 'mine') {
      return game.deck[tile];
    } else {
      const index = game.revealed.findIndex((element) => element.tile === tile);
      if (index !== -1) return game.revealed[index].value;
    }
    
    return null;
  };

  const handleBet = () => {
    const amount = Math.floor(parseFloat(minesAmount) * 1000);
    const mines = Math.floor(minesCount);

    if (isNaN(amount) || amount <= 0 || amount > balance) return;
    if (isNaN(mines) || mines < 1 || mines > 24) return;

    setBalance(prev => prev - amount);
    addXP(statsStorageKey(authUserId || ''), amount);
    setLoading(true);
    
    setTimeout(() => {
      const deck: string[] = [];
      const minePositions = new Set<number>();
      
      for (let i = 0; i < mines; i++) {
        let minePos;
        do {
          minePos = Math.floor(Math.random() * 25);
        } while (minePositions.has(minePos));
        minePositions.add(minePos);
      }
      
      for (let i = 0; i < 25; i++) {
        deck.push(minePositions.has(i) ? 'mine' : 'coin');
      }

      setGame({
        state: 'active',
        amount,
        minesCount: mines,
        revealed: [],
        deck,
        payout: 0
      });
      setLoading(false);
    }, 500);
  };

  const handleReveal = (tile: number) => {
    if (!game || game.state !== 'active' || loading) return;
    
    setLoading(true);
    
    setTimeout(() => {
      const tileType = game.deck[tile];
      const newRevealed = [...game.revealed, { tile, value: tileType }];
      
      if (tileType === 'mine') {
        setGame({
          ...game,
          state: 'completed',
          revealed: newRevealed,
          payout: 0
        });
      } else {
        if (newRevealed.length === 25 - game.minesCount) {
          const multiplier = getWinMultiplier();
          const payout = Math.floor(game.amount * multiplier);
          setBalance(balance + payout / 1000);
          setGame({
            ...game,
            state: 'completed',
            revealed: newRevealed,
            payout
          });
        } else {
          setGame({
            ...game,
            revealed: newRevealed
          });
        }
      }
      setLoading(false);
    }, 300);
  };

  const handleAutoReveal = () => {
    if (!game || game.state !== 'active' || loading) return;
    
    let tile = Math.floor(Math.random() * (24 - game.revealed.length));
    
    while (true) {
      if (game.revealed.some((element) => element.tile === tile)) {
        tile = tile + 1;
      } else {
        break;
      }
    }
    
    handleReveal(tile);
  };

  const handleCashout = () => {
    if (!game || game.state !== 'active' || game.revealed.length === 0) return;
    
    setLoading(true);
    
    setTimeout(() => {
      const payout = getCashoutAmount();
      setBalance(balance + payout / 1000);
      setGame({
        ...game,
        state: 'completed',
        payout
      });
      setLoading(false);
    }, 500);
  };

  return (
    <div className="mines">
      <div className="mines-container">
        <div className="mines-controls">
          <div className="controls-top">
            <div className="top-amount">
              <input
                value={minesAmount}
                onInput={validateInput}
                type="text"
                placeholder="BET AMOUNT"
                disabled={game && game.state !== 'completed'}
              />
              <div className="amount-buttons">
                <button onClick={() => setAmountAction('2x')} disabled={game && game.state !== 'completed'}>
                  <div className="button-inner">2x</div>
                </button>
                <button onClick={() => setAmountAction('max')} disabled={game && game.state !== 'completed'}>
                  <div className="button-inner">MAX</div>
                </button>
              </div>
            </div>
            <div className="top-slider">
              <input
                value={minesAmount}
                type="range"
                min="0"
                max={balance / 1000}
                step="0.01"
                disabled={game && game.state !== 'completed'}
              />
            </div>
            <div className="top-mines">
              <div className="mines-title">AMOUNT OF MINES</div>
              <div className="mines-content">
                <button onClick={() => setMinesCount(1)} className={isCount(1) ? 'button-active' : ''} disabled={game && game.state !== 'completed'}>
                  <div className="button-inner">1</div>
                </button>
                <button onClick={() => setMinesCount(3)} className={isCount(3) ? 'button-active' : ''} disabled={game && game.state !== 'completed'}>
                  <div className="button-inner">3</div>
                </button>
                <button onClick={() => setMinesCount(5)} className={isCount(5) ? 'button-active' : ''} disabled={game && game.state !== 'completed'}>
                  <div className="button-inner">5</div>
                </button>
                <button onClick={() => setMinesCount(10)} className={isCount(10) ? 'button-active' : ''} disabled={game && game.state !== 'completed'}>
                  <div className="button-inner">10</div>
                </button>
                <div className="content-input">
                  <input
                    value={minesCount}
                    type="number"
                    min="1"
                    max="24"
                    placeholder="..."
                    onChange={(e) => setMinesCount(parseInt(e.target.value) || 1)}
                    disabled={game && game.state !== 'completed'}
                  />
                </div>
              </div>
            </div>
            {game && game.state !== 'completed' ? (
              <button onClick={handleCashout} className="button-cashout" disabled={loading}>
                <div className="button-inner">
                  CASHOUT
                  <div className="content-amount">
                    <div className="amount-value">
                      <span>{formatValue(getCashoutAmount()).split('.')[0]}</span>.{formatValue(getCashoutAmount()).split('.')[1]}
                    </div>
                  </div>
                </div>
              </button>
            ) : (
              <button onClick={handleBet} className="button-bet" disabled={loading}>
                <div className="button-inner">PLACE BET</div>
              </button>
            )}
            <button onClick={handleAutoReveal} className="button-auto" disabled={loading || !game || game.state === 'completed'}>
              <div className="button-inner">AUTO-SELECT MINE</div>
            </button>
          </div>
          <div className="controls-info">
            <button className="button-fair">
              <div className="button-inner">
                <svg width="12" height="15" viewBox="0 0 12 15" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12.0001 2.30199V3.8031H10.941C9.76198 3.80425 8.60479 3.48508 7.59306 2.87967L6.25388 2.07004C6.17599 2.02293 6.0867 1.99803 5.99567 1.99803C5.90465 1.99803 5.81535 2.02293 5.73747 2.07004L4.40266 2.8753C3.39067 3.48009 2.23365 3.79922 1.05471 3.79872H3.60219e-10V2.30199C-5.0177e-06 2.16926 0.0524184 2.04191 0.145859 1.94765C0.239299 1.85339 0.36619 1.79986 0.49891 1.7987H1.05909C2.32857 1.79901 3.574 1.45247 4.66087 0.796506L6.00005 0L7.33485 0.800882C8.42243 1.45521 9.6674 1.80162 10.9366 1.80308H11.5012C11.6328 1.80533 11.7584 1.85862 11.8515 1.9517C11.9446 2.04478 11.9979 2.17037 12.0001 2.30199Z" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M10.941 4.81404C9.58091 4.8134 8.2466 4.44276 7.08102 3.74182L6.00005 3.08536L4.91908 3.72869C3.75456 4.43362 2.42034 4.80878 1.05909 4.81404H0V6.12696C0.00306513 7.64623 0.438442 9.13326 1.25526 10.4143C2.07207 11.6953 3.23659 12.7174 4.61273 13.3612L6.00005 14.0045L7.37862 13.3612C8.75673 12.7191 9.92335 11.6976 10.7418 10.4164C11.5603 9.13521 11.9968 7.64729 12.0001 6.12696V4.81404H10.941ZM6.25388 9.19044C6.16095 9.27977 6.03705 9.32966 5.90815 9.32966C5.77924 9.32966 5.65534 9.27977 5.56241 9.19044L4.16196 7.78999L4.86656 7.08539L5.9169 8.13135L7.66746 6.38079L8.37206 7.08539L6.25388 9.19044Z" />
                </svg>
                FAIRNESS
              </div>
            </button>
            <button className="button-mute">
              <div className="button-inner">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M9 5.99999C9 4.82334 8.32 3.80665 7.33334 3.31665V4.78999L8.97 6.42665C8.99 6.28665 9 6.14334 9 5.99999Z" />
                  <path d="M10.6667 6.00001C10.6667 6.62666 10.53 7.21666 10.3067 7.76001L11.3167 8.77001C11.75 7.94001 12 7.00001 12 6.00001C12 3.14666 10.0033 0.760007 7.33334 0.153351V1.53001C9.26 2.10335 10.6667 3.88666 10.6667 6.00001Z" />
                  <path d="M6 0.666656L4.60666 2.06L6 3.45334V0.666656Z" />
                  <path d="M0.85 0L0 0.85L3.15 4H0V8H2.66666L6 11.3333V6.85L8.83666 9.68666C8.39 10.03 7.88666 10.3067 7.33331 10.4733V11.85C8.24997 11.64 9.08666 11.22 9.78997 10.6433L11.15 12L12 11.15L6 5.15L0.85 0Z" />
                </svg>
                MUTE
              </div>
            </button>
          </div>
        </div>
        <div className="mines-game">
          {game && game.state === 'completed' && game.payout > 0 && (
            <div className="game-win">
              <div className="win-inner">
                <div className="inner-multiplier">
                  <span>x{getWinMultiplier().toFixed(2)}</span>
                  YOU WON
                </div>
                <div className="inner-payout">
                  <div className="payout-value">
                    <span>{formatValue(game.payout).split('.')[0]}</span>.{formatValue(game.payout).split('.')[1]}
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="game-inner">
            {Array.from({ length: 25 }).map((_, tile) => {
              const revealedTile = getRevealedTile(tile);
              
              return (
                <div key={tile} className="mines-tile">
                  {revealedTile === 'coin' ? (
                    <div className="tile-coin">
                      <div className="coin-box">
                        <div className="box-inner">💎</div>
                      </div>
                    </div>
                  ) : revealedTile === 'mine' ? (
                    <div className="tile-mine">💣</div>
                  ) : (
                    <button
                      className="button-reveal"
                      onClick={() => handleReveal(tile)}
                      disabled={loading || !game || game.state === 'completed'}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
