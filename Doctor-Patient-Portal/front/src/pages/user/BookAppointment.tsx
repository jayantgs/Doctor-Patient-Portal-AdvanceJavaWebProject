import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Stack,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from '@mui/material';
import { doctorService, appointmentService } from '../../services';
import { useNavigate } from 'react-router-dom';
import type { Doctor } from '../../types/doctor';
import type { Appointment } from '../../types/appointment';
import { useAuth } from '../../contexts/AuthContext';
import { useApi } from '../../hooks/useApi';
import { ApiClientError } from '../../utils/errorHandler';

/**
 * Appointment booking form — replaces `user_appointment.jsp`.
 *
 * On mount it loads the doctor list (for the `<select>`) via
 * GET /api/doctors.  On submit it POSTs to /api/appointments.
 * The server hard-codes `status = "Pending"`.
 */
export const BookAppointment: React.FC = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorLoading, setDoctorLoading] = useState(true);
  const [doctorError, setDoctorError] = useState<string | null>(null);

  const { execute, loading, error, reset } = useApi(appointmentService.createAppointment, false);
  const navigate = useNavigate();
  const currentUserId = user?.user?.id ?? 0;

  const [form, setForm] = useState<Omit<Appointment, 'id' | 'status'>>({
    userId: currentUserId,
    fullName: '',
    gender: 'male',
    age: '',
    appointmentDate: '',
    email: '',
    phone: '',
    diseases: '',
    doctorId: 0,
    address: '',
  });

  // Load doctors on mount (original: DoctorDAO.getAllDoctor()).
  useEffect(() => {
    doctorService
      .getAllDoctors()
      .then((data) => setDoctors(data))
      .catch((err: unknown) => {
        setDoctorError(err instanceof Error ? err.message : 'Failed to load doctors');
      })
      .finally(() => setDoctorLoading(false));
  }, []);

  const handleChange = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: unknown } },
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    reset();
    try {
      await execute({ ...form, userId: currentUserId });
      // On success, redirect to "view my appointments".
      navigate('/user/appointments/view');
    } catch (err: unknown) {
      // Error is already surfaced via `useApi`.
      if (err instanceof ApiClientError) {
        console.error('Booking failed:', err.message);
      }
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Typography variant="h4" component="h1" gutterBottom>
        Book an Appointment
      </Typography>

      {error && <Alert severity="error">{error.message}</Alert>}
      {doctorError && <Alert severity="warning">{doctorError}</Alert>}

      <Stack spacing={3} sx={{ mt: 2 }}>
        <TextField
          label="Full Name"
          required
          fullWidth
          value={form.fullName}
          onChange={handleChange('fullName')}
        />
        <TextField
          label="Email"
          type="email"
          required
          fullWidth
          value={form.email}
          onChange={handleChange('email')}
        />
        <FormControl fullWidth required disabled={doctorLoading}>
          <InputLabel id="doctor-select-label">Select Doctor</InputLabel>
          <Select
            labelId="doctor-select-label"
            label="Select Doctor"
            value={form.doctorId || ''}
            onChange={(e) => setForm((prev) => ({ ...prev, doctorId: Number(e.target.value) }))}
            required
          >
            <MenuItem value="" disabled>
              Choose a doctor
            </MenuItem>
            {doctors.map((doc) => (
              <MenuItem key={doc.id} value={doc.id}>
                {doc.fullName} — {doc.specialist}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>Choose the doctor you wish to see.</FormHelperText>
        </FormControl>
        <TextField
          label="Age"
          type="number"
          required
          fullWidth
          value={form.age}
          onChange={handleChange('age')}
        />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ gap: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="gender-label">Gender</InputLabel>
            <Select
              labelId="gender-label"
              label="Gender"
              value={form.gender}
              onChange={(e) => setForm((prev) => ({ ...prev, gender: e.target.value }))}
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Appointment Date"
            type="date"
            required
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={form.appointmentDate}
            onChange={handleChange('appointmentDate')}
          />
        </Stack>
        <TextField
          label="Phone"
          required
          fullWidth
          value={form.phone}
          onChange={handleChange('phone')}
        />
        <TextField
          label="Diseases / Notes"
          multiline
          rows={3}
          fullWidth
          value={form.diseases}
          onChange={handleChange('diseases')}
        />
        <TextField
          label="Address"
          multiline
          rows={2}
          fullWidth
          value={form.address}
          onChange={handleChange('address')}
        />

        <Button type="submit" variant="contained" color="primary" size="large" disabled={loading}>
          {loading ? 'Booking…' : 'Book Appointment'}
        </Button>
      </Stack>
    </Box>
  );
};
