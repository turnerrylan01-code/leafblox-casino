import { useState, useEffect } from 'react';
import './Leaderboard.css';

interface Winner {
  _id: string;
  user: {
    username: string;
    avatar: string;
    rank: string;
    level: number;
  } | null;
  prize: number;
  points: number;
}

export function LeaderboardPage() {
  const [loading, setLoading] = useState(true);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [timer, setTimer] = useState('00:00:00:00');

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
      setWinners([
        {
          _id: '1',
          user: { username: 'CryptoKing', avatar: '', rank: 'user', level: 50 },
          prize: 1000,
          points: 5000
        },
        {
          _id: '2',
          user: { username: 'SolWhale', avatar: '', rank: 'user', level: 30 },
          prize: 500,
          points: 3500
        },
        {
          _id: '3',
          user: { username: 'DiamondHands', avatar: '', rank: 'user', level: 20 },
          prize: 250,
          points: 2000
        },
        {
          _id: '4',
          user: { username: 'MoonBoi', avatar: '', rank: 'user', level: 15 },
          prize: 100,
          points: 1500
        },
        {
          _id: '5',
          user: { username: 'HODLer', avatar: '', rank: 'user', level: 10 },
          prize: 50,
          points: 1000
        },
      ]);
    }, 1000);

    // Timer
    const interval = setInterval(() => {
      const now = new Date();
      const days = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setTimer(`${days}:${hours}:${minutes}:${seconds}`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatValue = (value: number) => {
    return (value / 1000).toFixed(2);
  };

  return (
    <div className="leaderboard">
      <div className="leaderboard-banner">
        <div className="leaderboard-background">
          <div className="bg-image"></div>
          <div className="beam-left"></div>
          <div className="beam-right"></div>
        </div>
        <div className="leaderboard-icons">
          <div className="icon-1"></div>
          <div className="icon-2"></div>
          <div className="icon-3"></div>
        </div>
        <div className="banner-inner">
          <div className="inner-title">
            <div className="title-inner">LEADERBOARD</div>
          </div>
          <div className="inner-ranks">
            <div className="ranks-step">2</div>
            <div className="ranks-step">1</div>
            <div className="ranks-step">3</div>
          </div>
          <div className="inner-info">COMPETE WITH PLAYERS AND EARN FREE MONEY! REWARDS ARE GIVEN OUT AND RESET WEEKLY</div>
        </div>
      </div>

      <div className="leaderboard-timer">
        <div className="timer-inner">
          <svg width="29" height="35" viewBox="0 0 29 35" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.5 0C6.49187 0 0 6.49187 0 14.5C0 22.5081 6.49187 29 14.5 29C22.5081 29 29 22.5081 29 14.5C29 6.49187 22.5081 0 14.5 0ZM14.5 26.1C8.09531 26.1 2.9 20.9047 2.9 14.5C2.9 8.09531 8.09531 2.9 14.5 2.9C20.9047 2.9 26.1 8.09531 26.1 14.5C26.1 20.9047 20.9047 26.1 14.5 26.1Z" />
            <path d="M14.5 7.25V14.5H21.75" />
          </svg>
          <div className="inner-value">
            <span>{timer.split(':')[0]}</span>d 
            <span>{timer.split(':')[1]}</span>h 
            <span>{timer.split(':')[2]}</span>m 
            <span>{timer.split(':')[3]}</span>s
          </div>
        </div>
      </div>

      <div className="leaderboard-ranks">
        <div className="ranks-header">
          <div className="rank-pos">#</div>
          <div className="rank-user">USER</div>
          <div className="rank-prize">PRIZE</div>
          <div className="rank-wagered">WAGERED</div>
        </div>
        <div className="ranks-content">
          {loading ? (
            <div className="content-loading">Loading...</div>
          ) : winners.length > 0 ? (
            <div className="content-list">
              {winners.map((winner, index) => (
                <div key={winner._id} className={`leaderboard-user-element ${index === 0 ? 'first' : ''} ${index === 1 ? 'second' : ''} ${index === 2 ? 'third' : ''}`}>
                  <div className="element-crown">
                    <span>👑</span>
                  </div>
                  <div className="element-inner">
                    <div className="inner-pos">{index + 1}</div>
                    <div className={`inner-user ${winner.user ? `user-${winner.user.rank}` : 'user-hidden'}`}>
                      <div className="user-avatar">
                        <span>👤</span>
                      </div>
                      <span>{winner.user?.username || 'Anonymous'}</span>
                    </div>
                    <div className="inner-prize">
                      <div className="prize-content">
                        <span>💰</span>
                        <div className="content-value">
                          <span>{formatValue(winner.prize).split('.')[0]}</span>.{formatValue(winner.prize).split('.')[1]}
                        </div>
                      </div>
                    </div>
                    <div className="inner-wagered">
                      <div className="wagered-content">
                        <span>💰</span>
                        <div className="content-value">
                          <span>{formatValue(winner.points).split('.')[0]}</span>.{formatValue(winner.points).split('.')[1]}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="content-empty">No leaderboard found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
