/**
 * Doctor entity.
 *
 * Mirrors `com.hms.entity.Doctor` ↔ `doctor` table.
 * `specialist` stores the specialist *name* (denormalised string), not a FK id.
 *
 * @see back/src/main/java/com/hms/entity/Doctor.java
 */
export interface Doctor {
  id: number;
  fullName: string;
  dateOfBirth: string;
  qualification: string;
  specialist: string;
  email: string;
  phone: string;
  password?: string;
}

/**
 * Payload to create or update a doctor (POST /api/admin/doctors, PUT /api/admin/doctors/{id}).
 */
export interface DoctorPayload {
  fullName: string;
  dateOfBirth: string;
  qualification: string;
  specialist: string;
  email: string;
  phone: string;
  password: string;
}
