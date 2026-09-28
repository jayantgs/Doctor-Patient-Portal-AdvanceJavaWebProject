import { Outlet, Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { ThemeToggleButton } from '../ThemeToggleButton';

/**
 * Public layout for the landing page and guest-facing routes.
 * Includes a public navbar with links to login pages.
 */
export const PublicLayout: React.FC = () => {
  return (
    <>
      <AppBar position="sticky" color="primary">
        <Toolbar>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
          >
            Doctor-Patient Portal
          </Typography>
          <Button color="inherit" component={RouterLink} to="/user/login">
            User Login
          </Button>
          <Button color="inherit" component={RouterLink} to="/doctor/login">
            Doctor Login
          </Button>
          <Button color="inherit" component={RouterLink} to="/admin/login">
            Admin Login
          </Button>
          <ThemeToggleButton />
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="lg" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </>
  );
};
