package com.hms.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hms.dao.DoctorDAO;
import com.hms.dao.SpecialistDAO;
import com.hms.db.DBConnection;
import com.hms.dto.ApiResponse;
import com.hms.entity.Specialist;

/**
 * REST controller for specialist category operations.
 *
 * Maps to the original admin.servlet package:
 *   - SpecialistServlet → POST /addSpecialist
 *
 * Also exposes the read-only specialist list originally served by
 * JSP scriptlets (admin/doctor.jsp, doctor/edit_profile.jsp).
 */
@RestController
@RequestMapping("/api/specialists")
public class SpecialistController {

    private final SpecialistDAO specialistDAO = new SpecialistDAO(DBConnection.getConn());

    /**
     * POST /api/specialists
     *
     * Adds a new specialist category.
     * Equivalent to SpecialistServlet → addSpecialist(specialistName).
     */
    @PostMapping
    public ResponseEntity<ApiResponse> addSpecialist(@RequestBody Specialist specialist) {
        boolean f = specialistDAO.addSpecialist(specialist.getSpecialistName());
        if (f) {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(true, "Specialist added Successfully.", specialist));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, "Something went wrong on server"));
        }
    }

    /**
     * GET /api/specialists
     *
     * Returns all specialist categories.
     * Original: SpecialistDAO.getAllSpecialist(), used by admin/doctor.jsp
     * and admin/edit_doctor.jsp to populate the specialist dropdown.
     */
    @GetMapping
    public ResponseEntity<ApiResponse> getAllSpecialists() {
        return ResponseEntity.ok(
                new ApiResponse(true, "Specialists retrieved", specialistDAO.getAllSpecialist()));
    }

}
