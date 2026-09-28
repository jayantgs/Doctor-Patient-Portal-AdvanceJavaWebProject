import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Paper,
  Stack,
} from '@mui/material';
import { apiRequest } from '../../services/apiClient';
import { API_ENDPOINTS } from '../../services/apiEndpoints';
import { useAuth } from '../../contexts/AuthContext';
import type { ChangePasswordRequest } from '../../types';
import { validatePassword } from '../../utils/validation';
import { ApiClientError } from '../../utils/errorHandler';
import { withRetry } from '../../utils/retryHandler';

/**
 * Change password form — replaces `change_password.jsp`.
 *
 * PUT /api/users/{userId}/change-password (or /api/doctors/{id}/change-password).
 * Verifies the old password before setting a new one.
 */
export const ChangePassword: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.user?.id ?? 0;
  const role = user?.role ?? 'user';

  const [formData, setFormData] = useState<ChangePasswordRequest>({
    oldPassword: '',
    newPassword: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof ChangePasswordRequest) => (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Client-side validation.
    const oldError = validatePassword(formData.oldPassword);
    if (oldError) {
      setError(oldError);
      return;
    }
    const newError = validatePassword(formData.newPassword);
    if (newError) {
      setError(newError);
      return;
    }
    if (formData.newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      const endpoint =
        role === 'doctor'
          ? API_ENDPOINTS.DOCTOR_CHANGE_PASSWORD(userId)
          : API_ENDPOINTS.USER_CHANGE_PASSWORD(userId);
      const response = await withRetry(() =>
        apiRequest('put', endpoint, formData),
      );
      setSuccess(typeof response === 'string' ? response : 'Password changed successfully.');
      setFormData({ oldPassword: '', newPassword: '' });
      setConfirmPassword('');
    } catch (err: unknown) {
      setError(err instanceof ApiClientError ? err.message : 'Failed to change password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Typography variant="h4" component="h1" gutterBottom>
        Change Password
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <Paper sx={{ p: 3, mt: 2 }}>
        <Stack spacing={3}>
          <TextField
            label="Current Password"
            type="password"
            required
            fullWidth
            value={formData.oldPassword}
            onChange={handleChange('oldPassword')}
            disabled={isSubmitting}
          />
          <TextField
            label="New Password"
            type="password"
            required
            fullWidth
            value={formData.newPassword}
            onChange={handleChange('newPassword')}
            disabled={isSubmitting}
          />
          <TextField
            label="Confirm New Password"
            type="password"
            required
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isSubmitting}
          />
          <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Change Password'}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};
