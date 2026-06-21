import { useState, useEffect } from 'react';
import './AdminPanel.css';

export function AdminChat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [mutedUsers, setMutedUsers] = useState<any[]>([]);
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    loadChatData();
  }, []);

  const loadChatData = () => {
    // Load real chat messages from localStorage
    const storedMessages = JSON.parse(localStorage.getItem('chat_messages') || '[]');
    setMessages(storedMessages);

    // Load real muted users from localStorage
    const allUsers = Object.keys(localStorage).filter(key => key.startsWith('endfun_stats_'));
    const mutedUsersData: any[] = [];

    allUsers.forEach(key => {
      try {
        const userData = JSON.parse(localStorage.getItem(key) || '{}');
        if (userData.isMuted) {
          mutedUsersData.push({
            id: key.replace('endfun_stats_', ''),
            user: userData.username || 'Unknown',
            reason: 'Muted by admin',
            mutedUntil: 'Permanent'
          });
        }
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    });

    setMutedUsers(mutedUsersData);
  };

  const deleteMessage = (id: number) => {
    setMessages(messages.map(m => 
      m.id === id ? { ...m, status: 'deleted' } : m
    ));
  };

  const unmuteUser = (id: number) => {
    setMutedUsers(mutedUsers.filter(u => u.id !== id));
  };

  const sendAnnouncement = () => {
    if (announcement.trim()) {
      // In production, this would send to the chat system
      alert(`Announcement sent: ${announcement}`);
      setAnnouncement('');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Chat Moderation</h1>
      </div>

      <div className="admin-content">
        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-label">Total Messages</div>
            <div className="stat-value">{messages.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Muted Users</div>
            <div className="stat-value">{mutedUsers.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Deleted Messages</div>
            <div className="stat-value">{messages.filter(m => m.status === 'deleted').length}</div>
          </div>
        </div>

        <div className="chat-section">
          <div className="announcement-box">
            <h3>Send Announcement</h3>
            <textarea
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              placeholder="Enter announcement message..."
              className="announcement-input"
            />
            <button className="btn-primary" onClick={sendAnnouncement}>
              Send Announcement
            </button>
          </div>

          <div className="muted-users-section">
            <h3>Muted Users</h3>
            <div className="muted-users-list">
              {mutedUsers.map((user) => (
                <div key={user.id} className="muted-user-card">
                  <div className="user-info">
                    <span className="user-name">{user.user}</span>
                    <span className="mute-reason">{user.reason}</span>
                    <span className="mute-until">Until: {user.mutedUntil}</span>
                  </div>
                  <button 
                    className="btn-action btn-unmute"
                    onClick={() => unmuteUser(user.id)}
                  >
                    Unmute
                  </button>
                </div>
              ))}
              {mutedUsers.length === 0 && (
                <p className="no-muted-users">No muted users</p>
              )}
            </div>
          </div>

          <div className="chat-messages-section">
            <h3>Recent Messages</h3>
            <div className="chat-messages-list">
              {messages.map((message) => (
                <div key={message.id} className={`chat-message ${message.status}`}>
                  <div className="message-header">
                    <span className="message-user">{message.user}</span>
                    <span className="message-time">{message.time}</span>
                  </div>
                  <div className="message-content">{message.message}</div>
                  {message.status === 'active' && (
                    <div className="message-actions">
                      <button 
                        className="btn-action btn-delete"
                        onClick={() => deleteMessage(message.id)}
                      >
                        Delete
                      </button>
                      <button className="btn-action btn-mute">Mute User</button>
                    </div>
                  )}
                  {message.status === 'deleted' && (
                    <span className="deleted-badge">Deleted</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
