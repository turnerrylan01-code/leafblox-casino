import { useNavigate } from 'react-router-dom';
import { getGameById, type GameId } from '../data/games';
import './GamePage.css';

interface GamePageProps {
  gameId: GameId;
}

export function GamePage({ gameId }: GamePageProps) {
  const game = getGameById(gameId)!;
  const navigate = useNavigate();

  if (game.soon) {
    return (
      <div className="game-page">
        <div className="page-title">
          <h1>{game.name.toUpperCase()}</h1>
        </div>
        <div className="game-soon-card card">
          <span className="soon-badge-lg">SOON</span>
          <p>{game.name} is coming soon. Stay tuned!</p>
          <button className="btn-primary" onClick={() => navigate('/coinflip')}>
            Back to Coinflip
          </button>
        </div>
      </div>
    );
  }

  if (gameId === 'coinflip') return null;

  return (
    <div className="game-page">
      <div className="page-title">
        <h1>{game.name.toUpperCase()}</h1>
      </div>
      <div className="game-placeholder card">
        <p>{game.name} is available from the games menu.</p>
        <p className="game-hint">Full gameplay coming soon — use Coinflip to play and earn now.</p>
        <button className="btn-primary" onClick={() => navigate('/coinflip')}>
          Play Coinflip
        </button>
      </div>
    </div>
  );
}
