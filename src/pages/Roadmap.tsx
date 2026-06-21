import { useNavigate } from 'react-router-dom';
import { SolIcon } from '../components/SolIcon';
import './Roadmap.css';

const MILESTONES = [
  { amount: '50', title: 'MINES', sub: '5x5 grid, 1-24 mines', action: 'Play!', path: '/mines', unlocked: false },
  { amount: '100', title: 'CHICKS', sub: 'Cross the road safely', action: 'Play!', path: '/chicks', unlocked: false },
  { amount: '150', title: 'LATINA TOWER', sub: 'Climb to the top', action: 'Play!', path: '/latina-tower', unlocked: false },
  { amount: '200', title: 'SLOTS', sub: 'Spin to win', action: 'Locked', unlocked: false },
  { amount: '278', title: 'JACKPOT', sub: 'Grand prize awaits', action: 'Locked', unlocked: false },
];

const CONTRIBUTORS = Array.from({ length: 5 }, (_, i) => ({
  rank: i + 1,
  username: '',
  avatar: '',
  wagered: 0,
}));

export function RoadmapPage() {
  const navigate = useNavigate();
  const progress = 156.42;
  const goal = 278;
  const progressPct = (progress / goal) * 100;

  return (
    <div className="roadmap-page">
      <div className="page-title">
        <span>🗺</span>
        <h1>COMMUNITY ROADMAP</h1>
      </div>

      <div className="roadmap-progress-header">
        Wagered <SolIcon /> {progress.toLocaleString(undefined, { minimumFractionDigits: 2 })} / {goal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        <span className="info-icon">ⓘ</span>
      </div>

      <div className="roadmap-bar-container">
        <div className="roadmap-bar">
          <div className="roadmap-fill" style={{ width: `${progressPct}%` }} />
          {[50, 100, 150, 200, 278].map(k => (
            <div
              key={k}
              className={`roadmap-node ${progress >= k ? 'reached' : ''}`}
              style={{ left: `${(k / 278) * 100}%` }}
            />
          ))}
        </div>
        <div className="roadmap-labels">
          {['50','100','150','200','278'].map(l => (
            <span key={l}>{l}</span>
          ))}
        </div>
      </div>

      <div className="dump-progress">
        Next Milestone <SolIcon /> {progress.toLocaleString(undefined, { minimumFractionDigits: 2 })} / 200.00
        <div className="dump-bar">
          <div className="dump-fill" style={{ width: `${(progress / 200) * 100}%` }} />
        </div>
      </div>

      <div className="milestone-cards">
        {MILESTONES.map(m => (
          <div key={m.title} className={`milestone-card ${!m.unlocked ? 'locked' : ''}`}>
            <span className="milestone-amount">{m.amount}</span>
            <span className="milestone-title">{m.title}</span>
            {m.sub && <span className="milestone-sub">{m.sub}</span>}
            {!m.unlocked && <span className="lock-icon">🔒</span>}
            <button
              className={`btn-primary milestone-btn ${!m.unlocked ? 'locked' : ''}`}
              onClick={() => m.unlocked && m.path && navigate(m.path)}
              disabled={!m.unlocked}
            >
              {m.action}
            </button>
          </div>
        ))}
      </div>

      <div className="roadmap-info">
        <div className="info-col">
          <div className="info-icon-box">⚙</div>
          <strong>HOW IT WORKS</strong>
          <p>Community SOL wagered counts. Only SOL, no other currencies.</p>
        </div>
        <div className="info-col">
          <div className="info-icon-box">✕</div>
          <strong>EXCLUSIONS</strong>
          <p>Admins, mods, and streamers excluded from totals.</p>
        </div>
        <div className="info-col">
          <div className="info-icon-box">↻</div>
          <strong>UPDATES</strong>
          <p>Stats refresh every 4 hours automatically by the system.</p>
        </div>
      </div>

      <div className="contributors-section">
        <div className="section-divider">Top Contributors</div>
        <div className="contributors-list">
          {CONTRIBUTORS.map(c => (
            <div key={c.rank} className="contributor-row">
              <span className={`rank-ribbon rank-${c.rank}`}>{c.rank}</span>
              <div className="contributor-player">
                <div className="avatar-box-sm">👤</div>
                <span className="contributor-name">{c.username || ''}</span>
                {c.rank <= 3 && <span className="top-badge">TOP #{c.rank}</span>}
              </div>
              <span className="contributor-wagered">
                <SolIcon /> {c.wagered.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
