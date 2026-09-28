import { Box, CircularProgress, Typography, type BoxProps } from '@mui/material';

/**
 * Full-screen loading spinner overlay.
 *
 * Used as a fallback while the auth context hydrates from localStorage and
 * when data is being fetched in the dashboard pages.
 */
interface LoadingSpinnerProps extends BoxProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message, sx, ...rest }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        gap: 2,
        ...sx,
      }}
      {...rest}
    >
      <CircularProgress />
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );
};
