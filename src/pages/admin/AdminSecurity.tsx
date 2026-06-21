import { useState, useEffect } from 'react';
import { hasTag } from '../../data/tags';
import './AdminPanel.css';

export function AdminSecurity() {
  const [roles, setRoles] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = () => {
    // Load real audit logs from localStorage
    const storedAuditLogs = JSON.parse(localStorage.getItem('admin_audit_logs') || '[]');
    
    // Load real roles data from localStorage
    const allUsers = Object.keys(localStorage).filter(key => key.startsWith('user_stats_'));
    const roleCounts: any = { owner: 0, admin: 0, moderator: 0, support: 0 };
    
    allUsers.forEach(key => {
      try {
        // Count users by role based on tags
        if (hasTag(key.replace('user_stats_', ''), 'owner')) roleCounts.owner++;
        else if (hasTag(key.replace('user_stats_', ''), 'admin')) roleCounts.admin++;
        else if (hasTag(key.replace('user_stats_', ''), 'moderator')) roleCounts.moderator++;
        else if (hasTag(key.replace('user_stats_', ''), 'support')) roleCounts.support++;
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    });

    const rolesData = [
      { id: 1, name: 'Owner', permissions: ['all'], users: roleCounts.owner },
      { id: 2, name: 'Admin', permissions: ['users', 'deposits', 'withdrawals', 'games'], users: roleCounts.admin },
      { id: 3, name: 'Moderator', permissions: ['chat', 'support'], users: roleCounts.moderator },
      { id: 4, name: 'Support', permissions: ['support'], users: roleCounts.support },
    ];

    setRoles(rolesData);
    setAuditLogs(storedAuditLogs);
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Security & Permissions</h1>
      </div>

      <div className="admin-content">
        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-label">Total Staff</div>
            <div className="stat-value">{roles.reduce((sum, r) => sum + r.users, 0)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Audit Logs</div>
            <div className="stat-value">{auditLogs.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Active Sessions</div>
            <div className="stat-value">12</div>
          </div>
        </div>

        <div className="security-grid">
          <div className="roles-section">
            <h3>Role Permissions</h3>
            <div className="roles-list">
              {roles.map((role) => (
                <div key={role.id} className="role-card">
                  <div className="role-header">
                    <h4>{role.name}</h4>
                    <span className="role-users">{role.users} users</span>
                  </div>
                  <div className="role-permissions">
                    {role.permissions.map((perm: string) => (
                      <span key={perm} className="permission-tag">{perm}</span>
                    ))}
                  </div>
                  <div className="role-actions">
                    <button className="btn-action btn-edit">Edit</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="audit-logs-section">
            <h3>Audit Logs</h3>
            <div className="audit-logs-list">
              {auditLogs.map((log) => (
                <div key={log.id} className="audit-log">
                  <div className="log-header">
                    <span className="log-action">{log.action}</span>
                    <span className="log-time">{log.time}</span>
                  </div>
                  <div className="log-details">
                    <span className="log-user">By: {log.user}</span>
                    <span className="log-target">Target: {log.target}</span>
                    <span className="log-ip">IP: {log.ip}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="security-settings">
          <h3>Security Settings</h3>
          <div className="settings-grid">
            <div className="setting-card">
              <h4>Two-Factor Authentication</h4>
              <p>Require 2FA for all admin staff</p>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="slider"></span>
              </label>
            </div>
            <div className="setting-card">
              <h4>IP Whitelist</h4>
              <p>Restrict admin access to specific IPs</p>
              <label className="toggle-switch">
                <input type="checkbox" />
                <span className="slider"></span>
              </label>
            </div>
            <div className="setting-card">
              <h4>Session Timeout</h4>
              <p>Auto-logout after inactivity</p>
              <select>
                <option>15 minutes</option>
                <option>30 minutes</option>
                <option>1 hour</option>
                <option>2 hours</option>
              </select>
            </div>
            <div className="setting-card">
              <h4>Login Notifications</h4>
              <p>Alert on new admin logins</p>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
