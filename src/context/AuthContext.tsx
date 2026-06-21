import { createContext, useContext, useCallback, useEffect, type ReactNode } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { formatDisplayUserId } from '../lib/auth';
import { api } from '../services/api';

interface AuthContextType {
  ready: boolean;
  email: string | null;
  walletAddress: string | null;
  userId: string;
  /** Privy DID — used as stats storage key */
  authUserId: string | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function getSolanaWallet(user: NonNullable<ReturnType<typeof usePrivy>['user']>): string | null {
  const solanaAccount = user.linkedAccounts?.find(
    (a) => a.type === 'wallet' && 'chainType' in a && a.chainType === 'solana',
  );
  if (solanaAccount && 'address' in solanaAccount) return solanaAccount.address;

  const anyWallet = user.linkedAccounts?.find((a) => a.type === 'wallet' && 'address' in a);
  if (anyWallet && 'address' in anyWallet) return anyWallet.address;

  return user.wallet?.address ?? null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { ready, authenticated, user, login, logout: privyLogout } = usePrivy();

  const email = user?.email?.address ?? null;
  const walletAddress = user ? getSolanaWallet(user) : null;
  const authUserId = user?.id ?? null;
  const userId = authUserId ? formatDisplayUserId(authUserId) : '#00000000';

  // Login with backend when user authenticates with Privy
  useEffect(() => {
    if (authenticated && walletAddress) {
      api.login(walletAddress)
        .then((response) => {
          if (response.token) {
            api.setToken(response.token);
          }
        })
        .catch((error) => {
          console.error('Backend login failed:', error);
        });
    }
  }, [authenticated, walletAddress]);

  // Clear token on logout
  const logout = useCallback(async () => {
    api.clearToken();
    await privyLogout();
  }, [privyLogout]);

  const loginUser = useCallback(() => {
    login();
  }, [login]);

  return (
    <AuthContext.Provider value={{
      ready,
      email,
      walletAddress,
      userId,
      authUserId,
      isAuthenticated: authenticated,
      login: loginUser,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
