const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class APIClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getToken() {
    if (!this.token) {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const token = this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // Auth
  async login(walletAddress: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ walletAddress }),
    });
  }

  async verifyToken() {
    return this.request('/auth/verify');
  }

  // Users
  async getUsers(filters?: { status?: string; search?: string }) {
    const params = new URLSearchParams(filters as any);
    return this.request(`/users?${params}`);
  }

  async getUser(id: string) {
    return this.request(`/users/${id}`);
  }

  async updateUserStatus(id: string, status: string) {
    return this.request(`/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async addUserNote(id: string, note: string) {
    return this.request(`/users/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify({ note }),
    });
  }

  async forceLogout(id: string) {
    return this.request(`/users/${id}/logout`, {
      method: 'POST',
    });
  }

  // Chat
  async muteUser(userId: string, duration: string, reason: string) {
    return this.request('/chat/mute', {
      method: 'POST',
      body: JSON.stringify({ userId, duration, reason }),
    });
  }

  async unmuteUser(userId: string) {
    return this.request(`/chat/mute/${userId}`, {
      method: 'DELETE',
    });
  }

  async getMutes() {
    return this.request('/chat/mutes');
  }

  async clearChat() {
    return this.request('/chat/clear', {
      method: 'POST',
    });
  }

  // Bans
  async createBan(userId: string, type: string, duration: string, reason: string) {
    return this.request('/bans', {
      method: 'POST',
      body: JSON.stringify({ userId, type, duration, reason }),
    });
  }

  async getBans() {
    return this.request('/bans');
  }

  async liftBan(id: string) {
    return this.request(`/bans/${id}`, {
      method: 'DELETE',
    });
  }

  // Promotions
  async createPromo(data: any) {
    return this.request('/promotions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPromos() {
    return this.request('/promotions');
  }

  async updatePromo(id: string, data: any) {
    return this.request(`/promotions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async disablePromo(id: string) {
    return this.request(`/promotions/${id}/disable`, {
      method: 'PATCH',
    });
  }

  // Games
  async getGames() {
    return this.request('/games');
  }

  async updateGame(id: string, data: any) {
    return this.request(`/games/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async toggleGame(id: string) {
    return this.request(`/games/${id}/toggle`, {
      method: 'PATCH',
    });
  }

  // Support
  async getTickets(filters?: { status?: string }) {
    const params = new URLSearchParams(filters as any);
    return this.request(`/support?${params}`);
  }

  async getTicket(id: string) {
    return this.request(`/support/${id}`);
  }

  async addTicketMessage(id: string, message: string) {
    return this.request(`/support/${id}/messages`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  async updateTicketStatus(id: string, status: string) {
    return this.request(`/support/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Staff
  async getStaff() {
    return this.request('/staff');
  }

  async addStaff(walletAddress: string, role: string) {
    return this.request('/staff', {
      method: 'POST',
      body: JSON.stringify({ walletAddress, role }),
    });
  }

  async updateStaffRole(id: string, role: string) {
    return this.request(`/staff/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  }

  async removeStaff(id: string) {
    return this.request(`/staff/${id}`, {
      method: 'DELETE',
    });
  }

  // Levels
  async getLevels() {
    return this.request('/levels');
  }

  async createLevel(data: any) {
    return this.request('/levels', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateLevel(id: string, data: any) {
    return this.request(`/levels/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteLevel(id: string) {
    return this.request(`/levels/${id}`, {
      method: 'DELETE',
    });
  }

  // Settings
  async getSettings() {
    return this.request('/settings');
  }

  async updateSettings(data: any) {
    return this.request('/settings', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Audit
  async getAuditLogs(filters?: { action?: string; staff?: string }) {
    const params = new URLSearchParams(filters as any);
    return this.request(`/audit?${params}`);
  }
}

export const api = new APIClient();
