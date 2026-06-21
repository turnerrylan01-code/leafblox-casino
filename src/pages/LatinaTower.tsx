import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { addXP, statsStorageKey } from '../lib/auth';
import './LatinaTower.css';

type RiskLevel = 'easy' | 'medium' | 'hard';

interface GameState {
  state: 'active' | 'completed';
  amount: number;
  risk: RiskLevel;
  revealed: Array<{ tile: number; row: (string)[] }>;
  deck: (string[])[];
  payout: number;
}

export function LatinaTowerPage() {
  const { balance, setBalance } = useApp();
  const { authUserId } = useAuth();
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('medium');
  const [game, setGame] = useState<GameState | null>(null);
  const [betAmount, setBetAmount] = useState('0.10');
  const [loading, setLoading] = useState(false);

  const getTilesCount = (risk: RiskLevel): number => {
    return risk === 'medium' ? 2 : 3;
  };

  const getMultiplierPerRow = (risk: RiskLevel): number => {
    if (risk === 'easy') return 1.425;
    if (risk === 'medium') return 1.90;
    return 2.85;
  };

  const formatValue = (value: number): string => {
    return (Math.floor(value / 10) / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const getRowCashout = (row: number): number => {
    const multiplierPerRow = getMultiplierPerRow(riskLevel);
    const amount = game ? game.amount : parseFloat(betAmount) * 1000;
    return Math.floor(amount * Math.pow(multiplierPerRow, row + 1));
  };

  const getCashoutAmount = (): number => {
    if (!game) return 0;
    const multiplierPerRow = getMultiplierPerRow(game.risk);
    return Math.floor(game.amount * Math.pow(multiplierPerRow, game.revealed.length));
  };

  const validateInput = () => {
    let value = betAmount.replace(',', '.').replace(/[^\d.]/g, '');
    value = value.indexOf('.') >= 0 ? value.substr(0, value.indexOf('.')) + '.' + value.substr((value.indexOf('.') + 1), 2).replace('.', '') : value;
    setBetAmount(value);
  };

  const setAmountAction = (action: '2x' | 'max') => {
    let amount = Math.floor(parseFloat(betAmount) * 1000);
    if (action === '2x') {
      amount = Math.floor(amount * 2);
    } else if (action === 'max') {
      amount = balance <= 1000000 ? balance : 1000000;
    }
    setBetAmount((Math.floor(amount / 10) / 100).toFixed(2));
  };

  const handleBet = () => {
    const amount = Math.floor(parseFloat(betAmount) * 1000);
    if (isNaN(amount) || amount <= 0 || amount > balance) return;

    setBalance(prev => prev - amount);
    addXP(statsStorageKey(authUserId || ''), amount);
    setLoading(true);
    
    setTimeout(() => {
      const tilesPerRow = getTilesCount(riskLevel);
      const losePerRow = riskLevel === 'hard' ? 2 : 1;
      
      const deck: (string[])[] = [];
      for (let row = 0; row < 8; row++) {
        const rowDeck: string[] = [];
        const losePositions = new Set<number>();
        
        for (let i = 0; i < losePerRow; i++) {
          let losePos;
          do {
            losePos = Math.floor(Math.random() * tilesPerRow);
          } while (losePositions.has(losePos));
          losePositions.add(losePos);
        }
        
        for (let i = 0; i < tilesPerRow; i++) {
          rowDeck.push(losePositions.has(i) ? 'lose' : 'coin');
        }
        deck.push(rowDeck);
      }

      setGame({
        state: 'active',
        amount,
        risk: riskLevel,
        revealed: [],
        deck,
        payout: 0
      });
      setLoading(false);
    }, 500);
  };

  const handleReveal = (tile: number) => {
    if (!game || game.state !== 'active' || loading) return;
    
    const currentRow = game.revealed.length;
    if (currentRow >= 8) return;

    setLoading(true);
    
    setTimeout(() => {
      const tileType = game.deck[currentRow][tile];
      const newRevealed = [...game.revealed, { tile, row: game.deck[currentRow] }];
      
      if (tileType === 'lose') {
        setGame({
          ...game,
          state: 'completed',
          revealed: newRevealed,
          payout: 0
        });
      } else {
        if (currentRow === 7) {
          const multiplierPerRow = getMultiplierPerRow(game.risk);
          const payout = Math.floor(game.amount * Math.pow(multiplierPerRow, 8));
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
    <div className="towers">
      <div className="towers-container">
        <div className={`container-game game-${riskLevel}`}>
          {Array.from({ length: 8 }).map((_, rowIndex) => {
            const isCurrentRow = game && game.state !== 'completed' && game.revealed.length === rowIndex;
            const isRevealed = game && game.revealed[rowIndex] !== undefined;
            const tilesCount = getTilesCount(game ? game.risk : riskLevel);
            
            return (
              <div
                key={rowIndex}
                className={`towers-row ${isCurrentRow ? 'row-active' : ''} ${isRevealed ? 'row-revealed' : ''}`}
              >
                {Array.from({ length: tilesCount }).map((_, tileIndex) => {
                  const revealedData = game?.revealed[rowIndex];
                  const isTileRevealed = revealedData !== undefined;
                  const isCoin = revealedData?.row[tileIndex] === 'coin';
                  const isLose = revealedData?.row[tileIndex] === 'lose';
                  const rowCashout = getRowCashout(rowIndex);
                  
                  return (
                    <div key={tileIndex} className="row-tile">
                      {isTileRevealed && isCoin ? (
                        <div className="tile-coin">
                          <div className="coin-inner">
                            <div className="inner-value" />
                          </div>
                        </div>
                      ) : isTileRevealed && isLose ? (
                        <div className="coin-inners">
                          <div className="inner-value" />
                        </div>
                      ) : (
                        <button
                          className="button-reveal"
                          onClick={() => handleReveal(tileIndex)}
                          disabled={loading || !game || game.state === 'completed' || game.revealed.length !== rowIndex}
                        >
                          <div className="button-inner">
                            <div className="inner-value">
                              <span>{formatValue(rowCashout).split('.')[0]}</span>.{formatValue(rowCashout).split('.')[1]}
                            </div>
                          </div>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        
        <div className="towers-controls">
          <div className="controls-mode">
            <button
              onClick={() => setRiskLevel('easy')}
              className={riskLevel === 'easy' ? 'button-active' : ''}
              disabled={game?.state !== 'completed'}
            >
              <div className="button-inner">EASY</div>
            </button>
            <button
              onClick={() => setRiskLevel('medium')}
              className={riskLevel === 'medium' ? 'button-active' : ''}
              disabled={game?.state !== 'completed'}
            >
              <div className="button-inner">MEDIUM</div>
            </button>
            <button
              onClick={() => setRiskLevel('hard')}
              className={riskLevel === 'hard' ? 'button-active' : ''}
              disabled={game?.state !== 'completed'}
            >
              <div className="button-inner">HARD</div>
            </button>
          </div>
          
          <div className="controls-amount">
            <input
              value={betAmount}
              onInput={validateInput}
              type="text"
              placeholder="BET AMOUNT"
              disabled={game?.state !== 'completed'}
            />
            <div className="amount-buttons">
              <button onClick={() => setAmountAction('2x')} disabled={game?.state !== 'completed'}>
                <div className="button-inner">2x</div>
              </button>
              <button onClick={() => setAmountAction('max')} disabled={game?.state !== 'completed'}>
                <div className="button-inner">MAX</div>
              </button>
            </div>
          </div>
          
          <div className="controls-bottom">
            <div className="bottom-info">
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
                <div className="button-inner">
                  {game && game.state === 'completed' && game.payout <= 0 ? 'PLAY AGAIN' : 'PLACE BET'}
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
