import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Alert,
  Card,
  CardContent,
  Stack,
  Grid,
} from '@mui/material';
import { doctorService } from '../../services';
import { useAuth } from '../../contexts/AuthContext';
import type { DashboardCounts } from '../../types';
import { ApiClientError } from '../../utils/errorHandler';
import { withRetry } from '../../utils/retryHandler';

/**
 * Doctor dashboard — replaces `doctor/index.jsp`.
 *
 * Shows dashboard metrics via GET /api/doctors/{id}/dashboard
 * (original: DoctorDAO.countTotalDoctor + countTotalAppointmentByDoctorId).
 */
export const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const doctorId = user?.user?.id ?? 0;
  const [counts, setCounts] = useState<DashboardCounts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!doctorId) return;

    doctorService
      .getDoctorDashboard(doctorId)
      .then(setCounts)
      .catch((err: unknown) => {
        setError(err instanceof ApiClientError ? err.message : 'Failed to load dashboard');
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorId]);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Doctor Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Welcome, {user?.user?.fullName ?? 'Doctor'}! Here's an overview of your practice.
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      {loading ? (
        <Typography>Loading dashboard metrics…</Typography>
      ) : counts && (
        <Grid container spacing={3} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="h5">{counts.totalDoctors}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Doctors
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="h5">{counts.totalAppointments}</Typography>
                <Typography variant="body2" color="text.secondary">
                  My Appointments
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};
