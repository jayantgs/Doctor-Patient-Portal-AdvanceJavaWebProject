/**
 * Generic API response wrapper.
 *
 * Mirrors the backend `ApiResponse` DTO (com.hms.dto.ApiResponse) which all
 * Spring Boot REST controllers return. The `data` field is polymorphic
 * (Object on the Java side) so on the frontend we type it generically.
 *
 * @see back/src/main/java/com/hms/dto/ApiResponse.java
 */
export interface ApiResponse<T = unknown> {
  /** Always `true` for a successful HTTP 200; `false` for business-level errors. */
  status: boolean;
  /** Human-readable message, e.g. "Login successful" or "Something went wrong!". */
  message: string;
  /** Payload — type varies by endpoint (single entity, list, or counts map). */
  data: T;
}

/**
 * Dashboard counts map returned by:
 *   - GET /api/admin/dashboard
 *   - GET /api/doctors/{id}/dashboard
 */
export interface DashboardCounts {
  totalDoctors: number;
  totalUsers?: number;
  totalAppointments: number;
  totalSpecialists?: number;
}
