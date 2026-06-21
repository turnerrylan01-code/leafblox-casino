import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SolIcon } from './SolIcon';
import './GameBettingPanel.css';

interface GameBettingPanelProps {
  betAmount: number;
  setBetAmount: (amount: number) => void;
  currentMultiplier: number;
  potentialPayout: number;
  isGameActive: boolean;
  onBet: () => void;
  onCashout: () => void;
  profit?: number;
  showCashout?: boolean;
}

export function GameBettingPanel({
  betAmount,
  setBetAmount,
  currentMultiplier,
  potentialPayout,
  isGameActive,
  onBet,
  onCashout,
  profit = 0,
  showCashout = false,
}: GameBettingPanelProps) {
  const { balance } = useApp();
  const [inputValue, setInputValue] = useState(betAmount.toString());

  const quickBetMultipliers = [0.5, 1, 2];

  const handleQuickBet = (multiplier: number) => {
    const newAmount = balance * multiplier;
    setBetAmount(newAmount);
    setInputValue(newAmount.toString());
  };

  const handleMaxBet = () => {
    setBetAmount(balance);
    setInputValue(balance.toString());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Allow empty string or decimal point
    if (value === '' || value === '.') {
      setBetAmount(0);
      return;
    }
    
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setBetAmount(numValue);
    }
  };

  const handleBetClick = () => {
    if (betAmount > 0 && betAmount <= balance) {
      onBet();
    }
  };

  const handleCashoutClick = () => {
    onCashout();
  };

  return (
    <div className="game-betting-panel">
      <div className="betting-info">
        <div className="info-item">
          <span className="info-label">Balance</span>
          <span className="info-value">
            <SolIcon /> {balance.toFixed(3)}
          </span>
        </div>
        {isGameActive && (
          <div className="info-item">
            <span className="info-label">Multiplier</span>
            <span className="info-value multiplier">{currentMultiplier.toFixed(2)}x</span>
          </div>
        )}
        {isGameActive && (
          <div className="info-item">
            <span className="info-label">Profit</span>
            <span className={`info-value ${profit >= 0 ? 'green' : 'red'}`}>
              <SolIcon /> {profit.toFixed(3)}
            </span>
          </div>
        )}
      </div>

      <div className="betting-controls">
        <div className="bet-input-group">
          <label>Bet Amount</label>
          <div className="bet-input-wrapper">
            <input
              type="number"
              step="0.01"
              min="0.01"
              max={balance}
              value={inputValue}
              onChange={handleInputChange}
              disabled={isGameActive}
              className="bet-input"
            />
            <span className="bet-currency">SOL</span>
          </div>
        </div>

        <div className="quick-bet-buttons">
          {quickBetMultipliers.map((mult) => (
            <button
              key={mult}
              className="quick-bet-btn"
              onClick={() => handleQuickBet(mult)}
              disabled={isGameActive}
            >
              {mult}x
            </button>
          ))}
          <button
            className="quick-bet-btn max"
            onClick={handleMaxBet}
            disabled={isGameActive}
          >
            Max
          </button>
        </div>

        <div className="payout-display">
          <span className="payout-label">Potential Payout</span>
          <span className="payout-value">
            <SolIcon /> {potentialPayout.toFixed(3)}
          </span>
        </div>

        {showCashout ? (
          <button
            className="btn-cashout"
            onClick={handleCashoutClick}
            disabled={!isGameActive}
          >
            Cashout
          </button>
        ) : (
          <button
            className="btn-bet"
            onClick={handleBetClick}
            disabled={isGameActive || betAmount <= 0 || betAmount > balance}
          >
            Bet
          </button>
        )}
      </div>
    </div>
  );
}
