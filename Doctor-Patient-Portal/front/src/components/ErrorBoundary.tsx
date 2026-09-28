import { Component, type ReactNode, type ErrorInfo } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { logError } from '../utils/errorHandler';

/**
 * Props for the ErrorBoundary.
 *
 * @property fallback  Optional custom fallback UI.  When omitted the default
 *                     error page is rendered.
 * @property onError   Optional callback invoked when an error is caught.
 */
interface ErrorBoundaryProps {
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Class-component error boundary.
 *
 * Catches render-time errors in the component tree below it, logs them, and
 * displays a user-friendly fallback UI with a retry button.  This mirrors the
 * backend's "flash message" pattern but at the component level.
 *
 * Note: error boundaries only catch errors during rendering — they do **not**
 * catch errors in async callbacks or event handlers (those are handled by the
 * axios error interceptor and `useApi` hook).
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logError({ error, errorInfo }, 'ErrorBoundary');
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Something went wrong
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              We're sorry — an unexpected error occurred while rendering this page.
            </Typography>
            {this.state.error && (
              <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                {this.state.error.message}
              </Typography>
            )}
          </Box>
          <Button variant="contained" color="primary" onClick={this.handleRetry}>
            Try again
          </Button>
        </Container>
      );
    }

    return this.props.children;
  }
}
