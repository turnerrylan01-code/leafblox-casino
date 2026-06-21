import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { GamePnLKey } from '../data/games';
import { createDefaultStats, loadStats, saveStats, type UserStats } from '../lib/auth';
import { sendDiscordWebhook } from '../lib/discord';
import { useAuth } from './AuthContext';
import { getSolanaPrice, solToUsd } from '../services/solanaPrice';

interface AppContextType {
  balance: number;
  setBalance: (b: number | ((prev: number) => number)) => void;
  username: string;
  setUsername: (u: string) => void;
  userId: string;
  avatar: string;
  setAvatar: (a: string) => void;
  totalBets: number;
  incrementTotalBets: () => void;
  showDeposit: boolean;
  setShowDeposit: (v: boolean) => void;
  showWithdraw: boolean;
  setShowWithdraw: (v: boolean) => void;
  showComingSoon: boolean;
  setShowComingSoon: (v: boolean) => void;
  showTagsModal: boolean;
  setShowTagsModal: (v: boolean) => void;
  showCurrencyModal: boolean;
  setShowCurrencyModal: (v: boolean) => void;
  toast: string | null;
  showToast: (msg: string) => void;
  deposit: (amount: number) => void;
  withdraw: (amount: number) => boolean;
  level: number;
  xp: number;
  maxXp: number;
  gamesPlayed: number;
  totalWagered: number;
  totalDeposited: number;
  totalWithdrawn: number;
  biggestWin: number;
  luckiestWin: number;
  gamePnL: Record<GamePnLKey, number>;
  jackpotWins: { minor: number; major: number; mega: number };
  addWager: (amount: number) => void;
  addGamePlayed: () => void;
  recordGameResult: (game: GamePnLKey, betAmount: number, profit: number, multiplier?: number) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  solanaPrice: number;
  currency: 'SOL' | 'USD';
  setCurrency: (c: 'SOL' | 'USD') => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const { authUserId, userId } = useAuth();
  const [stats, setStats] = useState<UserStats>(createDefaultStats);
  const [totalBets, setTotalBets] = useState(1039733);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [showTagsModal, setShowTagsModal] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [solanaPrice, setSolanaPrice] = useState(150);
  const [currency, setCurrency] = useState<'SOL' | 'USD'>('SOL');
  const maxXp = 400;

  useEffect(() => {
    if (authUserId) {
      setStats(loadStats(authUserId));
    } else {
      setStats(createDefaultStats());
    }
  }, [authUserId]);

  useEffect(() => {
    const fetchPrice = async () => {
      const price = await getSolanaPrice();
      setSolanaPrice(price);
    };
    fetchPrice();
    const interval = setInterval(fetchPrice, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const randomIncrement = Math.floor(Math.random() * 20) + 1;
      setTotalBets(prev => prev + randomIncrement);
    }, 4000);
    return () => clearInterval(timer);
  }, []);


  const updateStats = useCallback((updater: (prev: UserStats) => UserStats) => {
    setStats(prev => {
      const next = updater(prev);
      if (authUserId) saveStats(authUserId, next);
      return next;
    });
  }, [authUserId]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const deposit = useCallback((amount: number) => {
    if (amount <= 0) return;
    updateStats(prev => ({
      ...prev,
      balance: prev.balance + amount,
      totalDeposited: prev.totalDeposited + amount,
    }));
    showToast(`Deposited ${amount.toFixed(3)} SOL`);
    sendDiscordWebhook(amount, stats.username);
  }, [updateStats, showToast, stats.username]);

  const withdraw = useCallback((amount: number) => {
    if (amount <= 0) return false;
    let success = false;
    updateStats(prev => {
      if (amount > prev.balance) return prev;
      success = true;
      return {
        ...prev,
        balance: prev.balance - amount,
        totalWithdrawn: prev.totalWithdrawn + amount,
      };
    });
    if (!success) {
      showToast('Insufficient balance');
      return false;
    }
    showToast(`Withdrew ${amount.toFixed(3)} SOL`);
    return true;
  }, [updateStats, showToast]);

  const setBalance = useCallback((b: number | ((prev: number) => number)) => {
    updateStats(prev => ({
      ...prev,
      balance: typeof b === 'function' ? b(prev.balance) : b,
    }));
  }, [updateStats]);

  const setUsername = useCallback((u: string) => {
    updateStats(prev => ({ ...prev, username: u }));
  }, [updateStats]);

  const setAvatar = useCallback((a: string) => {
    updateStats(prev => ({ ...prev, avatar: a }));
  }, [updateStats]);

  const incrementTotalBets = useCallback(() => {
    setTotalBets(prev => prev + 1);
  }, []);

  const addWager = useCallback((amount: number) => {
    updateStats(prev => ({
      ...prev,
      totalWagered: prev.totalWagered + amount,
    }));
  }, [updateStats]);

  const addGamePlayed = useCallback(() => {
    updateStats(prev => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1,
    }));
  }, [updateStats]);

  const recordGameResult = useCallback((
    game: GamePnLKey,
    betAmount: number,
    profit: number,
    multiplier?: number,
  ) => {
    updateStats(prev => {
      const next = { ...prev };
      next.gamePnL = { ...prev.gamePnL, [game]: prev.gamePnL[game] + profit };
      if (profit > 0) {
        if (profit > prev.biggestWin) next.biggestWin = profit;
        const mult = multiplier ?? (betAmount > 0 ? (betAmount + profit) / betAmount : 0);
        if (mult > prev.luckiestWin) next.luckiestWin = mult;
      }
      return next;
    });
  }, [updateStats]);

  return (
    <AppContext.Provider value={{
      balance: stats.balance,
      setBalance,
      username: stats.username,
      setUsername,
      userId,
      avatar: stats.avatar,
      setAvatar,
      totalBets,
      incrementTotalBets,
      showDeposit,
      setShowDeposit,
      showWithdraw,
      setShowWithdraw,
      showComingSoon,
      setShowComingSoon,
      showTagsModal,
      setShowTagsModal,
      showCurrencyModal,
      setShowCurrencyModal,
      toast,
      showToast,
      deposit,
      withdraw,
      level: stats.level,
      xp: stats.xp,
      maxXp,
      gamesPlayed: stats.gamesPlayed,
      totalWagered: stats.totalWagered,
      totalDeposited: stats.totalDeposited,
      totalWithdrawn: stats.totalWithdrawn,
      biggestWin: stats.biggestWin,
      luckiestWin: stats.luckiestWin,
      gamePnL: stats.gamePnL,
      jackpotWins: stats.jackpotWins,
      addWager,
      addGamePlayed,
      recordGameResult,
      soundEnabled,
      setSoundEnabled,
      solanaPrice,
      currency,
      setCurrency,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
