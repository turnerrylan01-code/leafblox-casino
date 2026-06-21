import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export function LoginPage() {
  const { ready, isAuthenticated, login } = useAuth();

  if (!ready) {
    return (
      <div className="login-page">
        <div className="login-bg-glow" />
        <div className="login-card">
          <p className="login-sub">Connecting to Privy...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) return <Navigate to="/coinflip" replace />;

  return (
    <div className="login-page">
      <div className="login-bg-glow" />
      <div className="login-card">
        <div className="login-logo">
          <span className="logo-ghost">🍀</span>
          <span>Leaf Blox</span>
        </div>
        <h1>Welcome</h1>
        <p className="login-sub">
          Sign in with email or connect your Solana wallet via Privy
        </p>

        <button type="button" className="btn-primary login-submit" onClick={login}>
          CONNECT / SIGN IN
        </button>

        <p className="login-hint">
          Supports email, Google, Discord, Phantom, Solflare, and embedded wallets
        </p>
      </div>
    </div>
  );
}


