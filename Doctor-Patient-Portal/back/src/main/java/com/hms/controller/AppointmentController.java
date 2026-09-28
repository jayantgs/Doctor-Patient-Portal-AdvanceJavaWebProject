package com.hms.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hms.dao.AppointmentDAO;
import com.hms.db.DBConnection;
import com.hms.dto.ApiResponse;
import com.hms.dto.StatusUpdateRequest;
import com.hms.entity.Appointment;

/**
 * REST controller for appointment operations.
 *
 * Maps to the original user.servlet.AppointmentServlet and
 * doctor.servlet.UpdateStatus:
 *   - AppointmentServlet  → POST /addAppointment
 *   - UpdateStatus        → POST /updateStatus
 *
 * Also exposes read-only data endpoints originally served by JSP scriptlets:
 *   - AppointmentDAO.getAllAppointmentByLoginUser(userId)    (view_appointment.jsp)
 *   - AppointmentDAO.getAllAppointmentByLoginDoctor(doctorId) (doctor/patient.jsp)
 *   - AppointmentDAO.getAppointmentById(id)                   (doctor/comment.jsp)
 *   - AppointmentDAO.getAllAppointment()                      (admin/patient.jsp)
 */
@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentDAO appointmentDAO = new AppointmentDAO(DBConnection.getConn());

    /**
     * POST /api/appointments
     *
     * Creates a new appointment with status hard-coded to "Pending".
     * Equivalent to AppointmentServlet → addAppointment(appointment).
     * The client should NOT send a status; the server sets "Pending"
     * (preserving the original business rule).
     */
    @PostMapping
    public ResponseEntity<ApiResponse> addAppointment(@RequestBody Appointment appointment) {
        appointment.setStatus("Pending");
        boolean f = appointmentDAO.addAppointment(appointment);
        if (f) {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(true, "Appointment is recorded Successfully.", appointment));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, "Something went wrong on server!"));
        }
    }

    /**
     * GET /api/appointments/all
     *
     * Returns all appointments (admin panel).
     * Original: AppointmentDAO.getAllAppointment(), used by admin/patient.jsp.
     */
    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAllAppointments() {
        return ResponseEntity.ok(
                new ApiResponse(true, "Appointments retrieved", appointmentDAO.getAllAppointment()));
    }

    /**
     * GET /api/appointments/user/{userId}
     *
     * Returns all appointments for a specific logged-in user.
     * Original: AppointmentDAO.getAllAppointmentByLoginUser(userId),
     * used by view_appointment.jsp.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse> getAppointmentsByUser(@PathVariable int userId) {
        return ResponseEntity.ok(new ApiResponse(true, "Appointments retrieved",
                appointmentDAO.getAllAppointmentByLoginUser(userId)));
    }

    /**
     * GET /api/appointments/doctor/{doctorId}
     *
     * Returns all appointments for a specific doctor.
     * Original: AppointmentDAO.getAllAppointmentByLoginDoctor(doctorId),
     * used by doctor/patient.jsp.
     * (Also exposed in DoctorController; kept here for logical grouping.)
     */
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<ApiResponse> getAppointmentsByDoctor(@PathVariable int doctorId) {
        return ResponseEntity.ok(new ApiResponse(true, "Appointments retrieved",
                appointmentDAO.getAllAppointmentByLoginDoctor(doctorId)));
    }

    /**
     * GET /api/appointments/{id}
     *
     * Returns a single appointment by id.
     * Original: AppointmentDAO.getAppointmentById(id), used by doctor/comment.jsp
     * to pre-fill the comment form (read-only).
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getAppointmentById(@PathVariable int id) {
        Appointment appointment = appointmentDAO.getAppointmentById(id);
        if (appointment != null) {
            return ResponseEntity.ok(new ApiResponse(true, "Appointment retrieved", appointment));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, "Appointment not found with id: " + id));
        }
    }

    /**
     * PUT /api/appointments/{id}/status
     *
     * Updates the appointment status with the doctor's comment / prescription.
     * Equivalent to UpdateStatus servlet → updateDrAppointmentCommentStatus(id, doctorId, comment).
     * In the original, the status column is overwritten in place:
     * "Pending" sentinel → free-text doctor comment.
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse> updateStatus(@PathVariable int id, @RequestBody StatusUpdateRequest request) {
        boolean f = appointmentDAO.updateDrAppointmentCommentStatus(id, request.getDoctorId(), request.getComment());
        if (f) {
            return ResponseEntity.ok(new ApiResponse(true, "Comment updated"));
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Something went wrong on server!"));
        }
    }

}
