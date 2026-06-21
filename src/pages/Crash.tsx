import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import './Crash.css';

interface GameState {
  state: 'created' | 'rolling' | 'completed';
  outcome: number;
  createdAt: number;
  updatedAt: number;
  _id: string;
}

interface Bet {
  _id: string;
  amount: number;
  multiplier?: number;
  payout?: number;
}

export function CrashPage() {
  const { balance, setBalance } = useApp();
  const [crashAmount, setCrashAmount] = useState('0.10');
  const [crashAutoCashout, setCrashAutoCashout] = useState('2.00');
  const [crashMode, setCrashMode] = useState<'manual' | 'auto'>('manual');
  const [game, setGame] = useState<GameState | null>(null);
  const [bets, setBets] = useState<Bet[]>([]);
  const [timerText, setTimerText] = useState('STARTING IN 20.00s');
  const [multiplier, setMultiplier] = useState(1.0001);
  const [loading, setLoading] = useState(false);
  const [hasBet, setHasBet] = useState(false);
  const [userBet, setUserBet] = useState<Bet | null>(null);

  const runRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const validateInput = () => {
    let value = crashAmount.replace(',', '.').replace(/[^\d.]/g, '');
    value = value.indexOf('.') >= 0 ? value.substr(0, value.indexOf('.')) + '.' + value.substr((value.indexOf('.') + 1), 2).replace('.', '') : value;
    setCrashAmount(value);
  };

  const setAmountAction = (value: string, action: string) => {
    let amount = Math.floor(parseFloat(value) * 1000);

    if (action === '2x') {
      amount = Math.floor(amount * 2);
    } else if (action === '10x') {
      amount = Math.floor(amount * 10);
    } else if (action === 'max') {
      amount = balance <= 1000000 ? balance : 1000000;
    }

    if (value === 'crashAmount') {
      setCrashAmount((Math.floor(amount / 10) / 100).toFixed(2));
    } else {
      setCrashAutoCashout((Math.floor(amount / 10) / 100).toFixed(2));
    }
  };

  const formatValue = (value: number): string => {
    return (Math.floor(value / 10) / 100).toFixed(2);
  };

  const startTimer = () => {
    if (!game) return;
    
    const timeEnding = game.createdAt + (1000 * 6);
    const timeLeft = (timeEnding - Date.now()) / 1000;

    if (timeLeft <= 0) {
      setTimerText('PENDING...');
    } else {
      setTimerText('STARTING IN ' + timeLeft.toFixed(2) + 's');
    }
  };

  const startMultiplier = () => {
    if (!game) return;
    
    const elapsed = Date.now() - game.updatedAt;
    const mult = Math.floor(100000 * Math.pow(Math.E, 0.00006 * elapsed));
    setMultiplier(mult === 100000 ? 100001 : mult);
  };

  const handleBet = () => {
    const amount = Math.floor(parseFloat(crashAmount) * 1000);
    const autoCashout = Math.round(parseFloat(crashAutoCashout) * 100);

    if (isNaN(amount) || amount <= 0 || amount > balance) return;
    if (isNaN(autoCashout) || autoCashout <= 100) return;

    setLoading(true);

    setTimeout(() => {
      const newGame: GameState = {
        state: 'created',
        outcome: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        _id: Date.now().toString(36)
      };

      setGame(newGame);
      setMultiplier(1.0001);
      setHasBet(true);
      
      const newBet: Bet = {
        _id: Date.now().toString(36),
        amount,
        multiplier: autoCashout
      };
      
      setBets([newBet]);
      setUserBet(newBet);
      setBalance(balance - amount / 1000);
      setLoading(false);
    }, 500);
  };

  const handleCashout = () => {
    if (!game || !userBet || game.state !== 'rolling') return;

    const payout = Math.floor(userBet.amount * (multiplier / 100000));
    setBalance(balance + payout / 1000);
    
    setBets(prev => prev.map(b => 
      b._id === userBet._id ? { ...b, multiplier: multiplier / 1000, payout } : b
    ));
    setUserBet(prev => prev ? { ...prev, multiplier: multiplier / 1000, payout } : null);
    setHasBet(false);
  };

  useEffect(() => {
    if (game && game.state === 'created') {
      const interval = setInterval(() => {
        startTimer();
      }, 16);

      setTimeout(() => {
        const outcome = Math.floor(Math.random() * 990000) + 10001;
        setGame(prev => prev ? { ...prev, state: 'rolling', outcome, updatedAt: Date.now() } : null);

        const runInterval = setInterval(() => {
          startMultiplier();
        }, 16);

        runRef.current = runInterval;

        setTimeout(() => {
          clearInterval(runInterval);
          setGame(prev => prev ? { ...prev, state: 'completed' } : null);
          setTimerText('PENDING...');
          
          if (userBet && !userBet.payout) {
            setHasBet(false);
            setUserBet(null);
          }
        }, 10000);
      }, 6000);

      return () => clearInterval(interval);
    }

    if (game && game.state === 'rolling') {
      // Auto cashout
      if (userBet && userBet.multiplier && multiplier >= userBet.multiplier * 100) {
        handleCashout();
      }
    }
  }, [game, userBet, multiplier, balance]);

  const getPlayerCount = () => {
    const players = new Set(bets.map(b => b._id));
    return players.size;
  };

  const getBetsAmount = () => {
    return bets.reduce((sum, bet) => sum + bet.amount, 0);
  };

  const getPayoutAmount = () => {
    if (!userBet) return 0;
    return Math.floor(userBet.amount * (multiplier / 100000));
  };

  return (
    <div className="crash">
      <div className="crash-container">
        <div className="crash-locked-overlay">
          <div className="locked-message">
            <div className="locked-title">LOCKED</div>
            <div className="locked-subtitle">FOR MAINTENANCE</div>
          </div>
        </div>
        <div className="container-data">
          <div className="data-left">
            <div className="crash-game">
              <div className="game-graph">
                <canvas id="canvas-graph"></canvas>
              </div>
              <div className="game-info">
                <div className="info-network">
                  <div className="network-point"></div>
                  <span>NETWORK STATUS</span>
                </div>
                <div className="info-profit">
                  <button>
                    MAX PROFIT
                  </button>
                </div>
              </div>
              {game && (
                <div className="game-inner">
                  {game.state === 'completed' ? (
                    <div className="inner-completed">
                      <div className="completed-multiplier">
                        {(game.outcome / 100).toFixed(2)}
                      </div>
                      <div className="completed-over">ROUND OVER</div>
                    </div>
                  ) : game.state === 'rolling' ? (
                    <div className="inner-rolling">
                      <div className="rolling-multiplier">
                        <span className="gradient-green">{(Math.floor(multiplier / 1000) / 100).toFixed(2)}</span>
                      </div>
                      <div className="rolling-payout">CURRENT PAYOUT</div>
                      {hasBet && userBet && !userBet.payout && (
                        <div className="rolling-amount">
                          <div className="amount-value">
                            <span>+{formatValue(getPayoutAmount()).split('.')[0]}</span>.{formatValue(getPayoutAmount()).split('.')[1]}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="inner-waiting">
                      <div className="waiting-status">PREPARING ROUND</div>
                      <div className="waiting-timer">{timerText}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="crash-history">
              <div className="history-list">
                {bets.map((bet) => (
                  <div key={bet._id} className="history-element">
                    <div className="element-multiplier">{bet.payout ? (bet.payout / bet.amount).toFixed(2) : '1.00'}x</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="crash-controls">
            <div className="controls-mode">
              <button 
                onClick={() => setCrashMode('manual')} 
                className={crashMode === 'manual' ? 'button-active' : ''}
              >
                <div className="button-inner">
                  <span>MANUAL</span>
                </div>
              </button>
              <button 
                onClick={() => setCrashMode('auto')} 
                className={crashMode === 'auto' ? 'button-active' : ''}
              >
                <div className="button-inner">
                  <span>AUTO</span>
                </div>
              </button>
            </div>
            <div className="controls-amount">
              <input
                value={crashAmount}
                onInput={validateInput}
                type="text"
                placeholder="BET AMOUNT"
              />
              <div className="cashout-buttons">
                <button onClick={() => setAmountAction('crashAmount', '2x')}>
                  <div className="button-inner">2x</div>
                </button>
                <button onClick={() => setAmountAction('crashAmount', 'max')} className="button-max">
                  <div className="button-inner">MAX</div>
                </button>
              </div>
            </div>
            <div className="controls-cashout">
              <input
                value={crashAutoCashout}
                type="text"
                placeholder="AUTO CASHOUT"
              />
              <div className="cashout-buttons">
                <button onClick={() => setAmountAction('crashAutoCashout', '2x')}>
                  <div className="button-inner">2x</div>
                </button>
                <button onClick={() => setAmountAction('crashAutoCashout', '10x')}>
                  <div className="button-inner">10x</div>
                </button>
              </div>
            </div>
            {crashMode === 'manual' ? (
              <div className="controls-manual">
                {hasBet && userBet && !userBet.payout ? (
                  <button 
                    onClick={handleCashout} 
                    className="button-cashout" 
                    disabled={game?.state !== 'rolling'}
                  >
                    <div className="button-inner">{game?.state !== 'rolling' ? 'STARTING...' : 'CASHOUT'}</div>
                  </button>
                ) : (
                  <button onClick={handleBet} className="button-bet" disabled={loading}>
                    <div className="button-inner">PLACE BET</div>
                  </button>
                )}
                <div className="manual-bets">
                  <div className="bets-header">
                    <div className="header-player">
                      PLAYERS
                      <span>{getPlayerCount()}</span>
                    </div>
                    <div className="header-amount">
                      <div className="amount-value">
                        <span>{formatValue(getBetsAmount()).split('.')[0]}</span>.{formatValue(getBetsAmount()).split('.')[1]}
                      </div>
                    </div>
                  </div>
                  <div className="bets-content">
                    <div className="content-list">
                      {bets.map((bet) => (
                        <div key={bet._id} className="bet-element">
                          <div className="element-amount">{formatValue(bet.amount)}</div>
                          {bet.payout ? (
                            <div className="element-payout win">{formatValue(bet.payout)}</div>
                          ) : bet.multiplier ? (
                            <div className="element-multiplier">{(bet.multiplier / 100).toFixed(2)}x</div>
                          ) : (
                            <div className="element-pending">PENDING</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="controls-auto">
                <div className="auto-adjust">
                  <div className="adjust-win">
                    <input type="text" placeholder="% ON WIN" />
                  </div>
                  <div className="adjust-lose">
                    <input type="text" placeholder="% ON LOSS" />
                  </div>
                </div>
                <div className="auto-stop">
                  <div className="stop-profit">
                    <input type="text" placeholder="STOP ON PROFIT" />
                  </div>
                  <div className="stop-lose">
                    <input type="text" placeholder="STOP ON LOSS" />
                  </div>
                </div>
                <div className="auto-count">
                  <input type="text" placeholder="TOTAL BETS" />
                </div>
                <button className="button-auto">
                  <div className="button-inner">START AUTO BETTING</div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
