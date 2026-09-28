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
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { doctorService } from '../../services';
import type { Doctor } from '../../types/doctor';
import { ApiClientError } from '../../utils/errorHandler';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

/**
 * View doctors list — replaces `admin/view_doctor.jsp`.
 *
 * GET /api/doctors — lists all doctors with Edit / Delete actions.
 * (Delete confirmation is a stub; in production it would call DELETE
 *  /api/admin/doctors/{id}.)
 */
export const ViewDoctors: React.FC = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    doctorService
      .getAllDoctors()
      .then(setDoctors)
      .catch((err: unknown) => {
        setError(err instanceof ApiClientError ? err.message : 'Failed to load doctors');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) return;
    try {
      await doctorService.deleteDoctor(id);
      setDoctors((prev) => prev.filter((d) => d.id !== id));
    } catch (err: unknown) {
      setError(err instanceof ApiClientError ? err.message : 'Failed to delete doctor');
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        All Doctors
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      {loading ? (
        <Typography>Loading doctors…</Typography>
      ) : doctors.length === 0 ? (
        <Alert severity="info">No doctors registered yet.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Specialist</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {doctors.map((doc, idx) => (
                <TableRow key={doc.id}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{doc.fullName}</TableCell>
                  <TableCell>{doc.email}</TableCell>
                  <TableCell>
                    <Chip label={doc.specialist} size="small" />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit">
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => navigate(`/admin/doctors/edit/${doc.id}`)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDelete(doc.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
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
