import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Stack,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Grid,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { doctorService, specialistService } from '../../services';
import type { Doctor, DoctorPayload } from '../../types/doctor';
import type { Specialist } from '../../types/specialist';
import { ApiClientError } from '../../utils/errorHandler';
import { validateEmail, validatePhone } from '../../utils/validation';

/**
 * Edit doctor form — replaces `admin/edit_doctor.jsp`.
 *
 * GET /api/doctors/{id} to pre-fill, then PUT /api/admin/doctors/{id} to save
 * (original: UpdateDoctorServlet → updateDoctor, which includes the password).
 */
export const EditDoctor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const doctorId = Number(id);
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!doctorId) {
      setError('Invalid doctor ID');
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        const [doc, specs] = await Promise.all([
          doctorService.getDoctorById(doctorId),
          specialistService.getAllSpecialists(),
        ]);
        setDoctor(doc);
        setSpecialists(specs);
        setError(null);
      } catch (err: unknown) {
        setError(err instanceof ApiClientError ? err.message : 'Failed to load doctor');
      } finally {
        setLoading(false);
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorId]);

  const handleChange = (field: keyof DoctorPayload) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setDoctor((prev) => (prev ? { ...prev, [field]: e.target.value } : prev));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctor) return;
    setError(null);
    setSuccess(null);

    const emailErr = validateEmail(doctor.email);
    if (emailErr) {
      setError(emailErr);
      return;
    }
    const phoneErr = validatePhone(doctor.phone);
    if (phoneErr) {
      setError(phoneErr);
      return;
    }

    setIsSubmitting(true);
    try {
      await doctorService.updateDoctor(doctorId, doctor);
      setSuccess('Doctor updated successfully.');
    } catch (err: unknown) {
      setError(err instanceof ApiClientError ? err.message : 'Failed to update doctor');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <Alert severity="info">Loading doctor details…</Alert>;
  }

  if (error && !doctor) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Typography variant="h4" component="h1" gutterBottom>
        Edit Doctor
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      {doctor && (
        <Paper sx={{ p: 3, mt: 2 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Full Name"
                required
                fullWidth
                value={doctor.fullName}
                onChange={handleChange('fullName')}
                disabled={isSubmitting}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Email"
                type="email"
                required
                fullWidth
                value={doctor.email}
                onChange={handleChange('email')}
                disabled={isSubmitting}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Date of Birth"
                type="date"
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={doctor.dateOfBirth}
                onChange={handleChange('dateOfBirth')}
                disabled={isSubmitting}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Qualification"
                required
                fullWidth
                value={doctor.qualification}
                onChange={handleChange('qualification')}
                disabled={isSubmitting}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth disabled={isSubmitting}>
                <InputLabel id="specialist-label">Specialist</InputLabel>
                <Select
                  labelId="specialist-label"
                  label="Specialist"
                  value={doctor.specialist}
                  onChange={(e) => setDoctor((prev) => prev ? { ...prev, specialist: e.target.value } : prev)}
                >
                  {specialists.map((spec) => (
                    <MenuItem key={spec.id} value={spec.specialistName}>
                      {spec.specialistName}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Medical speciality.</FormHelperText>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Phone"
                required
                fullWidth
                value={doctor.phone}
                onChange={handleChange('phone')}
                disabled={isSubmitting}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Password"
                type="password"
                required
                fullWidth
                value={doctor.password ?? ''}
                onChange={handleChange('password')}
                disabled={isSubmitting}
              />
            </Grid>
          </Grid>

          <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 3 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/admin/doctors/view')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : 'Update Doctor'}
            </Button>
          </Stack>
        </Paper>
      )}
    </Box>
  );
};
