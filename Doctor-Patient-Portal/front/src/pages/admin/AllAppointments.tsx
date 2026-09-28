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
} from '@mui/material';
import { appointmentService, doctorService } from '../../services';
import type { Appointment } from '../../types/appointment';
import { ApiClientError } from '../../utils/errorHandler';
import { formatDate } from '../../utils/formatDate';

/**
 * All appointments view — replaces `admin/patient.jsp`.
 *
 * GET /api/appointments/all and resolves doctor names via
 * GET /api/doctors/{id} (original: inline join in the JSP scriptlet).
 */
export const AllAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctorNames, setDoctorNames] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await appointmentService.getAllAppointments();
        setAppointments(data);

        // Resolve doctor names.
        const ids = Array.from(new Set(data.map((a) => a.doctorId)));
        const nameMap: Record<number, string> = {};
        for (const id of ids) {
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
  }, []);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        All Appointments
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      {loading ? (
        <Typography>Loading appointments…</Typography>
      ) : appointments.length === 0 ? (
        <Alert severity="info">No appointments found.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Patient</TableCell>
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
                  <TableCell>{appt.fullName}</TableCell>
                  <TableCell>{doctorNames[appt.doctorId] ?? `#${appt.doctorId}`}</TableCell>
                  <TableCell>{formatDate(appt.appointmentDate)}</TableCell>
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
