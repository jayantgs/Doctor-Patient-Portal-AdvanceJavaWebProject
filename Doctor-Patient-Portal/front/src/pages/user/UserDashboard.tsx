import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Grid,
} from '@mui/material';

/**
 * Patient dashboard — replaces `user/appointment.jsp` landing concept.
 *
 * Shows quick-action cards for the three patient self-service flows:
 *   1. Book a new appointment
 *   2. View existing appointments
 *   3. Change password
 *
 * Data fetching (appointment counts) is wired through the service layer but
 * will be fully implemented in the components phase.
 */
export const UserDashboard: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Patient Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Welcome back! Manage your appointments and profile from here.
      </Typography>

      <Box sx={{ mt: 4 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} flexWrap="wrap" gap={2}>
          <Card sx={{ minWidth: 220, flex: 1 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Book Appointment
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Schedule a new appointment with an available doctor.
                Real-time availability and instant confirmation.
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ minWidth: 220, flex: 1 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                My Appointments
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View, track, and check the status of your appointments.
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ minWidth: 220, flex: 1 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Change Password
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Update your account password.
              </Typography>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </Box>
  );
};
