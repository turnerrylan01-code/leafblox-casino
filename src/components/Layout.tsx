import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { DepositModal, WithdrawModal, ComingSoonModal, TagsModal } from './Modals';
import { CurrencyModal } from './CurrencyModal';
import { useApp } from '../context/AppContext';
import './Layout.css';

export function Layout() {
  const { toast } = useApp();

  return (
    <div className="app-layout">
      <Navbar />
      <div className="app-body">
        <Sidebar />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
      <DepositModal />
      <WithdrawModal />
      <ComingSoonModal />
      <TagsModal />
      <CurrencyModal />
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
