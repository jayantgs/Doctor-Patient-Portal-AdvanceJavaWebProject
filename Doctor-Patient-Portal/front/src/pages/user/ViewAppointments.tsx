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
  Stack,
  Rating,
} from '@mui/material';
import { appointmentService, doctorService } from '../../services';
import { useAuth } from '../../contexts/AuthContext';
import type { Appointment } from '../../types/appointment';
import type { Doctor } from '../../types/doctor';
import { ApiClientError } from '../../utils/errorHandler';

/**
 * View own appointments — replaces `view_appointment.jsp`.
 *
 * Loads appointments for the logged-in user via
 * GET /api/appointments/user/{userId}, and resolves each doctor's name
 * (original: inline DoctorDAO.getDoctorById join in the JSP scriptlet).
 */
export const ViewAppointments: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.user?.id ?? 0;
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctorNames, setDoctorNames] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const load = async () => {
      try {
        const data = await appointmentService.getAppointmentsByUser(userId);
        setAppointments(data);

        // Resolve doctor names (original: inline DAO call in JSP).
        const doctorIds = Array.from(new Set(data.map((a) => a.doctorId)));
        const nameMap: Record<number, string> = {};
        for (const id of doctorIds) {
          try {
            const doc = await doctorService.getDoctorById(id);
            nameMap[id] = doc.fullName;
          } catch {
            nameMap[id] = 'Unknown';
          }
        }
        setDoctorNames(nameMap);
        setError(null);
      } catch (err: unknown) {
        setError(err instanceof ApiClientError ? err.message : 'Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [userId]);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        My Appointments
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      {loading ? (
        <Typography>Loading appointments…</Typography>
      ) : appointments.length === 0 ? (
        <Alert severity="info">You have no appointments booked yet.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Doctor</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Disease</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appt, idx) => (
                <TableRow key={appt.id}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{doctorNames[appt.doctorId] ?? `Doctor #${appt.doctorId}`}</TableCell>
                  <TableCell>{appt.appointmentDate}</TableCell>
                  <TableCell>{appt.diseases}</TableCell>
                  <TableCell>
                    <Chip
                      label={appt.status}
                      color={appt.status === 'Pending' ? 'warning' : 'success'}
                      size="small"
                    />
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
