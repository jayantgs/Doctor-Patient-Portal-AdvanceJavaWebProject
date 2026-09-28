import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Alert,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import { apiRequest } from '../../services/apiClient';
import type { DashboardCounts } from '../../types';
import { ApiClientError } from '../../utils/errorHandler';
import { withRetry } from '../../utils/retryHandler';

/**
 * Admin dashboard — replaces `admin/index.jsp`.
 *
 * Shows dashboard counts via GET /api/admin/dashboard
 * (original: DoctorDAO/SpecialistDAO/UserDAO count helpers called from scriptlets).
 */
export const AdminDashboard: React.FC = () => {
  const [counts, setCounts] = useState<DashboardCounts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    withRetry(() => apiRequest<DashboardCounts>('get', '/api/admin/dashboard'))
      .then(setCounts)
      .catch((err: unknown) => {
        setError(err instanceof ApiClientError ? err.message : 'Failed to load dashboard');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      {loading ? (
        <Typography>Loading dashboard metrics…</Typography>
      ) : counts && (
        <Grid container spacing={3} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="h4">{counts.totalDoctors}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Doctors
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="h4">{counts.totalUsers ?? '—'}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Users
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="h4">{counts.totalAppointments}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Appointments
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="h4">{counts.totalSpecialists ?? '—'}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Specialists
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};
