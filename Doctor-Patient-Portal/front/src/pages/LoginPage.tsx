import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Stack,
  Paper,
  Link as MuiLink,
} from '@mui/material';
import { ThemeToggleButton } from '../components/ThemeToggleButton';
import { useAuth } from '../contexts/AuthContext';
import type { UserRole, LoginRequest } from '../types';

interface LoginPageProps {
  role: UserRole;
}

/** Friendly labels for each role's login page. */
const ROLE_LABELS: Record<UserRole, { title: string; subtitle: string; registerLink: string }> = {
  user: {
    title: 'Patient Login',
    subtitle: 'Access your appointments and medical records',
    registerLink: '/user/register',
  },
  doctor: {
    title: 'Doctor Login',
    subtitle: 'Access your patient list and appointments',
    registerLink: '',
  },
  admin: {
    title: 'Admin Login',
    subtitle: 'Access the admin console',
    registerLink: '',
  },
};

/**
 * Login form for all three roles.
 *
 * The same component renders for `/user/login`, `/doctor/login`, and
 * `/admin/login`.  On success the user is redirected to their role dashboard.
 * The auth context dispatches the correct login call based on the role.
 */
export const LoginPage: React.FC<LoginPageProps> = ({ role }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, error: authError, clearError, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const labels = ROLE_LABELS[role];

  // If redirected from a protected route, remember the intended destination.
  const from = (location.state as { from?: string })?.from ?? `/${role}/dashboard`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const request: LoginRequest = { email, password };
    try {
      await login(role, request);
      navigate(from);
    } catch {
      // Error is already surfaced via the auth context.
    }
  };

  return (
    <Box sx={{ maxWidth: 420, mx: 'auto' }}>
      <Paper sx={{ p: { xs: 3, md: 5 } }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {labels.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {labels.subtitle}
            </Typography>
          </Box>

          {authError && <Alert severity="error">{authError}</Alert>}

          <form onSubmit={handleSubmit} noValidate>
            <Stack spacing={3}>
              <TextField
                label="Email"
                type="email"
                autoComplete="email"
                required
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
              <TextField
                label="Password"
                type="password"
                autoComplete="current-password"
                required
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </Stack>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{ mt: 2 }}
              disabled={isLoading}
            >
              {isLoading ? 'Signing in…' : 'Sign In'}
            </Button>
          </form>

          {labels.registerLink && (
            <Typography variant="body2" align="center">
              Don't have an account?{' '}
              <MuiLink href={labels.registerLink} underline="hover">
                Register here
              </MuiLink>
            </Typography>
          )}
        </Stack>
      </Paper>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <ThemeToggleButton />
      </Box>
    </Box>
  );
};
