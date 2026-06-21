import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { getUserTags, ALL_TAGS } from '../data/tags';
import './Chat.css';

export function Chat() {
  const { soundEnabled, setSoundEnabled } = useApp();
  const { walletAddress, username } = useAuth();
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [onlineCount, setOnlineCount] = useState(0);
  const [rainActive, setRainActive] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  const emojis = ['😀', '😂', '😍', '🎉', '🔥', '💰', '🎮', '🔥', '💎', '🚀', '🎰', '🏆', '💯', '✨', '🎁'];

  const containsLink = (text: string): boolean => {
    const linkRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([^\s]+\.[^\s]{2,})/gi;
    return linkRegex.test(text);
  };

  const containsSuspiciousContent = (text: string): boolean => {
    const suspiciousPatterns = [
      /(discord\.(gg|com|io))/gi,
      /(telegram\.(me|org|com))/gi,
      /(twitter\.com|x\.com)/gi,
      /(instagram\.com)/gi,
      /(facebook\.com)/gi,
      /(tiktok\.com)/gi,
      /(youtube\.com|youtu\.be)/gi,
      /(twitch\.tv)/gi,
      /(steam\.com)/gi,
      /(reddit\.com)/gi,
      /(snapchat\.com)/gi,
      /(whatsapp\.com)/gi,
      /(skype\.com)/gi,
      /(zoom\.us)/gi,
      /(bit\.ly|tinyurl\.com|short\.io)/gi,
      /(free\s*(money|sol|btc|crypto|coins))/gi,
      /(giveaway|airdrop|bonus|reward|claim)/gi,
      /(scam|phish|hack|exploit|cheat)/gi,
    ];
    return suspiciousPatterns.some(pattern => pattern.test(text));
  };

  useEffect(() => {
    // Simulate loading messages
    setTimeout(() => {
      setLoading(false);
      setMessages([
        { _id: '1', type: 'system', message: 'Welcome to the chat! 🎉' },
        { _id: '2', type: 'user', user: { username: 'User1', rank: 'user' }, message: 'Hello everyone! 👋' },
        { _id: '3', type: 'bot', message: '🤖 Auto-Bot: Links are not allowed in chat!' },
      ]);
      setOnlineCount(42);
    }, 1000);
  }, []);

  useEffect(() => {
    if (chatOpen && chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatOpen, messages]);

  const handleSendMessage = () => {
    if (!walletAddress) {
      alert('Please sign in to perform this action.');
      return;
    }

    const message = chatMessage.trim();
    if (message === '') {
      alert('Please enter a message.');
      return;
    }

    // Link detection bot
    if (containsLink(message) || containsSuspiciousContent(message)) {
      setMessages([...messages, {
        _id: Date.now().toString(),
        type: 'bot',
        message: '🤖 Auto-Bot: Links or suspicious content are not allowed in chat! Your message was blocked.',
      }]);
      setChatMessage('');
      return;
    }

    setMessages([...messages, {
      _id: Date.now().toString(),
      type: 'user',
      user: { username: username || 'You', rank: 'user' },
      message: message,
    }]);
    setChatMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setChatMessage(chatMessage + emoji);
    setShowEmojis(false);
  };

  const getUserTag = (wallet: string) => {
    const tags = getUserTags(wallet);
    if (tags.length === 0) return null;
    const tagId = tags[0];
    return ALL_TAGS.find(tag => tag.id === tagId);
  };

  return (
    <aside id="chat" className={`${chatOpen ? 'chat-open' : ''} ${rainActive ? 'chat-rain' : ''}`}>
      <div className="chat-toggle">
        <button onClick={() => setChatOpen(true)}>
          <div className="button-inner">
            <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.75 0H2.25C1.00736 0 0 1.00736 0 2.25V14.25C0 15.4926 1.00736 16.5 2.25 16.5H4.91251L4.50452 20.1675C4.45904 20.5792 4.75593 20.9498 5.16766 20.9953C5.38027 21.0188 5.59278 20.9503 5.75178 20.8073L10.5383 16.5H18.75C19.9926 16.5 21 15.4926 21 14.25V2.25C21 1.00736 19.9926 0 18.75 0Z" />
            </svg>
          </div>
        </button>
      </div>
      <div className="chat-header">
        <button onClick={() => setChatOpen(false)} className="button-close">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.5 1.5L1.5 11.5M1.5 1.5L11.5 11.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <div className="header-online">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0ZM8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8C14 11.3137 11.3137 14 8 14Z" />
          </svg>
          <span className="gradient-green">{onlineCount}</span>
        </div>
        <div className="header-room">
          <span>Global</span>
        </div>
      </div>
      <div className="chat-content">
        <div className="content-messages" ref={chatMessagesRef}>
          {loading ? (
            <div className="messages-loading">
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="loading-placeholder">
                  <div className="placeholder-user">
                    <div className="user-avatar"></div>
                    <div className="user-username"></div>
                  </div>
                  <div className="placeholder-text"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="messages-list">
              {messages.map((message) => (
                <div key={message._id} className="message-element">
                  {message.type === 'system' ? (
                    <div className="message-system">{message.message}</div>
                  ) : message.type === 'bot' ? (
                    <div className="message-bot">
                      <div className="message-avatar">
                        <span>🤖</span>
                      </div>
                      <div className="message-content">
                        <div className="message-username">Auto-Bot</div>
                        <div className="message-text">{message.message}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="message-user">
                      <div className="message-avatar">
                        <span>👤</span>
                      </div>
                      <div className="message-content">
                        <div className="message-username">
                          {message.user.username}
                          {message.user.walletAddress && getUserTag(message.user.walletAddress) && (
                            <span className="user-tag">
                              {getUserTag(message.user.walletAddress)?.emoji} {getUserTag(message.user.walletAddress)?.name}
                            </span>
                          )}
                        </div>
                        <div className="message-text">{message.message}</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="content-lock"></div>
        <div className="content-rain">
          {rainActive && (
            <div className="rain-join">
              <div className="rain-info">Rain is active! Join now!</div>
            </div>
          )}
        </div>
      </div>
      <div className="chat-footer">
        <div className="footer-input">
          <input
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            type="text"
            placeholder="TYPE A MESSAGE..."
          />
          <button onClick={handleSendMessage} className="button-send">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.5 9L1.5 1.5L4.5 16.5L9 10.5L16.5 9Z" />
            </svg>
          </button>
        </div>
        <div className="footer-actions">
          <button className="button-rules" onClick={() => setShowRules(!showRules)}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 0C3.13401 0 0 3.13401 0 7C0 10.866 3.13401 14 7 14C10.866 14 14 10.866 14 7C14 3.13401 10.866 0 7 0ZM7 12C4.23858 12 2 9.76142 2 7C2 4.23858 4.23858 2 7 2C9.76142 2 12 4.23858 12 7C12 9.76142 9.76142 12 7 12Z" />
              <path d="M7 4V7H10" />
            </svg>
            CHAT RULES
          </button>
          <button className="button-emojis" onClick={() => setShowEmojis(!showEmojis)}>
            <span>😀</span>
          </button>
        </div>
        {showEmojis && (
          <div className="emoji-picker">
            {emojis.map((emoji, index) => (
              <button key={index} onClick={() => handleEmojiClick(emoji)}>
                {emoji}
              </button>
            ))}
          </div>
        )}
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
      </div>
    </aside>
  );
}


