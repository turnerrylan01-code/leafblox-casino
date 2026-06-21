import { PrivyProvider } from '@privy-io/react-auth';
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana';
import type { ReactNode } from 'react';

const PRIVY_APP_ID = import.meta.env.VITE_PRIVY_APP_ID;

const privyConfig = {
  appearance: {
    theme: 'dark' as const,
    accentColor: '#8b5cf6' as `#${string}`,
    logo: undefined,
  },
  loginMethods: ['email', 'wallet', 'google', 'discord'] as ('email' | 'wallet' | 'google' | 'discord')[],
  embeddedWallets: {
    solana: {
      createOnLogin: 'users-without-wallets' as const,
    },
  },
  externalWallets: {
    solana: {
      connectors: toSolanaWalletConnectors(),
    },
  },
};

export function PrivyAppProvider({ children }: { children: ReactNode }) {
  if (!PRIVY_APP_ID) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0b0c15',
        color: '#fff',
        padding: 24,
        textAlign: 'center',
        fontFamily: 'Inter, sans-serif',
      }}>
        <div>
          <h1 style={{ marginBottom: 12 }}>Privy not configured</h1>
          <p style={{ color: '#9ca3af', maxWidth: 420, lineHeight: 1.6 }}>
            Add your Privy App ID to <code>.env</code>:<br />
            <strong>VITE_PRIVY_APP_ID=your-app-id</strong>
          </p>
          <p style={{ color: '#6b7280', marginTop: 16, fontSize: 14 }}>
            Get it from{' '}
            <a href="https://dashboard.privy.io" target="_blank" rel="noreferrer" style={{ color: '#a855f7' }}>
              dashboard.privy.io
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <PrivyProvider appId={PRIVY_APP_ID} config={privyConfig}>
      {children}
    </PrivyProvider>
  );
}
