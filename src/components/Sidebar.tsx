import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useChat } from '../context/ChatContext';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { getLevelFromXP, loadStats, statsStorageKey } from '../lib/auth';
import './Sidebar.css';

export function Sidebar() {
  const { messages, sendMessage, onlineCount } = useChat();
  const { username, avatar, totalBets, setShowTagsModal } = useApp();
  const { walletAddress } = useAuth();
  const [input, setInput] = useState('');
  const [showRules, setShowRules] = useState(false);
  const [actualOnlineCount, setActualOnlineCount] = useState(onlineCount);
  const [userLevel, setUserLevel] = useState(getLevelFromXP(0));
  const [userStats, setUserStats] = useState<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (walletAddress) {
      const stats = loadStats(statsStorageKey(walletAddress));
      setUserLevel(getLevelFromXP(stats.xp));
      setUserStats(stats);
    }
  }, [walletAddress]);

  useEffect(() => {
    // Simulate dynamic online count
    const updateOnlineCount = () => {
      const randomCount = Math.floor(Math.random() * 50) + 20; // Random between 20-70
      setActualOnlineCount(randomCount);
    };
    
    updateOnlineCount();
    const interval = setInterval(updateOnlineCount, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    if (!username || username.trim() === '') {
      alert('Please set a username in your profile to chat. Click on your profile picture or go to the Profile page to set your username.');
      return;
    }
    
    // Auto mod bot checks
    const containsLink = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([^\s]+\.[^\s]{2,})/gi.test(input);
    const containsBadWords = /(fuck|shit|ass|bitch|damn|crap|hell|bastard|idiot|stupid|retard)/gi.test(input);
    const isSpam = input.length > 200 || (input.match(/(.)\1{4,}/g) !== null);
    
    if (containsLink) {
      alert('🤖 Auto-Mod: Links are not allowed in chat!');
      setInput('');
      return;
    }
    
    if (containsBadWords) {
      alert('🤖 Auto-Mod: Please keep the chat clean and respectful!');
      setInput('');
      return;
    }
    
    if (isSpam) {
      alert('🤖 Auto-Mod: Please don\'t spam the chat!');
      setInput('');
      return;
    }
    
    sendMessage(input, username, avatar);
    setInput('');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-title" onClick={() => setShowRules(!showRules)}>📋 Chat Rules</span>
        <span className="online-count">{actualOnlineCount} Online</span>
      </div>

      {showRules && (
        <div className="chat-rules-modal">
          <div className="rules-content">
            <h4>Chat Rules</h4>
            <ul>
              <li>Be respectful to all users</li>
              <li>No spamming or flooding the chat</li>
              <li>No links allowed (auto-detected and blocked)</li>
              <li>No inappropriate language or content</li>
              <li>No scam attempts or phishing</li>
              <li>No sharing personal information</li>
              <li>No begging or asking for money</li>
              <li>No advertising other gambling sites</li>
              <li>No harassment or bullying</li>
              <li>No discussing illegal activities</li>
              <li>No exploiting bugs or glitches</li>
              <li>No impersonating staff or other users</li>
              <li>No sharing referral codes excessively</li>
              <li>English language only in main chat</li>
            </ul>
            <button onClick={() => setShowRules(false)}>Close</button>
          </div>
        </div>
      )}

      <div className="chat-feed">
        {messages.length === 0 && (
          <div className="chat-empty">No messages yet. Say hello!</div>
        )}
        {messages.map(msg => (
          <div key={msg.id} className="chat-message">
            <div className="chat-avatar">
              {msg.avatar && msg.avatar.startsWith('http') ? (
                <img src={msg.avatar} alt="" />
              ) : msg.avatar ? (
                <div className="avatar-placeholder-sm">{msg.avatar}</div>
              ) : (
                <div className="avatar-placeholder-sm">👤</div>
              )}
            </div>
            <div className="chat-content">
              <div className="chat-meta">
                {msg.username && <span className="chat-username">{msg.username}</span>}
                {msg.rank && <span className="chat-rank">{msg.rank}</span>}
                <span className="chat-level" style={{ color: userLevel.color }}>
                  {userLevel.emoji} {userLevel.name}
                </span>
              </div>
              <div className="chat-text">{msg.message}</div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <form className="chat-input-form" onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          autoFocus
        />
        <button type="submit" className="send-btn">➤</button>
      </form>

      <div className="sidebar-footer">
        <Link to="/fairness" className="fairness-link">
          🛡 Fairness
        </Link>
        <button className="rules-btn" onClick={() => setShowRules(!showRules)}>
          📋 Chat Rules
        </button>
        <button className="tags-btn" onClick={() => setShowTagsModal(true)}>
          🏷️ Tags
        </button>
        <div className="total-bets">
          {totalBets.toLocaleString()} Total Bets
        </div>
      </div>
    </aside>
  );
}
