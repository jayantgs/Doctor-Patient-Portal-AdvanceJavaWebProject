import { Outlet } from 'react-router-dom';
import { Container } from '@mui/material';

/**
 * Layout for public auth pages (login, register).
 * Renders the outlet content in a centered container.
 */
export const AuthLayout: React.FC = () => {
  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Outlet />
    </Container>
  );
};
