import { Box, Typography, Button, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

/**
 * 404 Not Found page.
 *
 * Shown when no route matches the current URL.
 */
export const NotFoundPage: React.FC = () => {
  return (
    <Container maxWidth="sm" sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <Box>
        <Typography variant="h1" component="h1" variantMapping={{ h1: 'div' }} sx={{ fontSize: '4rem', fontWeight: 'bold', color: 'primary.main' }}>
          404
        </Typography>
        <Typography variant="h5" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          The page you are looking for does not exist or has been moved.
        </Typography>
        <Button component={RouterLink} to="/" variant="contained" color="primary">
          Go to Home
        </Button>
      </Box>
    </Container>
  );
};
