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
import { doctorService, specialistService, authService } from '../../services';
import { useAuth } from '../../contexts/AuthContext';
import type { Doctor, DoctorPayload } from '../../types/doctor';
import type { Specialist } from '../../types/specialist';
import { ApiClientError } from '../../utils/errorHandler';
import { withRetry } from '../../utils/retryHandler';

/**
 * Doctor edit profile page — replaces `doctor/edit_profile.jsp`.
 *
 * Loads the current doctor profile, all specialists (for the dropdown), and
 * provides two forms:
 *   1. Edit Profile   → PUT /api/doctors/{id}/profile (password NOT updated)
 *   2. Change Password → PUT /api/doctors/{id}/change-password
 */
export const DoctorProfile: React.FC = () => {
  const { user } = useAuth();
  const doctorId = user?.user?.id ?? 0;

  const [profile, setProfile] = useState<Doctor | null>(null);
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [pwForm, setPwForm] = useState({ oldPassword: '', newPassword: '' });
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState<string | null>(null);

  // Load doctor profile + specialists on mount.
  useEffect(() => {
    if (!doctorId) return;

    const load = async () => {
      setLoading(true);
      try {
        const [doc, specs] = await Promise.all([
          withRetry(() => doctorService.getDoctorById(doctorId)),
          withRetry(() => specialistService.getAllSpecialists()),
        ]);
        setProfile(doc);
        setSpecialists(specs);
        setError(null);
      } catch (err: unknown) {
        setError(err instanceof ApiClientError ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorId]);

  const handleProfileChange = (field: keyof DoctorPayload) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setProfile((prev) => (prev ? { ...prev, [field]: e.target.value } : prev));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const { password, ...profileData } = profile;
      void password; // password is intentionally not sent to the profile endpoint
      const updated = await doctorService.updateDoctorProfile(doctorId, profileData as DoctorPayload);
      setProfile(updated);
      setSuccess('Profile updated successfully.');
    } catch (err: unknown) {
      setError(err instanceof ApiClientError ? err.message : 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError(null);
    setPwSuccess(null);
    if (!pwForm.newPassword || pwForm.newPassword.length < 6) {
      setPwError('New password must be at least 6 characters.');
      return;
    }
    setIsSubmitting(true);
    try {
      await withRetry(() => authService.changePassword('doctor', doctorId, pwForm));
      setPwSuccess('Password changed successfully.');
      setPwForm({ oldPassword: '', newPassword: '' });
    } catch (err: unknown) {
      setPwError(err instanceof ApiClientError ? err.message : 'Failed to change password');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <Alert severity="info">Loading profile…</Alert>;
  }

  if (error && !profile) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Edit Profile
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      {/* ---- Profile edit form ---- */}
      {profile && (
        <Paper component="form" onSubmit={handleProfileSubmit} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>Profile Information</Typography>
          <Grid container spacing={3} sx={{ mt: 0.5 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Full Name"
                fullWidth
                value={profile.fullName}
                onChange={handleProfileChange('fullName')}
                disabled={isSubmitting}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={profile.email}
                InputProps={{ readOnly: true }}
                helperText="Email cannot be changed"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Date of Birth"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={profile.dateOfBirth}
                onChange={handleProfileChange('dateOfBirth')}
                disabled={isSubmitting}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Qualification"
                fullWidth
                value={profile.qualification}
                onChange={handleProfileChange('qualification')}
                disabled={isSubmitting}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth disabled={isSubmitting}>
                <InputLabel id="specialist-label">Specialist</InputLabel>
                <Select
                  labelId="specialist-label"
                  label="Specialist"
                  value={profile.specialist}
                  onChange={(e) => setProfile((prev) => prev ? { ...prev, specialist: e.target.value } : prev)}
                >
                  {specialists.map((spec) => (
                    <MenuItem key={spec.id} value={spec.specialistName}>
                      {spec.specialistName}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Select your medical speciality.</FormHelperText>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Phone"
                fullWidth
                value={profile.phone}
                onChange={handleProfileChange('phone')}
                disabled={isSubmitting}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Saving…' : 'Save Profile'}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* ---- Change password form ---- */}
      <Paper component="form" onSubmit={handlePasswordSubmit} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Change Password</Typography>
        {pwError && <Alert severity="error">{pwError}</Alert>}
        {pwSuccess && <Alert severity="success">{pwSuccess}</Alert>}
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            label="Current Password"
            type="password"
            required
            fullWidth
            value={pwForm.oldPassword}
            onChange={(e) => setPwForm((prev) => ({ ...prev, oldPassword: e.target.value }))}
            disabled={isSubmitting}
          />
          <TextField
            label="New Password"
            type="password"
            required
            fullWidth
            value={pwForm.newPassword}
            onChange={(e) => setPwForm((prev) => ({ ...prev, newPassword: e.target.value }))}
            disabled={isSubmitting}
          />
          <Button type="submit" variant="contained" color="secondary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Change Password'}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};
