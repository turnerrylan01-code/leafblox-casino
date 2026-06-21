import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useCoinflip } from '../context/CoinflipContext';
import { creditCreatorOnJoin, addXP, statsStorageKey } from '../lib/auth';
import { SolIcon } from '../components/SolIcon';
import { CoinAnimation } from '../components/CoinAnimation';
import './Coinflip.css';

export function CoinflipPage() {
  const {
    balance, setBalance, username, avatar, showToast,
    incrementTotalBets, addWager, addGamePlayed, recordGameResult,
  } = useApp();
  const { authUserId } = useAuth();
  const { games, createGame, joinGame, addBot } = useCoinflip();
  const [betAmount, setBetAmount] = useState('0.10');
  const [sortBy, setSortBy] = useState('highest');
  const [filterAmount, setFilterAmount] = useState('all');
  const [createChoice, setCreateChoice] = useState<'heads' | 'tails'>('heads');
  const [joinChoice, setJoinChoice] = useState<'heads' | 'tails'>('heads');

  const amount = parseFloat(betAmount) || 0;
  const userKey = authUserId || '';

  const handleCreate = () => {
    if (amount <= 0) { showToast('Enter a valid bet amount'); return; }
    if (amount > balance) { showToast('Insufficient balance'); return; }
    setBalance(prev => prev - amount);
    createGame(amount, username, avatar, userKey, createChoice);
    incrementTotalBets();
    addWager(amount);
    addXP(statsStorageKey(userKey), amount);
    showToast('Flip created!');
  };

  const handleJoin = (gameId: string, gameAmount: number, creatorUserId: string) => {
    if (creatorUserId === userKey) {
      showToast("You can't join your own flip");
      return;
    }
    if (gameAmount > balance) { showToast('Insufficient balance'); return; }
    const result = joinGame(gameId, username, avatar, userKey, joinChoice);
    if (!result) return;

    const { winner, amount: bet, coinResult } = result;
    const pot = bet * 2;
    const profit = bet;

    setBalance(prev => prev - bet);
    incrementTotalBets();
    addWager(bet);
    addGamePlayed();
    addXP(statsStorageKey(userKey), bet);

    if (winner === 2) {
      setBalance(prev => prev + pot);
      recordGameResult('coinflip', bet, profit, 2);
      creditCreatorOnJoin(result.creatorUserId, bet, false);
      showToast(`Coin landed on ${coinResult}! You won ${pot.toFixed(3)} SOL!`);
    } else {
      recordGameResult('coinflip', bet, -bet, 0);
      creditCreatorOnJoin(result.creatorUserId, bet, true);
      showToast(`Coin landed on ${coinResult}. You lost the flip`);
    }
  };

  const handleAddBot = (gameId: string) => {
    const result = addBot(gameId, userKey);
    if (!result) {
      showToast("You can only add bots to your own flips");
      return;
    }

    const { winner, amount: bet, coinResult } = result;
    const pot = bet * 2;
    const profit = bet;

    incrementTotalBets();
    addWager(bet);
    addGamePlayed();
    addXP(statsStorageKey(userKey), bet);

    if (winner === 1) {
      setBalance(prev => prev + pot);
      recordGameResult('coinflip', bet, profit, 1);
      showToast(`Coin landed on ${coinResult}! You won ${pot.toFixed(3)} SOL against the bot!`);
    } else {
      recordGameResult('coinflip', bet, -bet, 0);
      showToast(`Coin landed on ${coinResult}. You lost the flip to the bot`);
    }
  };

  const adjustBet = (action: '+0.01' | 'half' | 'double') => {
    const current = parseFloat(betAmount) || 0;
    if (action === '+0.01') setBetAmount((current + 0.01).toFixed(2));
    else if (action === 'half') setBetAmount(Math.max(0.01, current / 2).toFixed(2));
    else setBetAmount((current * 2).toFixed(2));
  };

  let filtered = [...games];
  if (filterAmount === 'low') filtered = filtered.filter(g => g.amount < 1);
  else if (filterAmount === 'mid') filtered = filtered.filter(g => g.amount >= 1 && g.amount < 5);
  else if (filterAmount === 'high') filtered = filtered.filter(g => g.amount >= 5);
  if (sortBy === 'highest') filtered.sort((a, b) => b.amount - a.amount);
  else if (sortBy === 'lowest') filtered.sort((a, b) => a.amount - b.amount);
  else filtered.sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="coinflip-page">
      <div className="page-title">
        <span className="coinflip-icon">🔄</span>
        <h1>COINFLIP</h1>
      </div>

      <div className="coinflip-controls">
        <span className="games-count">Games {games.length}</span>

        <div className="bet-input-group">
          <SolIcon />
          <input
            type="number"
            value={betAmount}
            onChange={e => setBetAmount(e.target.value)}
            min="0.01"
            step="0.01"
          />
        </div>

        <button className="bet-adjust" onClick={() => adjustBet('+0.01')}>+0.01</button>
        <button className="bet-adjust" onClick={() => adjustBet('half')}>1/2</button>
        <button className="bet-adjust" onClick={() => adjustBet('double')}>x2</button>

        <div className="choice-selector">
          <button
            className={`choice-btn ${createChoice === 'heads' ? 'active' : ''}`}
            onClick={() => setCreateChoice('heads')}
          >
            🪙 Heads
          </button>
          <button
            className={`choice-btn ${createChoice === 'tails' ? 'active' : ''}`}
            onClick={() => setCreateChoice('tails')}
          >
            🪙 Tails
          </button>
        </div>

        <button className="btn-primary create-flip-btn" onClick={handleCreate}>
          + Create Flip
        </button>

        <div className="coinflip-filters">
          <select value={filterAmount} onChange={e => setFilterAmount(e.target.value)}>
            <option value="all">Amount: All Games</option>
            <option value="low">Under 1 SOL</option>
            <option value="mid">1 - 5 SOL</option>
            <option value="high">5+ SOL</option>
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="highest">Sort By: Highest Price</option>
            <option value="lowest">Sort By: Lowest Price</option>
            <option value="newest">Sort By: Newest</option>
          </select>
        </div>
      </div>

      <div className="coinflip-list">
        {filtered.length === 0 && (
          <div className="coinflip-empty">No games yet. Create a flip to get started!</div>
        )}
        {filtered.map(game => (
          <div key={game.id} className="coinflip-row">
            <span className="player-name">{game.player1.username || ''}</span>
            <div className="player-avatar">
              {game.player1.avatar ? (
                <img src={game.player1.avatar} alt="" />
              ) : (
                <div className="avatar-box">👤</div>
              )}
            </div>

            <div className="vs-icon">⚔</div>

            {game.player2 ? (
              <>
                <div className="player-avatar">
                  {game.player2.avatar ? (
                    <img src={game.player2.avatar} alt="" />
                  ) : (
                    <div className="avatar-box">👤</div>
                  )}
                </div>
                <span className="player-name">{game.player2.username || ''}</span>
              </>
            ) : (
              <>
                <div className="player-avatar empty">
                  <div className="avatar-box waiting">?</div>
                </div>
                {game.player1.userId === userKey ? (
                  <button
                    className="join-btn"
                    onClick={() => handleAddBot(game.id)}
                  >
                    Add Bot
                  </button>
                ) : (
                  <>
                    <div className="choice-selector small">
                      <button
                        className={`choice-btn ${joinChoice === 'heads' ? 'active' : ''}`}
                        onClick={() => setJoinChoice('heads')}
                      >
                        🪙
                      </button>
                      <button
                        className={`choice-btn ${joinChoice === 'tails' ? 'active' : ''}`}
                        onClick={() => setJoinChoice('tails')}
                      >
                        🪙
                      </button>
                    </div>
                    <button
                      className="join-btn"
                      onClick={() => handleJoin(game.id, game.amount, game.player1.userId)}
                      disabled={game.player1.userId === userKey}
                    >
                      Join
                    </button>
                  </>
                )}
              </>
            )}

            <div className="bet-amount">
              <SolIcon /> {game.amount.toFixed(4)}
            </div>

            {game.status === 'finished' && game.coinResult ? (
              <div className="coin-display">
                <CoinAnimation result={game.coinResult} />
              </div>
            ) : (
              <div className="winner-box waiting-status">
                <span>{game.status === 'waiting' ? 'Waiting' : 'Active'}</span>
              </div>
            )}

            <button className="view-btn">👁</button>
          </div>
        ))}
      </div>
    </div>
  );
}
