package com.hms.controller;

import javax.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hms.dao.UserDAO;
import com.hms.db.DBConnection;
import com.hms.dto.ApiResponse;
import com.hms.dto.ChangePasswordRequest;
import com.hms.dto.LoginRequest;
import com.hms.entity.User;

/**
 * REST controller for user (patient) self-service operations.
 *
 * Maps to the original user.servlet package:
 *   - UserRegisterServlet  → POST /user_register
 *   - UserLoginServlet     → POST /userLogin
 *   - UserLogoutServlet    → GET  /userLogout
 *   - ChangePasswordServlet → POST /userChangePassword
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserDAO userDAO = new UserDAO(DBConnection.getConn());

    /**
     * POST /api/users/register
     *
     * Registers a new user (patient).
     * Equivalent to UserRegisterServlet → userDAO.userRegister(User).
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse> registerUser(@RequestBody User user) {
        boolean f = userDAO.userRegister(user);
        if (f) {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(true, "Register Successfully", user));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, "Something went wrong!"));
        }
    }

    /**
     * POST /api/users/login
     *
     * Authenticates a user by email and password.
     * Equivalent to UserLoginServlet → userDAO.loginUser(email, password).
     * On success the user object is stored in the HTTP session as "userObj".
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse> loginUser(@RequestBody LoginRequest loginRequest, HttpSession session) {
        User user = userDAO.loginUser(loginRequest.getEmail(), loginRequest.getPassword());
        if (user != null) {
            session.setAttribute("userObj", user);
            return ResponseEntity.ok(new ApiResponse(true, "Login successful", user));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse(false, "Invalid email or password"));
        }
    }

    /**
     * POST /api/users/logout
     *
     * Removes the "userObj" session attribute.
     * Equivalent to UserLogoutServlet.
     */
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse> logoutUser(HttpSession session) {
        session.removeAttribute("userObj");
        session.setAttribute("successMsg", "User Logout Successfully.");
        return ResponseEntity.ok(new ApiResponse(true, "User Logout Successfully."));
    }

    /**
     * PUT /api/users/{userId}/change-password
     *
     * Verifies the old password and sets a new one.
     * Equivalent to ChangePasswordServlet → checkOldPassword + changePassword.
     */
    @PutMapping("/{userId}/change-password")
    public ResponseEntity<ApiResponse> changePassword(
            @PathVariable int userId,
            @RequestBody ChangePasswordRequest changePasswordRequest) {

        if (userDAO.checkOldPassword(userId, changePasswordRequest.getOldPassword())) {
            if (userDAO.changePassword(userId, changePasswordRequest.getNewPassword())) {
                return ResponseEntity.ok(new ApiResponse(true, "Password Change Successfully."));
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(new ApiResponse(false, "Something wrong on server!"));
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, "Old password incorrect"));
        }
    }

}
