import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface CoinflipGame {
  id: string;
  player1: { username: string; avatar: string; userId: string; choice: 'heads' | 'tails' | null };
  player2: { username: string; avatar: string; userId: string; choice: 'heads' | 'tails' | null } | null;
  amount: number;
  status: 'waiting' | 'active' | 'finished';
  winner: 1 | 2 | null;
  coinResult: 'heads' | 'tails' | null;
  createdAt: number;
}

interface CoinflipContextType {
  games: CoinflipGame[];
  createGame: (amount: number, username: string, avatar: string, userId: string, choice: 'heads' | 'tails') => string | null;
  joinGame: (gameId: string, username: string, avatar: string, userId: string, choice: 'heads' | 'tails') => { winner: 1 | 2; amount: number; creatorUserId: string; coinResult: 'heads' | 'tails' } | null;
  addBot: (gameId: string, requestingUserId: string) => { winner: 1 | 2; amount: number; creatorUserId: string; coinResult: 'heads' | 'tails' } | null;
}

const CoinflipContext = createContext<CoinflipContextType | null>(null);

function randomCoinResult(): 'heads' | 'tails' {
  return Math.random() < 0.5 ? 'heads' : 'tails';
}

export function CoinflipProvider({ children }: { children: ReactNode }) {
  const [games, setGames] = useState<CoinflipGame[]>([]);

  const createGame = useCallback((amount: number, username: string, avatar: string, userId: string, choice: 'heads' | 'tails'): string | null => {
    if (amount <= 0 || !userId) return null;
    const id = Date.now().toString();
    const game: CoinflipGame = {
      id,
      player1: { username: username || '', avatar: avatar || '', userId, choice },
      player2: null,
      amount,
      status: 'waiting',
      winner: null,
      coinResult: null,
      createdAt: Date.now(),
    };
    setGames(prev => [game, ...prev]);
    return id;
  }, []);

  const joinGame = useCallback((gameId: string, username: string, avatar: string, userId: string, choice: 'heads' | 'tails') => {
    let result: { winner: 1 | 2; amount: number; creatorUserId: string; coinResult: 'heads' | 'tails' } | null = null;
    setGames(prev => prev.map(g => {
      if (g.id !== gameId || g.status !== 'waiting' || g.player2) return g;
      const coinResult = randomCoinResult();
      const winner = coinResult === g.player1.choice ? 1 : (coinResult === choice ? 2 : 1);
      result = { winner, amount: g.amount, creatorUserId: g.player1.userId, coinResult };
      return {
        ...g,
        player2: { username: username || '', avatar: avatar || '', userId, choice },
        status: 'finished' as const,
        winner,
        coinResult,
      };
    }));
    return result;
  }, []);

  const addBot = useCallback((gameId: string, requestingUserId: string) => {
    let result: { winner: 1 | 2; amount: number; creatorUserId: string; coinResult: 'heads' | 'tails' } | null = null;
    setGames(prev => prev.map(g => {
      if (g.id !== gameId || g.status !== 'waiting' || g.player2) return g;
      if (g.player1.userId !== requestingUserId) return g;
      const coinResult = randomCoinResult();
      const botChoice = coinResult === 'heads' ? 'tails' : 'heads';
      const winner = coinResult === g.player1.choice ? 1 : 2;
      result = { winner, amount: g.amount, creatorUserId: g.player1.userId, coinResult };
      return {
        ...g,
        player2: { username: 'Bot', avatar: '', userId: 'bot', choice: botChoice },
        status: 'finished' as const,
        winner,
        coinResult,
      };
    }));
    return result;
  }, []);

  return (
    <CoinflipContext.Provider value={{ games, createGame, joinGame, addBot }}>
      {children}
    </CoinflipContext.Provider>
  );
}

export function useCoinflip() {
  const ctx = useContext(CoinflipContext);
  if (!ctx) throw new Error('useCoinflip must be used within CoinflipProvider');
  return ctx;
}
