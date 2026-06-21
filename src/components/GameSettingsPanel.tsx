import { useState } from 'react';
import './GameSettingsPanel.css';

export type Difficulty = 'easy' | 'medium' | 'hard';

interface GameSettingsPanelProps {
  difficulty: Difficulty;
  setDifficulty: (difficulty: Difficulty) => void;
  showDifficulty?: boolean;
  showRisk?: boolean;
  showAutoPlay?: boolean;
  isGameActive: boolean;
}

export function GameSettingsPanel({
  difficulty,
  setDifficulty,
  showDifficulty = true,
  showRisk = false,
  showAutoPlay = true,
  isGameActive,
}: GameSettingsPanelProps) {
  const [autoPlay, setAutoPlay] = useState(false);
  const [autoBetCount, setAutoBetCount] = useState(10);
  const [stopOnProfit, setStopOnProfit] = useState('');
  const [stopOnLoss, setStopOnLoss] = useState('');

  return (
    <div className="game-settings-panel">
      {showDifficulty && (
        <div className="setting-group">
          <label>Difficulty</label>
          <div className="difficulty-selector">
            <button
              className={`difficulty-btn ${difficulty === 'easy' ? 'active' : ''}`}
              onClick={() => !isGameActive && setDifficulty('easy')}
              disabled={isGameActive}
            >
              Easy
            </button>
            <button
              className={`difficulty-btn ${difficulty === 'medium' ? 'active' : ''}`}
              onClick={() => !isGameActive && setDifficulty('medium')}
              disabled={isGameActive}
            >
              Medium
            </button>
            <button
              className={`difficulty-btn ${difficulty === 'hard' ? 'active' : ''}`}
              onClick={() => !isGameActive && setDifficulty('hard')}
              disabled={isGameActive}
            >
              Hard
            </button>
          </div>
        </div>
      )}

      {showRisk && (
        <div className="setting-group">
          <label>Risk</label>
          <div className="risk-selector">
            <button className="risk-btn">Low</button>
            <button className="risk-btn active">Medium</button>
            <button className="risk-btn">High</button>
          </div>
        </div>
      )}

      {showAutoPlay && (
        <div className="setting-group">
          <label>Auto Play</label>
          <div className="auto-play-controls">
            <button
              className={`auto-play-toggle ${autoPlay ? 'active' : ''}`}
              onClick={() => !isGameActive && setAutoPlay(!autoPlay)}
              disabled={isGameActive}
            >
              {autoPlay ? 'ON' : 'OFF'}
            </button>
            {autoPlay && (
              <div className="auto-play-settings">
                <div className="auto-play-input">
                  <label>Number of Bets</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={autoBetCount}
                    onChange={(e) => setAutoBetCount(parseInt(e.target.value) || 10)}
                    className="setting-input"
                  />
                </div>
                <div className="auto-play-input">
                  <label>Stop on Profit</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={stopOnProfit}
                    onChange={(e) => setStopOnProfit(e.target.value)}
                    className="setting-input"
                  />
                </div>
                <div className="auto-play-input">
                  <label>Stop on Loss</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={stopOnLoss}
                    onChange={(e) => setStopOnLoss(e.target.value)}
                    className="setting-input"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
