import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { PrivyAppProvider } from './providers/PrivyAppProvider';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrivyAppProvider>
      <App />
    </PrivyAppProvider>
  </StrictMode>,
);
