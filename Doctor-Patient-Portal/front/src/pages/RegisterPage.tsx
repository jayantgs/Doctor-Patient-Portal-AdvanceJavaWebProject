import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
import { userService } from '../services';
import type { UserRegisterPayload } from '../types/user';

/**
 * Patient registration form.
 *
 * POSTs to /api/users/register (UserController.registerUser).  Fields mirror
 * the original `signup.jsp` form: fullName, email, password.
 */
export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<UserRegisterPayload>({
    fullName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (field: keyof UserRegisterPayload) => (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await userService.registerUser(formData);
      setSuccess(true);
      // Auto-redirect to login after a short delay.
      setTimeout(() => {
        navigate('/user/login');
      }, 2000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 420, mx: 'auto' }}>
      <Paper sx={{ p: { xs: 3, md: 5 } }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Create Patient Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Register to book appointments and manage your medical records.
            </Typography>
          </Box>

          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">Registration successful! Redirecting to login…</Alert>}

          <form onSubmit={handleSubmit} noValidate>
            <Stack spacing={3}>
              <TextField
                label="Full Name"
                autoComplete="name"
                required
                fullWidth
                value={formData.fullName}
                onChange={handleChange('fullName')}
                disabled={isSubmitting || success}
              />
              <TextField
                label="Email"
                type="email"
                autoComplete="email"
                required
                fullWidth
                value={formData.email}
                onChange={handleChange('email')}
                disabled={isSubmitting || success}
              />
              <TextField
                label="Password"
                type="password"
                autoComplete="new-password"
                required
                fullWidth
                value={formData.password}
                onChange={handleChange('password')}
                disabled={isSubmitting || success}
              />
            </Stack>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{ mt: 2 }}
              disabled={isSubmitting || success}
            >
              {isSubmitting ? 'Creating account…' : 'Register'}
            </Button>
          </form>

          <Typography variant="body2" align="center">
            Already have an account?{' '}
            <MuiLink component={RouterLink} to="/user/login" underline="hover">
              Sign in here
            </MuiLink>
          </Typography>
        </Stack>
      </Paper>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <ThemeToggleButton />
      </Box>
    </Box>
  );
};
