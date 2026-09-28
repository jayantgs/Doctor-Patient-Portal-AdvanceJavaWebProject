/**
 * Appointment entity.
 *
 * Mirrors `com.hms.entity.Appointment` ↔ `appointment` table.
 *
 * Business rule: `status` is overloaded — "Pending" is the sentinel value set
 * by the server on creation; a doctor's free-text comment/prescription is
 * written back into the same column via PUT /api/appointments/{id}/status.
 *
 * @see back/src/main/java/com/hms/entity/Appointment.java
 */
export interface Appointment {
  id: number;
  userId: number;
  fullName: string;
  gender: string;
  age: string;
  appointmentDate: string;
  email: string;
  phone: string;
  diseases: string;
  doctorId: number;
  address: string;
  status: string;
}

/**
 * Status sent to PUT /api/appointments/{id}/status.
 * In the original servlet, `id` was a path param and `doctorId`/`comment` were
 * form fields. In the REST layer they are grouped here.
 */
export interface StatusUpdatePayload {
  doctorId: number;
  comment: string;
}
