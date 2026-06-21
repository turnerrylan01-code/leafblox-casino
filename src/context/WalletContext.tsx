import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { usePrivy } from '@privy-io/react-auth';

interface WalletContextType {
  balance: number;
  loading: boolean;
  refreshBalance: () => Promise<void>;
  deposit: (amount: number) => Promise<boolean>;
  withdraw: (amount: number) => Promise<boolean>;
  sendTransaction: (amount: number) => Promise<boolean>;
}

const WalletContext = createContext<WalletContextType | null>(null);

// Solana RPC endpoint (using public devnet for now, should be mainnet for production)
const SOLANA_RPC_URL = 'https://api.devnet.solana.com';

export function WalletProvider({ children }: { children: ReactNode }) {
  const { ready, authenticated, user } = usePrivy();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  const getSolanaWallet = () => {
    if (!user) return null;
    const solanaAccount = user.linkedAccounts?.find(
      (a) => a.type === 'wallet' && 'chainType' in a && a.chainType === 'solana',
    );
    if (solanaAccount && 'address' in solanaAccount) return solanaAccount.address;
    return null;
  };

  const refreshBalance = useCallback(async () => {
    if (!ready || !authenticated) return;
    
    const walletAddress = getSolanaWallet();
    if (!walletAddress) return;

    setLoading(true);
    try {
      const response = await fetch(SOLANA_RPC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getBalance',
          params: [walletAddress]
        })
      });
      const data = await response.json();
      if (data.result) {
        setBalance(data.result.value / 1e9); // Convert lamports to SOL
      }
    } catch (error) {
      console.error('Failed to fetch balance:', error);
      setBalance(0);
    } finally {
      setLoading(false);
    }
  }, [ready, authenticated, user]);

  useEffect(() => {
    if (ready && authenticated) {
      refreshBalance();
    }
  }, [ready, authenticated, refreshBalance]);

  const deposit = useCallback(async (): Promise<boolean> => {
    // In a real casino, deposits would come from external sources
    // For now, we'll just refresh the balance
    await refreshBalance();
    return true;
  }, [refreshBalance]);

  const withdraw = useCallback(async (amount: number): Promise<boolean> => {
    const walletAddress = getSolanaWallet();
    if (!walletAddress) return false;

    if (amount > balance) return false;

    setLoading(true);
    try {
      // In a real implementation, this would send SOL to a withdrawal address
      // For now, we'll just simulate it
      console.log(`Withdrawing ${amount} SOL to ${walletAddress}`);
      await refreshBalance();
      return true;
    } catch (error) {
      console.error('Withdrawal failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [balance, refreshBalance]);

  const sendTransaction = useCallback(async (amount: number): Promise<boolean> => {
    const walletAddress = getSolanaWallet();
    if (!walletAddress) return false;

    if (amount > balance) return false;

    setLoading(true);
    try {
      // In a real implementation, this would send a transaction to the casino's wallet
      // For now, we'll just simulate it
      console.log(`Sending ${amount} SOL from ${walletAddress} to casino`);
      await refreshBalance();
      return true;
    } catch (error) {
      console.error('Transaction failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [balance, refreshBalance]);

  return (
    <WalletContext.Provider value={{
      balance,
      loading,
      refreshBalance,
      deposit,
      withdraw,
      sendTransaction,
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within WalletProvider');
  return ctx;
}
