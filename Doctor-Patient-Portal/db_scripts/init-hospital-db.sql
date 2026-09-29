CREATE DATABASE IF NOT EXISTS hospital;
USE hospital;

CREATE TABLE IF NOT EXISTS user_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100),
    email VARCHAR(100),
    password VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS specialist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    specialist_name VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS doctor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullName VARCHAR(100),
    dateOfBirth VARCHAR(100),
    qualification VARCHAR(100),
    specialist VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    password VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS appointment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    fullName VARCHAR(100),
    gender VARCHAR(20),
    age VARCHAR(10),
    appointmentDate VARCHAR(50),
    email VARCHAR(100),
    phone VARCHAR(20),
    diseases VARCHAR(500),
    doctorId INT,
    address VARCHAR(500),
    status VARCHAR(500)
);
