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
  Add as AddDoctorIcon,
  Visibility as ViewDoctorsIcon,
  LocalHospital as SpecialistIcon,
  Groups as PatientsIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';

/**
 * Layout for the admin console.
 * Mirrors the original `admin/navbar.jsp`.
 */
export const AdminLayout: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <>
      <AppBar position="sticky" color="error">
        <Toolbar>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/admin/dashboard"
            sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
          >
            Admin Console
          </Typography>
          <Button
            color="inherit"
            component={RouterLink}
            to="/admin/dashboard"
            startIcon={<DashboardIcon />}
          >
            Dashboard
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/admin/doctors/add"
            startIcon={<AddDoctorIcon />}
          >
            Add Doctor
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/admin/doctors/view"
            startIcon={<ViewDoctorsIcon />}
          >
            View Doctors
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/admin/specialists"
            startIcon={<SpecialistIcon />}
          >
            Add Specialist
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/admin/patients"
            startIcon={<PatientsIcon />}
          >
            All Appointments
          </Button>
          <ThemeToggleButton />
          <Box sx={{ ml: 2 }}>
            <Button
              color="inherit"
              component={RouterLink}
              to="/admin/login"
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
