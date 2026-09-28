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
import { doctorService, specialistService } from '../../services';
import type { DoctorPayload } from '../../types/doctor';
import type { Specialist } from '../../types/specialist';
import { ApiClientError } from '../../utils/errorHandler';
import { withRetry } from '../../utils/retryHandler';
import { validateEmail, validatePhone, validatePassword } from '../../utils/validation';

/**
 * Add doctor form — replaces `admin/doctor.jsp`.
 *
 * POST /api/admin/doctors.  Loads specialist categories for the dropdown
 * (original: SpecialistDAO.getAllSpecialist() called from the JSP scriptlet).
 */
export const AddDoctor: React.FC = () => {
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState<DoctorPayload>({
    fullName: '',
    dateOfBirth: '',
    qualification: '',
    specialist: '',
    email: '',
    phone: '',
    password: '',
  });

  useEffect(() => {
    specialistService
      .getAllSpecialists()
      .then(setSpecialists)
      .catch(() => setSpecialists([]))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field: keyof DoctorPayload) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate required fields.
    const errors: string[] = [];
    if (!form.fullName) errors.push('Full name is required');
    const emailErr = validateEmail(form.email);
    if (emailErr) errors.push(emailErr);
    const phoneErr = validatePhone(form.phone);
    if (phoneErr) errors.push(phoneErr);
    const pwErr = validatePassword(form.password);
    if (pwErr) errors.push(pwErr);

    if (errors.length > 0) {
      setError(errors.join('\n'));
      return;
    }

    setIsSubmitting(true);
    try {
      await withRetry(() => doctorService.addDoctor(form));
      setSuccess('Doctor added successfully.');
      setForm({
        fullName: '',
        dateOfBirth: '',
        qualification: '',
        specialist: '',
        email: '',
        phone: '',
        password: '',
      });
    } catch (err: unknown) {
      setError(err instanceof ApiClientError ? err.message : 'Failed to add doctor');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Typography variant="h4" component="h1" gutterBottom>
        Add New Doctor
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <Paper sx={{ p: 3, mt: 2 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Full Name"
              required
              fullWidth
              value={form.fullName}
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
              value={form.email}
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
              value={form.dateOfBirth}
              onChange={handleChange('dateOfBirth')}
              disabled={isSubmitting}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Qualification"
              required
              fullWidth
              value={form.qualification}
              onChange={handleChange('qualification')}
              disabled={isSubmitting}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth required disabled={isSubmitting || loading}>
              <InputLabel id="specialist-label">Specialist</InputLabel>
              <Select
                labelId="specialist-label"
                label="Specialist"
                value={form.specialist}
                onChange={(e) => setForm((prev) => ({ ...prev, specialist: e.target.value }))}
              >
                {specialists.map((spec) => (
                  <MenuItem key={spec.id} value={spec.specialistName}>
                    {spec.specialistName}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Choose the doctor's medical speciality.</FormHelperText>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Phone"
              required
              fullWidth
              value={form.phone}
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
              value={form.password}
              onChange={handleChange('password')}
              disabled={isSubmitting}
            />
          </Grid>
        </Grid>

        <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 3 }}>
          <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Add Doctor'}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};
