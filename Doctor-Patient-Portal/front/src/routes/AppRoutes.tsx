import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PublicLayout } from '../components/layout/PublicLayout';
import { AuthLayout } from '../components/layout/AuthLayout';
import { UserLayout } from '../components/layout/UserLayout';
import { DoctorLayout } from '../components/layout/DoctorLayout';
import { AdminLayout } from '../components/layout/AdminLayout';
import { RequireAuth } from '../components/RoleBasedRoute';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { NotFoundPage } from '../pages/NotFoundPage';

/* User (patient) pages */
import { UserDashboard } from '../pages/user/UserDashboard';
import { BookAppointment } from '../pages/user/BookAppointment';
import { ViewAppointments } from '../pages/user/ViewAppointments';
import { ChangePassword } from '../pages/user/ChangePassword';

/* Doctor pages */
import { DoctorDashboard } from '../pages/doctor/DoctorDashboard';
import { DoctorPatients } from '../pages/doctor/DoctorPatients';
import { DoctorComment } from '../pages/doctor/DoctorComment';
import { DoctorProfile } from '../pages/doctor/DoctorProfile';

/* Admin pages */
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AddDoctor } from '../pages/admin/AddDoctor';
import { ViewDoctors } from '../pages/admin/ViewDoctors';
import { EditDoctor } from '../pages/admin/EditDoctor';
import { AddSpecialist } from '../pages/admin/AddSpecialist';
import { AllAppointments } from '../pages/admin/AllAppointments';

/**
 * Root redirect — sends authenticated users to their dashboard,
 * unauthenticated visitors to the landing page.
 */
const RootRedirect: React.FC = () => {
  const { user } = useAuth();
  if (user) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }
  return <Navigate to="/" replace />;
};

/**
 * Master route tree.
 *
 * Mirrors the navigation map from architecture.md §6.3:
 *   Public → Landing, Login (×3 roles), Register
 *   User   → Dashboard, BookAppointment, ViewAppointments, ChangePassword
 *   Doctor → Dashboard, Patients, Comment, Profile
 *   Admin  → Dashboard, Add/Edit/View Doctor, Add Specialist, All Appointments
 */
export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* ---- Root redirect (authenticated → dashboard, guest → landing) ---- */}
      <Route index element={<RootRedirect />} />

      {/* ---- Public pages (PublicLayout with navbar) ---- */}
      <Route element={<PublicLayout />}>
        <Route path="/landing" element={<LandingPage />} />
      </Route>

      {/* ---- Auth pages (AuthLayout — centered card) — no guard ---- */}
      <Route element={<AuthLayout />}>
        <Route path="/user/login" element={<LoginPage role="user" />} />
        <Route path="/user/register" element={<RegisterPage />} />
        <Route path="/doctor/login" element={<LoginPage role="doctor" />} />
        <Route path="/admin/login" element={<LoginPage role="admin" />} />
      </Route>

      {/* ---- User (patient) routes — guarded ---- */}
      <Route element={<RequireAuth allowedRoles={['user']} redirectTo="/user/login" />}>
        <Route element={<UserLayout />}>
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/appointments" element={<BookAppointment />} />
          <Route path="/user/appointments/view" element={<ViewAppointments />} />
          <Route path="/user/change-password" element={<ChangePassword />} />
        </Route>
      </Route>

      {/* ---- Doctor routes — guarded ---- */}
      <Route element={<RequireAuth allowedRoles={['doctor']} redirectTo="/doctor/login" />}>
        <Route element={<DoctorLayout />}>
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/patients" element={<DoctorPatients />} />
          <Route path="/doctor/comment/:id" element={<DoctorComment />} />
          <Route path="/doctor/profile" element={<DoctorProfile />} />
        </Route>
      </Route>

      {/* ---- Admin routes — guarded ---- */}
      <Route element={<RequireAuth allowedRoles={['admin']} redirectTo="/admin/login" />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/doctors/add" element={<AddDoctor />} />
          <Route path="/admin/doctors/view" element={<ViewDoctors />} />
          <Route path="/admin/doctors/edit/:id" element={<EditDoctor />} />
          <Route path="/admin/specialists" element={<AddSpecialist />} />
          <Route path="/admin/patients" element={<AllAppointments />} />
        </Route>
      </Route>

      {/* ---- Catch-all (must be last) ---- */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
