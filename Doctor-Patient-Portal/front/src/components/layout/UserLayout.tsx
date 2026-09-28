import { Outlet, Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
} from '@mui/material';
import { ThemeToggleButton } from '../ThemeToggleButton';
import { useAuth } from '../../contexts/AuthContext';
import {
  Dashboard as DashboardIcon,
  EventAvailable as EventIcon,
  Visibility as VisibilityIcon,
  Lock as LockIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';

/**
 * Layout for the patient (user) portal.
 * Mirrors the role-conditional navbar from the original `component/navbar.jsp`.
 */
export const UserLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/user/login');
  };

  return (
    <>
      <AppBar position="sticky" color="primary">
        <Toolbar>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/user/dashboard"
            sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
          >
            Patient Portal
          </Typography>
          <Button
            color="inherit"
            component={RouterLink}
            to="/user/dashboard"
            startIcon={<DashboardIcon />}
          >
            Dashboard
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/user/appointments"
            startIcon={<EventIcon />}
          >
            Book Appointment
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/user/appointments/view"
            startIcon={<VisibilityIcon />}
          >
            My Appointments
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/user/change-password"
            startIcon={<LockIcon />}
          >
            Change Password
          </Button>
          <ThemeToggleButton />
          <Box sx={{ ml: 2 }}>
            <Button
              color="inherit"
              component={RouterLink}
              to="/user/login"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="lg" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </>
  );
};
