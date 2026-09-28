package com.hms.dto;

/**
 * Request body for the appointment status / comment update endpoint.
 * In the original UpdateStatus servlet, id and doctorId were passed as
 * request parameters and comment as a form field. In the REST version,
 * id is a path variable and doctorId + comment are sent in the body.
 */
public class StatusUpdateRequest {

    private int doctorId;
    private String comment;

    public StatusUpdateRequest() {
    }

    public StatusUpdateRequest(int doctorId, String comment) {
        this.doctorId = doctorId;
        this.comment = comment;
    }

    public int getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(int doctorId) {
        this.doctorId = doctorId;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    @Override
    public String toString() {
        return "StatusUpdateRequest [doctorId=" + doctorId + ", comment=" + comment + "]";
    }

}
