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

import com.hms.dao.DoctorDAO;
import com.hms.db.DBConnection;
import com.hms.dto.ApiResponse;
import com.hms.dto.LoginRequest;
import com.hms.entity.Doctor;
import com.hms.entity.User;

/**
 * REST controller for admin console operations.
 *
 * Maps to the original admin.servlet package:
 *   - AdminLoginServlet    → POST /adminLogin
 *   - AdminLogoutServlet   → GET  /adminLogout
 *   - DoctorServlet        → POST /addDoctor       (create a doctor)
 *   - UpdateDoctorServlet  → POST /updateDoctor     (update a doctor, including password)
 *   - DeleteDoctorServlet  → GET  /deleteDoctor     (delete a doctor)
 *   - SpecialistServlet    → POST /addSpecialist    (create a specialist)
 *
 * Also exposes admin dashboard counts originally served by scriptlets
 * in admin/index.jsp (DoctorDAO + UserDAO + SpecialistDAO count helpers).
 */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final DoctorDAO doctorDAO = new DoctorDAO(DBConnection.getConn());

    /**
     * POST /api/admin/login
     *
     * Admin login using the hardcoded credential pair admin@gmail.com / admin.
     * Equivalent to AdminLoginServlet → sets session "adminObj" to a new User().
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse> loginAdmin(@RequestBody LoginRequest loginRequest, HttpSession session) {
        if ("admin@gmail.com".equals(loginRequest.getEmail()) && "admin".equals(loginRequest.getPassword())) {
            session.setAttribute("adminObj", new User());
            return ResponseEntity.ok(new ApiResponse(true, "Login successful"));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse(false, "Invalid Username or Password."));
        }
    }

    /**
     * POST /api/admin/logout
     *
     * Removes the "adminObj" session attribute.
     * Equivalent to AdminLogoutServlet.
     */
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse> logoutAdmin(HttpSession session) {
        session.removeAttribute("adminObj");
        session.setAttribute("successMsg", "Admin Logout Successfully");
        return ResponseEntity.ok(new ApiResponse(true, "Admin Logout Successfully."));
    }

    /**
     * GET /api/admin/dashboard
     *
     * Returns dashboard counts (doctors, users, appointments, specialists).
     * Original: DoctorDAO.countTotalDoctor, countTotalUser, countTotalAppointment,
     * countTotalSpecialist — used by admin/index.jsp.
     */
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse> getDashboardCounts() {
        Map<String, Object> counts = new LinkedHashMap<>();
        counts.put("totalDoctors", doctorDAO.countTotalDoctor());
        counts.put("totalUsers", doctorDAO.countTotalUser());
        counts.put("totalAppointments", doctorDAO.countTotalAppointment());
        counts.put("totalSpecialists", doctorDAO.countTotalSpecialist());
        return ResponseEntity.ok(new ApiResponse(true, "Dashboard counts retrieved", counts));
    }

    /**
     * POST /api/admin/doctors
     *
     * Registers a new doctor.
     * Equivalent to DoctorServlet → registerDoctor(doctor).
     */
    @PostMapping("/doctors")
    public ResponseEntity<ApiResponse> addDoctor(@RequestBody Doctor doctor) {
        boolean f = doctorDAO.registerDoctor(doctor);
        if (f) {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(true, "Doctor added Successfully", doctor));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, "Something went wrong on server!"));
        }
    }

    /**
     * PUT /api/admin/doctors/{id}
     *
     * Updates an existing doctor (including password).
     * Equivalent to UpdateDoctorServlet → updateDoctor(doctor).
     */
    @PutMapping("/doctors/{id}")
    public ResponseEntity<ApiResponse> updateDoctor(@PathVariable int id, @RequestBody Doctor doctor) {
        doctor.setId(id);
        boolean f = doctorDAO.updateDoctor(doctor);
        if (f) {
            return ResponseEntity.ok(new ApiResponse(true, "Doctor update Successfully"));
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Something went wrong on server!"));
        }
    }

    /**
     * DELETE /api/admin/doctors/{id}
     *
     * Deletes a doctor by id.
     * Equivalent to DeleteDoctorServlet → deleteDoctorById(id).
     */
    @DeleteMapping("/doctors/{id}")
    public ResponseEntity<ApiResponse> deleteDoctor(@PathVariable int id) {
        boolean f = doctorDAO.deleteDoctorById(id);
        if (f) {
            return ResponseEntity.ok(new ApiResponse(true, "Doctor Deleted Successfully."));
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Something went wrong on server!"));
        }
    }

}
