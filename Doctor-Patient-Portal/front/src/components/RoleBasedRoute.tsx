import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';
import type { UserRole } from '../types/auth';

/**
 * Props:
 *   - `allowedRoles`  Roles permitted to access the route(s) below this guard.
 *   - `redirectTo`    Where to send unauthenticated / unauthorized users.
 */
interface RequireAuthProps {
  allowedRoles: UserRole[];
  redirectTo?: string;
}

/**
 * Route guard that:
 *   1. Shows a loading spinner while auth state is hydrating.
 *   2. Redirects unauthenticated users to `redirectTo` (defaults to user login).
 *   3. Redirects authenticated users whose role is not in `allowedRoles`
 *      to the appropriate dashboard.
 *
 * Wraps `<Outlet />` so it works with nested route trees.
 */
export const RequireAuth: React.FC<RequireAuthProps> = ({ allowedRoles, redirectTo }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // While the auth context is hydrating from localStorage, show a spinner.
  // A production app would track a dedicated `isHydrating` flag; here we
  // detect it by checking whether `user` has been set yet (initial render).
  if (!user && !isAuthenticated) {
    return <LoadingSpinner message="Checking session…" />;
  }

  if (!user) {
    const to = redirectTo ?? '/user/login';
    return <Navigate to={to} state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Authorized but wrong role → redirect to their own dashboard.
    const dashboard = `/${user.role}`;
    return <Navigate to={dashboard} replace />;
  }

  return <Outlet />;
};

/**
 * Public-only route: redirects authenticated users away from login pages.
 * E.g. if you're already logged in as a user and visit /user/login, send
 * you to /dashboard.
 */
export const PublicOnlyRoute: React.FC<{ allowedRoles: UserRole[] }> = ({ allowedRoles }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (user && allowedRoles.includes(user.role)) {
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname;
    const fallback = `/${user.role}/dashboard`;
    return <Navigate to={from ?? fallback} replace />;
  }

  return <Outlet />;
};
