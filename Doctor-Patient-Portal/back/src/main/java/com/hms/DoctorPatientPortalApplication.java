package com.hms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.hms")
public class DoctorPatientPortalApplication {

    public static void main(String[] args) {
        SpringApplication.run(DoctorPatientPortalApplication.class, args);
    }

}
