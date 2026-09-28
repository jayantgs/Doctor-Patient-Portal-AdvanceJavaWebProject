import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { AppRoutes } from './routes/AppRoutes';
import { ErrorBoundary } from './components/ErrorBoundary';

/**
 * Root application component.
 *
 * Provider hierarchy:
 *   ThemeProvider  — MUI theme + CSS baseline (system / light / dark).
 *   AuthProvider   — auth state via reducer + persisted localStorage.
 *   BrowserRouter  — React Router v6.
 *   ErrorBoundary  — catches render errors below the app shell.
 *   AppRoutes      — the full route tree.
 */
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <ErrorBoundary>
            <AppRoutes />
          </ErrorBoundary>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
