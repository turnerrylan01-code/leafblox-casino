import './GameHistoryPanel.css';

interface GameHistoryItem {
  id: string;
  betAmount: number;
  multiplier: number;
  payout: number;
  won: boolean;
  timestamp: number;
}

interface GameHistoryPanelProps {
  history: GameHistoryItem[];
}

export function GameHistoryPanel({ history }: GameHistoryPanelProps) {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="game-history-panel">
      <div className="history-header">
        <h3>Recent Games</h3>
      </div>
      <div className="history-list">
        {history.length === 0 ? (
          <div className="history-empty">No games played yet</div>
        ) : (
          history.slice(0, 10).map((item) => (
            <div key={item.id} className={`history-item ${item.won ? 'won' : 'lost'}`}>
              <div className="history-time">{formatTime(item.timestamp)}</div>
              <div className="history-bet">{item.betAmount.toFixed(3)} SOL</div>
              <div className="history-multiplier">{item.multiplier.toFixed(2)}x</div>
              <div className={`history-payout ${item.won ? 'green' : 'red'}`}>
                {item.won ? '+' : ''}{item.payout.toFixed(3)} SOL
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
