-- ============================================================
-- Sample data for the Doctor-Patient Portal
-- Database: hospital
-- Run against the MySQL container to seed initial records
-- ============================================================

USE hospital;

-- ----------------------------------------------------------
-- Specialists (medical speciality categories)
-- ----------------------------------------------------------
INSERT INTO specialist (specialist_name) VALUES
    ('Cardiology'),
    ('Neurology'),
    ('Orthopedics'),
    ('Pediatrics'),
    ('Dermatology'),
    ('General Medicine');

-- ----------------------------------------------------------
-- Doctors (clinicians belonging to a specialist category)
-- ----------------------------------------------------------
INSERT INTO doctor (fullName, dateOfBirth, qualification, specialist, email, phone, password) VALUES
    ('Dr. John Smith', '1980-05-15', 'MBBS, MD', 'Cardiology', 'john.smith@hospital.com', '555-0101', 'doctor123'),
    ('Dr. Sarah Johnson', '1985-11-30', 'MBBS, DM', 'Neurology', 'sarah.johnson@hospital.com', '555-0102', 'doctor123'),
    ('Dr. Raj Patel', '1990-03-22', 'MBBS, MS', 'Orthopedics', 'raj.patel@hospital.com', '555-0103', 'doctor123'),
    ('Dr. Emily Brown', '1988-09-10', 'MBBS, MD', 'Pediatrics', 'emily.brown@hospital.com', '555-0104', 'doctor123'),
    ('Dr. David Lee', '1975-07-18', 'MBBS, MD', 'Dermatology', 'david.lee@hospital.com', '555-0105', 'doctor123'),
    ('Dr. Priya Sharma', '1992-12-05', 'MBBS', 'General Medicine', 'priya.sharma@hospital.com', '555-0106', 'doctor123');

-- ----------------------------------------------------------
-- Users (patients who self-register)
-- ----------------------------------------------------------
INSERT INTO user_details (full_name, email, password) VALUES
    ('Alice Williams', 'alice.williams@email.com', 'password123'),
    ('Bob Brown', 'bob.brown@email.com', 'password123'),
    ('Charlie Davis', 'charlie.davis@email.com', 'password123'),
    ('Diana Miller', 'diana.miller@email.com', 'password123'),
    ('Eve Wilson', 'eve.wilson@email.com', 'password123');

-- ----------------------------------------------------------
-- Appointments
--   - First 3 are "Pending" (no doctor comment yet)
--   - Last 2 have doctor comments (status overwritten)
-- ----------------------------------------------------------
INSERT INTO appointment (userId, fullName, gender, age, appointmentDate, email, phone, diseases, doctorId, address, status) VALUES
    (1, 'Alice Williams', 'female', '30', '2025-10-15', 'alice.williams@email.com', '555-1001', 'Chest pain', 1, '123 Maple Street', 'Pending'),
    (1, 'Alice Williams', 'female', '30', '2025-10-20', 'alice.williams@email.com', '555-1001', 'Routine checkup', 1, '123 Maple Street', 'Blood pressure normal. Prescribed omega-3 supplements. Follow up in 3 months.'),
    (2, 'Bob Brown', 'male', '45', '2025-10-16', 'bob.brown@email.com', '555-1002', 'Headache', 2, '456 Oak Avenue', 'Pending'),
    (3, 'Charlie Davis', 'male', '28', '2025-10-17', 'charlie.davis@email.com', '555-1003', 'Back pain', 3, '789 Pine Road', 'Pending'),
    (4, 'Diana Miller', 'female', '52', '2025-10-14', 'diana.miller@email.com', '555-1004', 'Joint pain', 3, '321 Elm Street', 'MRI recommended. Refer to physiotherapy. Avoid heavy lifting for 2 weeks.');
