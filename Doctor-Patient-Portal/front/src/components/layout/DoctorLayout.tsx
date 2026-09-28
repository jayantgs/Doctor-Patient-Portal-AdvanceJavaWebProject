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
  LocalHospital as HospitalIcon,
  Comment as CommentIcon,
  Person as PersonIcon,
  Lock as LockIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';

/**
 * Layout for the doctor portal.
 * Mirrors the original `doctor/navbar.jsp`.
 */
export const DoctorLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/doctor/login');
  };

  return (
    <>
      <AppBar position="sticky" color="secondary">
        <Toolbar>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/doctor/dashboard"
            sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
          >
            Doctor Portal
          </Typography>
          <Button
            color="inherit"
            component={RouterLink}
            to="/doctor/dashboard"
            startIcon={<DashboardIcon />}
          >
            Dashboard
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/doctor/patients"
            startIcon={<HospitalIcon />}
          >
            My Patients
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/doctor/profile"
            startIcon={<PersonIcon />}
          >
            Edit Profile
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/doctor/profile"
            startIcon={<LockIcon />}
          >
            Change Password
          </Button>
          <ThemeToggleButton />
          <Box sx={{ ml: 2 }}>
            <Button
              color="inherit"
              component={RouterLink}
              to="/doctor/login"
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
