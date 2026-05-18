import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import I18nProvider from './i18n/I18nProvider.jsx';
import { AuthProvider } from './auth/AuthContext.jsx';
import { FavoritesProvider } from './favorites/FavoritesContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <I18nProvider>
      <AuthProvider>
        <FavoritesProvider>
          <App />
        </FavoritesProvider>
      </AuthProvider>
    </I18nProvider>
  </StrictMode>,
);
