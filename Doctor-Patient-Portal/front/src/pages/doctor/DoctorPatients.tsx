import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { doctorService } from '../../services';
import { useAuth } from '../../contexts/AuthContext';
import type { Appointment } from '../../types/appointment';
import { ApiClientError } from '../../utils/errorHandler';
import { ModeComment as CommentIcon } from '@mui/icons-material';

/**
 * Doctor's patient list — replaces `doctor/patient.jsp`.
 *
 * Loads appointments assigned to the logged-in doctor via
 * GET /api/doctors/{id}/appointments.  "Pending" appointments show an
 * enabled Comment button; non-Pending (already commented) show it disabled.
 */
export const DoctorPatients: React.FC = () => {
  const { user } = useAuth();
  const doctorId = user?.user?.id ?? 0;
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!doctorId) return;

    doctorService
      .getDoctorAppointments(doctorId)
      .then((data) => setAppointments(data as Appointment[]))
      .catch((err: unknown) => {
        setError(err instanceof ApiClientError ? err.message : 'Failed to load patients');
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorId]);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        My Patients
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      {loading ? (
        <Typography>Loading your patients…</Typography>
      ) : appointments.length === 0 ? (
        <Alert severity="info">You have no appointments assigned to you yet.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Patient</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Disease</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appt) => (
                <TableRow key={appt.id}>
                  <TableCell>{appt.fullName}</TableCell>
                  <TableCell>{appt.appointmentDate}</TableCell>
                  <TableCell>{appt.diseases}</TableCell>
                  <TableCell>
                    <Chip
                      label={appt.status}
                      color={appt.status === 'Pending' ? 'warning' : 'success'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title={appt.status === 'Pending' ? 'Add comment / prescription' : 'Already commented'}>
                      <span>
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => navigate(`/doctor/comment/${appt.id}`)}
                          disabled={appt.status !== 'Pending'}
                          aria-label="add comment"
                        >
                          <CommentIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};
