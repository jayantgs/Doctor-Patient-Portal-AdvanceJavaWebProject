import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import { specialistService } from '../../services';
import type { Specialist } from '../../types/specialist';
import { ApiClientError } from '../../utils/errorHandler';
import { withRetry } from '../../utils/retryHandler';

/**
 * Add specialist form — replaces the "Add Specialist modal" in `admin/index.jsp`.
 *
 * POST /api/specialists.  Also shows a small list of existing specialists
 * for context.
 */
export const AddSpecialist: React.FC = () => {
  const [name, setName] = useState('');
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load existing specialists on mount.
  useEffect(() => {
    specialistService.getAllSpecialists()
      .then(setSpecialists)
      .catch(() => setSpecialists([]));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim()) {
      setError('Specialist name is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      await withRetry(() => specialistService.addSpecialist({ specialistName: name.trim() }));
      setSuccess(`Specialist "${name.trim()}" added successfully.`);
      setName('');
      // Refresh the list.
      specialistService.getAllSpecialists().then(setSpecialists).catch(() => {});
    } catch (err: unknown) {
      setError(err instanceof ApiClientError ? err.message : 'Failed to add specialist');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Add Specialist
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, maxWidth: 480 }}>
        <TextField
          label="Specialist Name"
          placeholder="e.g. Cardiology, Neurology, Pediatrics"
          required
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isSubmitting}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          disabled={isSubmitting || !name.trim()}
        >
          {isSubmitting ? 'Adding…' : 'Add Specialist'}
        </Button>
      </Box>

      {/* Existing specialists list */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Existing Specialists ({specialists.length})
        </Typography>
        <Box display="flex" flexDirection="column" gap={1} flexWrap="wrap">
          {specialists.map((spec) => (
            <Card key={spec.id} variant="outlined" sx={{ maxWidth: 240 }}>
              <CardContent>
                <Typography variant="body1">{spec.specialistName}</Typography>
              </CardContent>
            </Card>
          ))}
          {specialists.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              No specialists found.
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};
