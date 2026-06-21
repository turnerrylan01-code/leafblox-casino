import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { ChatProvider } from './context/ChatContext';
import { CoinflipProvider } from './context/CoinflipContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomePage } from './pages/Home';
import { LoginPage } from './pages/Login';
import { CoinflipPage } from './pages/Coinflip';
import { MinesPage } from './pages/Mines';
import { LatinaTowerPage } from './pages/LatinaTower';
import { CrashPage } from './pages/Crash';
import { BattlesPage } from './pages/Battles';
import { ProfilePage } from './pages/Profile';
import { LeaderboardPage } from './pages/Leaderboard';
import { RoadmapPage } from './pages/Roadmap';
import { FairnessPage } from './pages/Fairness';
import { RewardsPage } from './pages/Rewards';
import { AffiliatesPage } from './pages/Affiliates';
import { DuelsPage } from './pages/Duels';
import { UpgraderPage } from './pages/Upgrader';
import { AdminPage } from './pages/Admin';
import { LevelAdminPage } from './pages/LevelAdmin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminDeposits } from './pages/admin/AdminDeposits';
import { AdminWithdrawals } from './pages/admin/AdminWithdrawals';
import { AdminGames } from './pages/admin/AdminGames';
import { AdminLevelManager } from './pages/admin/AdminLevelManager';
import { AdminBonuses } from './pages/admin/AdminBonuses';
import { AdminVIP } from './pages/admin/AdminVIP';
import { AdminChat } from './pages/admin/AdminChat';
import { AdminSupport } from './pages/admin/AdminSupport';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';
import { AdminSecurity } from './pages/admin/AdminSecurity';
import { AdminSettings } from './pages/admin/AdminSettings';

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <ChatProvider>
          <CoinflipProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route element={<ProtectedRoute />}>
                  <Route element={<Layout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/coinflip" element={<CoinflipPage />} />
                    <Route path="/mines" element={<MinesPage />} />
                    <Route path="/latina-tower" element={<LatinaTowerPage />} />
                    <Route path="/crash" element={<CrashPage />} />
                    <Route path="/duels" element={<DuelsPage />} />
                    <Route path="/upgrader" element={<UpgraderPage />} />
                    <Route path="/battles" element={<BattlesPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/leaderboard" element={<LeaderboardPage />} />
                    <Route path="/roadmap" element={<RoadmapPage />} />
                    <Route path="/fairness" element={<FairnessPage />} />
                    <Route path="/rewards" element={<RewardsPage />} />
                    <Route path="/affiliates" element={<AffiliatesPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/admin/level" element={<LevelAdminPage />} />
                  </Route>
                  <Route path="/admin" element={<AdminPage />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="deposits" element={<AdminDeposits />} />
                    <Route path="withdrawals" element={<AdminWithdrawals />} />
                    <Route path="games" element={<AdminGames />} />
                    <Route path="level-manager" element={<AdminLevelManager />} />
                    <Route path="bonuses" element={<AdminBonuses />} />
                    <Route path="vip" element={<AdminVIP />} />
                    <Route path="chat" element={<AdminChat />} />
                    <Route path="support" element={<AdminSupport />} />
                    <Route path="analytics" element={<AdminAnalytics />} />
                    <Route path="security" element={<AdminSecurity />} />
                    <Route path="settings" element={<AdminSettings />} />
                  </Route>
                </Route>
              </Routes>
            </BrowserRouter>
          </CoinflipProvider>
        </ChatProvider>
      </AppProvider>
    </AuthProvider>
  );
}
