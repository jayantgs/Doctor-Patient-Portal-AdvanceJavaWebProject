package com.hms.dto;

/**
 * Generic API response wrapper used by all REST controllers.
 * Mirrors the original flash-message pattern (successMsg / errorMsg)
 * but exposes it as structured JSON.
 */
public class ApiResponse {

    private boolean status;
    private String message;
    private Object data;

    public ApiResponse() {
    }

    public ApiResponse(boolean status, String message) {
        this.status = status;
        this.message = message;
    }

    public ApiResponse(boolean status, String message, Object data) {
        this.status = status;
        this.message = message;
        this.data = data;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    @Override
    public String toString() {
        return "ApiResponse [status=" + status + ", message=" + message + ", data=" + data + "]";
    }

}
