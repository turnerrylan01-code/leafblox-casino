import { useState, useEffect } from 'react';
import './AdminPanel.css';

export function AdminSupport() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = () => {
    // Load real support tickets from localStorage
    const storedTickets = JSON.parse(localStorage.getItem('support_tickets') || '[]');
    setTickets(storedTickets);
  };

  const updateTicketStatus = (id: number, status: string) => {
    setTickets(tickets.map(t => 
      t.id === id ? { ...t, status } : t
    ));
  };

  const assignTicket = (id: number, admin: string) => {
    setTickets(tickets.map(t => 
      t.id === id ? { ...t, assignedTo: admin } : t
    ));
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Support System</h1>
      </div>

      <div className="admin-content">
        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-label">Open Tickets</div>
            <div className="stat-value">{tickets.filter(t => t.status === 'open').length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">In Progress</div>
            <div className="stat-value">{tickets.filter(t => t.status === 'in-progress').length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Closed</div>
            <div className="stat-value">{tickets.filter(t => t.status === 'closed').length}</div>
          </div>
        </div>

        <div className="support-layout">
          <div className="tickets-list">
            <h3>Support Tickets</h3>
            {tickets.map((ticket) => (
              <div 
                key={ticket.id} 
                className={`ticket-card ${selectedTicket?.id === ticket.id ? 'selected' : ''}`}
                onClick={() => setSelectedTicket(ticket)}
              >
                <div className="ticket-header">
                  <span className="ticket-id">#{ticket.id}</span>
                  <span className={`status-badge ${ticket.status}`}>{ticket.status}</span>
                  <span className={`priority-badge ${ticket.priority}`}>{ticket.priority}</span>
                </div>
                <div className="ticket-user">{ticket.user}</div>
                <div className="ticket-subject">{ticket.subject}</div>
                <div className="ticket-meta">
                  <span>{ticket.createdAt}</span>
                  {ticket.assignedTo && <span>Assigned: {ticket.assignedTo}</span>}
                </div>
              </div>
            ))}
          </div>

          {selectedTicket && (
            <div className="ticket-detail">
              <div className="ticket-detail-header">
                <h3>#{selectedTicket.id} - {selectedTicket.subject}</h3>
                <div className="ticket-actions">
                  <select 
                    value={selectedTicket.status}
                    onChange={(e) => updateTicketStatus(selectedTicket.id, e.target.value)}
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="closed">Closed</option>
                  </select>
                  <select 
                    value={selectedTicket.assignedTo || ''}
                    onChange={(e) => assignTicket(selectedTicket.id, e.target.value)}
                  >
                    <option value="">Unassigned</option>
                    <option value="Admin1">Admin1</option>
                    <option value="Admin2">Admin2</option>
                  </select>
                </div>
              </div>

              <div className="ticket-messages">
                {selectedTicket.messages.map((msg: any, index: number) => (
                  <div key={index} className={`message ${msg.from}`}>
                    <div className="message-header">
                      <span className="message-from">{msg.from === 'admin' ? 'Support' : selectedTicket.user}</span>
                      <span className="message-time">{msg.time}</span>
                    </div>
                    <div className="message-text">{msg.text}</div>
                  </div>
                ))}
              </div>

              <div className="ticket-reply">
                <textarea placeholder="Type your reply..." />
                <button className="btn-primary">Send Reply</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
