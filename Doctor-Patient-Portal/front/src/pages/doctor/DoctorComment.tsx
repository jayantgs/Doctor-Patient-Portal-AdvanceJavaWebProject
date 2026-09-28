import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Stack,
  Paper,
  Chip,
  Grid,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { appointmentService } from '../../services';
import { useAuth } from '../../contexts/AuthContext';
import type { Appointment, StatusUpdatePayload } from '../../types';
import { ApiClientError } from '../../utils/errorHandler';
import { withRetry } from '../../utils/retryHandler';

/**
 * Doctor comment / prescription form — replaces `doctor/comment.jsp`.
 *
 * Loads a single appointment (read-only prefill) via
 * GET /api/appointments/{id}, then POSTs the doctor's comment to
 * PUT /api/appointments/{id}/status — which overwrites the `status` column
 * in place (the original business rule: status *is* the comment).
 */
export const DoctorComment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const appointmentId = Number(id);
  const navigate = useNavigate();
  const { user } = useAuth();
  const doctorId = user?.user?.id ?? 0;

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!appointmentId) {
      setError('Invalid appointment ID');
      setLoading(false);
      return;
    }

    appointmentService
      .getAppointmentById(appointmentId)
      .then((data) => {
        setAppointment(data);
        // Pre-fill the comment with the current status if it's not "Pending".
        if (data.status !== 'Pending') {
          setComment(data.status);
        }
        setError(null);
      })
      .catch((err: unknown) => {
        setError(err instanceof ApiClientError ? err.message : 'Failed to load appointment');
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please enter a comment or prescription.');
      return;
    }
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const payload: StatusUpdatePayload = { doctorId, comment };
      await withRetry(() => appointmentService.updateAppointmentStatus(appointmentId, payload));
      setSuccess('Comment / prescription saved successfully.');
      // Redirect back to the patient list.
      setTimeout(() => navigate('/doctor/patients'), 1500);
    } catch (err: unknown) {
      setError(err instanceof ApiClientError ? err.message : 'Failed to save comment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Alert severity="info">Loading appointment details…</Alert>;
  }

  if (error && !appointment) {
    return (
      <Alert severity="error" action={
        <Button onClick={() => navigate('/doctor/patients')}>Back to Patients</Button>
      }>
        {error}
      </Alert>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Typography variant="h4" component="h1" gutterBottom>
        Add Comment / Prescription
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      {appointment && (
        <Paper sx={{ p: 3, mb: 3, bgcolor: 'action.hover' }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">Patient Name</Typography>
              <Typography>{appointment.fullName}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">Appointment Date</Typography>
              <Typography>{appointment.appointmentDate}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">Gender / Age</Typography>
              <Typography>{appointment.gender} / {appointment.age}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">Disease / Notes</Typography>
              <Typography>{appointment.diseases}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">Email</Typography>
              <Typography>{appointment.email}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">Phone</Typography>
              <Typography>{appointment.phone}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">Status</Typography>
              <Chip label={appointment.status} color={appointment.status === 'Pending' ? 'warning' : 'success'} size="small" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">Address</Typography>
              <Typography>{appointment.address}</Typography>
            </Grid>
          </Grid>
        </Paper>
      )}

      <Stack spacing={3}>
        <TextField
          label="Comment / Prescription"
          multiline
          rows={5}
          fullWidth
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={submitting}
          helperText="This replaces the current status (Pending → your comment)."
        />
        <Stack direction="row" spacing={2}>
          <Button type="submit" variant="contained" color="primary" disabled={submitting}>
            {submitting ? 'Saving…' : 'Save Comment'}
          </Button>
          <Button variant="outlined" onClick={() => navigate('/doctor/patients')} disabled={submitting}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};
