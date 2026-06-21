export interface AdminUser {
  id: string;
  username: string;
  email: string;
  walletAddress: string;
  registrationDate: string;
  lastLogin: string;
  ipHistory: string[];
  totalWagered: number;
  totalProfit: number;
  level: number;
  xp: number;
  accountStatus: 'active' | 'suspended' | 'frozen' | 'banned';
  banReason?: string;
  banExpiry?: string;
  internalNotes: string[];
}

export interface BanRecord {
  id: string;
  userId: string;
  username: string;
  type: 'temporary' | 'permanent';
  reason: string;
  issuedBy: string;
  issuedAt: string;
  expiresAt?: string;
  isActive: boolean;
}

export interface MuteRecord {
  id: string;
  userId: string;
  username: string;
  duration: number; // in minutes
  reason: string;
  issuedBy: string;
  issuedAt: string;
  expiresAt: string;
  isActive: boolean;
}

// Mock data - in production this would come from a database
export const MOCK_USERS: AdminUser[] = [
  {
    id: '1',
    username: 'User123',
    email: 'user123@example.com',
    walletAddress: 'G14ubwgBpfWnyHzU31U53KeUnw4M7J791Hrgg7G5TETo',
    registrationDate: '2024-01-15T10:30:00Z',
    lastLogin: '2024-06-18T14:25:00Z',
    ipHistory: ['192.168.1.1', '192.168.1.2'],
    totalWagered: 1234.5,
    totalProfit: -45.2,
    level: 15,
    xp: 2500,
    accountStatus: 'active',
    internalNotes: [],
  },
  {
    id: '2',
    username: 'CryptoKing',
    email: 'crypto@example.com',
    walletAddress: '9xQeWvG816bUx9EPjHmaT25yvVMg1uqaPYwhwkMvXJA6',
    registrationDate: '2024-02-20T08:15:00Z',
    lastLogin: '2024-06-18T12:00:00Z',
    ipHistory: ['10.0.0.1'],
    totalWagered: 5678.9,
    totalProfit: 234.1,
    level: 25,
    xp: 5000,
    accountStatus: 'active',
    internalNotes: ['VIP player', 'High roller'],
  },
  {
    id: '3',
    username: 'SuspiciousUser',
    email: 'suspicious@example.com',
    walletAddress: 'ABC123DEF456GHI789JKL012MNO345PQR',
    registrationDate: '2024-06-10T16:45:00Z',
    lastLogin: '2024-06-17T09:30:00Z',
    ipHistory: ['203.0.113.1', '203.0.113.2'],
    totalWagered: 100,
    totalProfit: -50,
    level: 2,
    xp: 150,
    accountStatus: 'suspended',
    internalNotes: ['Flagged for suspicious activity', 'Multiple accounts detected'],
  },
];

export const MOCK_BANS: BanRecord[] = [
  {
    id: '1',
    userId: '3',
    username: 'SuspiciousUser',
    type: 'temporary',
    reason: 'Multiple account abuse',
    issuedBy: 'Admin',
    issuedAt: '2024-06-17T09:30:00Z',
    expiresAt: '2024-06-24T09:30:00Z',
    isActive: true,
  },
];

export const MOCK_MUTES: MuteRecord[] = [];
