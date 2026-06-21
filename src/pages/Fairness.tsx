import { useState } from 'react';
import { GAMES } from '../data/games';
import './Fairness.css';

const EXTRA_TABS = ['Transactions', 'Terms'];
const TABS = ['Overview', ...GAMES.map(g => g.name), ...EXTRA_TABS];

export function FairnessPage() {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className="fairness-page">
      <div className="page-title">
        <span className="fairness-shield">🛡</span>
        <h1>FAIRNESS</h1>
      </div>

      <div className="fairness-tabs">
        {TABS.map(tab => (
          <button
            key={tab}
            className={`fairness-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Overview' && (
        <div className="fairness-content">
          <div className="card fairness-section">
            <h2>Provably Fair Games</h2>
            <p>
              All game outcomes on Leaf Blox are determined by cryptographic algorithms.
              Every result can be independently verified by you — we cannot manipulate outcomes
              after a round has started.
            </p>
          </div>

          <div className="card fairness-section">
            <h2>1. How Random Numbers Are Generated</h2>
            <p>
              Before each game round, the server generates a secret seed and shows you its hash
              (a fingerprint). Think of it like sealing the outcome in an envelope — you can see
              the seal, but not what's inside until the round ends.
            </p>
            <p>
              When the round completes, the server reveals the original seed. You can verify
              that the hash matches, proving we didn't change the outcome mid-round.
            </p>

            <div className="code-block">
              <div className="code-label">ACTUAL CODE THAT GENERATES RANDOM NUMBERS</div>
              <pre><code>{`// SHA-256 based random number generator
function seedRandom(seed) {
  let state = seed;
  return function rand() {
    const hash = crypto.createHash('sha256')
                       .update(state).digest('hex');
    state = hash;
    const value = parseInt(hash.substring(0, 16), 16);
    return value / 0xFFFFFFFFFFFFFFFF;
  };
}`}</code></pre>
            </div>

            <p className="code-note">
              This takes the locked seed and turns it into a random number between 0 and 1.
              No wallets, no usernames, no bet sizes go into this — it's pure math.
            </p>
          </div>
        </div>
      )}

      {activeTab !== 'Overview' && (
        <div className="card fairness-section">
          <h2>{activeTab}</h2>
          <p className="tab-placeholder">
            Provably fair verification details for {activeTab} will be available here.
          </p>
        </div>
      )}
    </div>
  );
}
