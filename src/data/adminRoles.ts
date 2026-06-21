export type AdminRole = 'owner' | 'admin' | 'moderator';

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export const PERMISSIONS: Permission[] = [
  // System settings
  { id: 'system.settings', name: 'System Settings', description: 'Access to system settings' },
  { id: 'system.financial', name: 'Financial Controls', description: 'Access to financial controls' },
  
  // User management
  { id: 'users.view', name: 'View Users', description: 'View user profiles' },
  { id: 'users.manage', name: 'Manage Users', description: 'Manage user accounts' },
  { id: 'users.suspend', name: 'Suspend Users', description: 'Suspend user accounts' },
  { id: 'users.freeze', name: 'Freeze Users', description: 'Freeze user accounts' },
  { id: 'users.force_logout', name: 'Force Logout', description: 'Force logout users' },
  { id: 'users.reset_password', name: 'Reset Password', description: 'Reset user passwords' },
  { id: 'users.notes', name: 'User Notes', description: 'Add internal notes to users' },
  { id: 'users.history', name: 'User History', description: 'View user account history' },
  
  // Chat moderation
  { id: 'chat.view', name: 'View Chat', description: 'View chat messages' },
  { id: 'chat.delete', name: 'Delete Messages', description: 'Delete chat messages' },
  { id: 'chat.clear', name: 'Clear Chat', description: 'Clear all chat messages' },
  { id: 'chat.mute', name: 'Mute Users', description: 'Mute users in chat' },
  { id: 'chat.warn', name: 'Warn Users', description: 'Warn users in chat' },
  { id: 'chat.history', name: 'Chat History', description: 'View chat history' },
  { id: 'chat.lockdown', name: 'Chat Lockdown', description: 'Global chat lockdown' },
  { id: 'chat.disable', name: 'Disable Chat', description: 'Disable chat entirely' },
  { id: 'chat.filter', name: 'Chat Filter', description: 'Manage chat word filters' },
  
  // Ban system
  { id: 'ban.temporary', name: 'Temporary Ban', description: 'Issue temporary bans' },
  { id: 'ban.permanent', name: 'Permanent Ban', description: 'Issue permanent bans' },
  { id: 'ban.view', name: 'View Bans', description: 'View ban records' },
  { id: 'ban.lift', name: 'Lift Bans', description: 'Lift user bans' },
  
  // Promotions
  { id: 'promotions.view', name: 'View Promotions', description: 'View promotions' },
  { id: 'promotions.create', name: 'Create Promotions', description: 'Create promo codes' },
  { id: 'promotions.manage', name: 'Manage Promotions', description: 'Manage promotions' },
  { id: 'rewards.view', name: 'View Rewards', description: 'View reward systems' },
  { id: 'rewards.manage', name: 'Manage Rewards', description: 'Manage reward systems' },
  
  // Games
  { id: 'games.view', name: 'View Games', description: 'View game statistics' },
  { id: 'games.manage', name: 'Manage Games', description: 'Enable/disable games' },
  { id: 'games.settings', name: 'Game Settings', description: 'Configure game settings' },
  
  // Analytics
  { id: 'analytics.view', name: 'View Analytics', description: 'View analytics dashboard' },
  
  // Support
  { id: 'support.view', name: 'View Tickets', description: 'View support tickets' },
  { id: 'support.manage', name: 'Manage Tickets', description: 'Manage support tickets' },
  
  // Staff
  { id: 'staff.view', name: 'View Staff', description: 'View staff members' },
  { id: 'staff.manage', name: 'Manage Staff', description: 'Manage staff roles' },
  
  // Audit logs
  { id: 'audit.view', name: 'View Audit Logs', description: 'View audit logs' },
  
  // Notifications
  { id: 'notifications.broadcast', name: 'Broadcast Messages', description: 'Send broadcasts to all users' },
];

export const ROLE_PERMISSIONS: Record<AdminRole, string[]> = {
  owner: PERMISSIONS.map(p => p.id), // Owner has all permissions
  admin: [
    'users.view',
    'users.manage',
    'users.suspend',
    'users.freeze',
    'users.force_logout',
    'users.notes',
    'users.history',
    'chat.view',
    'chat.delete',
    'chat.clear',
    'chat.mute',
    'chat.warn',
    'chat.history',
    'chat.lockdown',
    'chat.disable',
    'chat.filter',
    'ban.temporary',
    'ban.permanent',
    'ban.view',
    'ban.lift',
    'promotions.view',
    'promotions.create',
    'promotions.manage',
    'rewards.view',
    'rewards.manage',
    'games.view',
    'games.manage',
    'games.settings',
    'analytics.view',
    'support.view',
    'support.manage',
    'staff.view',
    'audit.view',
    'notifications.broadcast',
  ],
  moderator: [
    'users.view',
    'chat.view',
    'chat.delete',
    'chat.mute',
    'chat.warn',
    'chat.history',
    'ban.temporary',
    'ban.view',
  ],
};

export function hasPermission(role: AdminRole, permissionId: string): boolean {
  return ROLE_PERMISSIONS[role].includes(permissionId);
}

export function getRoleName(role: AdminRole): string {
  const names: Record<AdminRole, string> = {
    owner: 'Owner',
    admin: 'Admin',
    moderator: 'Moderator',
  };
  return names[role];
}
