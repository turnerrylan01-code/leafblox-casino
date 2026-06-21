import type { GamePnLKey } from '../data/games';

export interface UserStats {
  balance: number;
  username: string;
  avatar: string;
  profilePictureUrl?: string;
  totalDeposited: number;
  totalWithdrawn: number;
  biggestWin: number;
  luckiestWin: number;
  gamesPlayed: number;
  totalWagered: number;
  gamePnL: Record<GamePnLKey, number>;
  jackpotWins: { minor: number; major: number; mega: number };
  level: number;
  xp: number;
}

export function createDefaultStats(): UserStats {
  return {
    balance: 0,
    username: '',
    avatar: '🍀',
    profilePictureUrl: undefined,
    totalDeposited: 0,
    totalWithdrawn: 0,
    biggestWin: 0,
    luckiestWin: 0,
    gamesPlayed: 0,
    totalWagered: 0,
    gamePnL: {
      mines: 0,
      'latina-tower': 0,
      coinflip: 0,
      crash: 0,
    },
    jackpotWins: { minor: 0, major: 0, mega: 0 },
    level: 1,
    xp: 0,
  };
}

/** Short display ID from Privy user id */
export function formatDisplayUserId(privyUserId: string): string {
  const id = privyUserId.replace('did:privy:', '');
  return `#${id.slice(0, 8).padStart(8, '0')}`;
}

export function statsStorageKey(userKey: string): string {
  return `endfun_stats_${userKey}`;
}

export function loadStats(userKey: string): UserStats {
  try {
    const raw = localStorage.getItem(statsStorageKey(userKey));
    if (raw) {
      const parsed = JSON.parse(raw) as UserStats;
      return { ...createDefaultStats(), ...parsed, gamePnL: { ...createDefaultStats().gamePnL, ...parsed.gamePnL } };
    }
  } catch { /* ignore */ }
  return createDefaultStats();
}

export function saveStats(userKey: string, stats: UserStats): void {
  localStorage.setItem(statsStorageKey(userKey), JSON.stringify(stats));
}

export function creditCreatorOnJoin(userKey: string, betAmount: number, won: boolean): void {
  const stats = loadStats(userKey);
  stats.gamesPlayed += 1;
  if (won) {
    const profit = betAmount;
    stats.balance += betAmount * 2;
    stats.gamePnL.coinflip = (stats.gamePnL.coinflip || 0) + profit;
    if (profit > stats.biggestWin) stats.biggestWin = profit;
    if (2 > stats.luckiestWin) stats.luckiestWin = 2;
  } else {
    stats.gamePnL.coinflip = (stats.gamePnL.coinflip || 0) - betAmount;
  }
  saveStats(userKey, stats);
}

export interface Level {
  name: string;
  xpRequired: number;
  emoji: string;
  color: string;
}

export const LEVELS: Level[] = [
  { name: 'Bronze 1', xpRequired: 5000, emoji: '🥉', color: '#cd7f32' },
  { name: 'Bronze 2', xpRequired: 10000, emoji: '🥉', color: '#cd7f32' },
  { name: 'Bronze 3', xpRequired: 15000, emoji: '🥉', color: '#cd7f32' },
  { name: 'Silver 1', xpRequired: 20000, emoji: '🥈', color: '#c0c0c0' },
  { name: 'Silver 2', xpRequired: 35000, emoji: '🥈', color: '#c0c0c0' },
  { name: 'Silver 3', xpRequired: 50000, emoji: '🥈', color: '#c0c0c0' },
  { name: 'Gold 1', xpRequired: 75000, emoji: '🥇', color: '#ffd700' },
  { name: 'Gold 2', xpRequired: 100000, emoji: '🥇', color: '#ffd700' },
  { name: 'Gold 3', xpRequired: 150000, emoji: '🥇', color: '#ffd700' },
  { name: 'Master', xpRequired: 200000, emoji: '👑', color: '#9b59b6' },
  { name: 'Master 2', xpRequired: 400000, emoji: '👑', color: '#9b59b6' },
  { name: 'Master 3', xpRequired: 800000, emoji: '👑', color: '#9b59b6' },
  { name: 'God', xpRequired: 1800000, emoji: '🌿', color: '#e74c3c' },
];

export function getLevelFromXP(xp: number): Level {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xpRequired) {
      return LEVELS[i];
    }
  }
  return { name: 'Newbie', xpRequired: 0, emoji: '🌱', color: '#27ae60' };
}

export function addXP(userKey: string, solanaAmount: number): void {
  const stats = loadStats(userKey);
  const xpToAdd = Math.floor(solanaAmount * 1000); // 0.001 SOL = 1 XP
  stats.xp += xpToAdd;
  stats.level = getLevelFromXP(stats.xp).xpRequired;
  saveStats(userKey, stats);
}


