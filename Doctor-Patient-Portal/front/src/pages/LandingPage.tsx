import { Box, Typography, Button, Container, Grid, Card, CardContent, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { ThemeToggleButton } from '../components/ThemeToggleButton';
import { useAuth } from '../contexts/AuthContext';

/**
 * Landing page — replaces `index.jsp`.
 *
 * Shows a hero section with calls-to-action for the three roles, plus a
 * brief feature overview mirroring the original landing page cards.
 */
export const LandingPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <>
      {/* Hero section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
          color: 'primary.contrastText',
          py: { xs: 6, md: 10 },
          mb: 4,
        }}
      >
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
          <Typography variant="h2" component="h1" variantMapping={{ h2: 'h1' }} gutterBottom>
            Doctor-Patient Portal
          </Typography>
          <Typography variant="h5" paragraph sx={{ mb: 4, opacity: 0.9 }}>
            Manage your healthcare appointments, track prescriptions, and
            access your medical records — all in one place.
          </Typography>

          {user ? (
            <Button
              component={RouterLink}
              to={`/${user.role}/dashboard`}
              variant="contained"
              size="large"
              color="secondary"
            >
              Go to {user.role} Dashboard
            </Button>
          ) : (
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
            >
              <Button
                component={RouterLink}
                to="/user/login"
                variant="contained"
                size="large"
                color="secondary"
              >
                Patient Login
              </Button>
              <Button
                component={RouterLink}
                to="/doctor/login"
                variant="outlined"
                size="large"
                sx={{ borderColor: 'primary.contrastText', color: 'primary.contrastText' }}
              >
                Doctor Login
              </Button>
              <Button
                component={RouterLink}
                to="/admin/login"
                variant="outlined"
                size="large"
                sx={{ borderColor: 'primary.contrastText', color: 'primary.contrastText' }}
              >
                Admin Login
              </Button>
            </Stack>
          )}
        </Container>
      </Box>

      {/* Feature cards */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Book Appointments
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Schedule appointments with qualified doctors in your area.
                  Real-time availability and instant confirmation.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Track Prescriptions
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Doctors can review patient appointments, add comments and
                  prescriptions directly in the system.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Admin Dashboard
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage doctors, specialties, and view all patient
                  appointments from a single admin console.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <ThemeToggleButton sx={{ position: 'fixed', bottom: 16, right: 16 }} />
    </>
  );
};
