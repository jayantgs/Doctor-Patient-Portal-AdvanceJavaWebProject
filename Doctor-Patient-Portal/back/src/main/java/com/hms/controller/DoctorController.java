package com.hms.controller;

import java.util.LinkedHashMap;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hms.dao.AppointmentDAO;
import com.hms.dao.DoctorDAO;
import com.hms.db.DBConnection;
import com.hms.dto.ApiResponse;
import com.hms.dto.ChangePasswordRequest;
import com.hms.dto.LoginRequest;
import com.hms.entity.Appointment;
import com.hms.entity.Doctor;

/**
 * REST controller for doctor portal operations.
 *
 * Maps to the original doctor.servlet package:
 *   - DoctorLoginServlet       → POST /doctorLogin
 *   - DoctorLogoutServlet      → GET  /doctorLogout
 *   - DoctorEditProfileServlet → POST /doctorEditProfile
 *   - DoctorChangePassword     → POST /doctorChangePassword
 *   - UpdateStatus             → POST /updateStatus  (also exposed via AppointmentController)
 *
 * Also exposes read-only data endpoints originally served by JSP scriptlets:
 *   - DoctorDAO.getAllDoctor()
 *   - DoctorDAO.getDoctorById(id)
 *   - AppointmentDAO.getAllAppointmentByLoginDoctor(doctorId)
 *   - DoctorDAO count helpers (doctor dashboard)
 */
@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorDAO doctorDAO = new DoctorDAO(DBConnection.getConn());

    /**
     * POST /api/doctors/login
     *
     * Doctor login. Equivalent to DoctorLoginServlet → loginDoctor(email, password).
     * On success the doctor object is stored in the HTTP session as "doctorObj".
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse> loginDoctor(@RequestBody LoginRequest loginRequest, HttpSession session) {
        Doctor doctor = doctorDAO.loginDoctor(loginRequest.getEmail(), loginRequest.getPassword());
        if (doctor != null) {
            session.setAttribute("doctorObj", doctor);
            return ResponseEntity.ok(new ApiResponse(true, "Login successful", doctor));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse(false, "Invalid email or password"));
        }
    }

    /**
     * POST /api/doctors/logout
     *
     * Removes the "doctorObj" session attribute.
     * Equivalent to DoctorLogoutServlet.
     */
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse> logoutDoctor(HttpSession session) {
        session.removeAttribute("doctorObj");
        session.setAttribute("successMsg", "Doctor Logout Successfully.");
        return ResponseEntity.ok(new ApiResponse(true, "Doctor Logout Successfully."));
    }

    /**
     * GET /api/doctors
     *
     * Returns all doctors. Used by admin doctor lists and the appointment
     * booking form (original: DoctorDAO.getAllDoctor()).
     */
    @GetMapping
    public ResponseEntity<ApiResponse> getAllDoctors() {
        return ResponseEntity.ok(new ApiResponse(true, "Doctors retrieved", doctorDAO.getAllDoctor()));
    }

    /**
     * GET /api/doctors/{id}
     *
     * Returns a single doctor by id.
     * Original: DoctorDAO.getDoctorById(id), used by admin edit_doctor.jsp
     * and DoctorEditProfileServlet to refresh the session object.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getDoctorById(@PathVariable int id) {
        Doctor doctor = doctorDAO.getDoctorById(id);
        if (doctor != null) {
            return ResponseEntity.ok(new ApiResponse(true, "Doctor retrieved", doctor));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, "Doctor not found with id: " + id));
        }
    }

    /**
     * GET /api/doctors/{id}/appointments
     *
     * Returns all appointments assigned to a specific doctor.
     * Original: AppointmentDAO.getAllAppointmentByLoginDoctor(doctorId),
     * used by doctor/patient.jsp.
     */
    @GetMapping("/{id}/appointments")
    public ResponseEntity<ApiResponse> getAppointmentsByDoctor(@PathVariable int id) {
        AppointmentDAO appointmentDAO = new AppointmentDAO(DBConnection.getConn());
        return ResponseEntity.ok(
                new ApiResponse(true, "Appointments retrieved", appointmentDAO.getAllAppointmentByLoginDoctor(id)));
    }

    /**
     * PUT /api/doctors/{id}/profile
     *
     * Updates a doctor's profile (fullName, dateOfBirth, qualification,
     * specialist, email, phone). Password is intentionally NOT updated.
     * Equivalent to DoctorEditProfileServlet → editDoctorProfile(doctor).
     * Returns the refreshed Doctor object (as the servlet did via getDoctorById).
     */
    @PutMapping("/{id}/profile")
    public ResponseEntity<ApiResponse> editProfile(@PathVariable int id, @RequestBody Doctor doctor) {
        doctor.setId(id);
        // Password is not updated by editDoctorProfile — pass empty string to preserve original behaviour.
        doctor.setPassword("");

        boolean f = doctorDAO.editDoctorProfile(doctor);
        if (f) {
            Doctor updatedDoctor = doctorDAO.getDoctorById(id);
            return ResponseEntity.ok(new ApiResponse(true, "Doctor update Successfully", updatedDoctor));
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Something went wrong on server!"));
        }
    }

    /**
     * PUT /api/doctors/{id}/change-password
     *
     * Verifies the old password and sets a new one.
     * Equivalent to DoctorChangePassword → checkOldPassword + changePassword.
     */
    @PutMapping("/{id}/change-password")
    public ResponseEntity<ApiResponse> changePassword(
            @PathVariable int id,
            @RequestBody ChangePasswordRequest changePasswordRequest) {

        if (doctorDAO.checkOldPassword(id, changePasswordRequest.getOldPassword())) {
            if (doctorDAO.changePassword(id, changePasswordRequest.getNewPassword())) {
                return ResponseEntity.ok(new ApiResponse(true, "Password change successfully."));
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(new ApiResponse(false, "Something went wrong on server!"));
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, "Old Password not match"));
        }
    }

    /**
     * GET /api/doctors/{id}/dashboard
     *
     * Returns dashboard metrics for a doctor.
     * Original: DoctorDAO.countTotalDoctor + countTotalAppointmentByDoctorId,
     * used by doctor/index.jsp.
     */
    @GetMapping("/{id}/dashboard")
    public ResponseEntity<ApiResponse> getDoctorDashboard(@PathVariable int id) {
        Map<String, Object> counts = new LinkedHashMap<>();
        counts.put("totalDoctors", doctorDAO.countTotalDoctor());
        counts.put("totalAppointments", doctorDAO.countTotalAppointmentByDoctorId(id));
        return ResponseEntity.ok(new ApiResponse(true, "Dashboard counts retrieved", counts));
    }

}
