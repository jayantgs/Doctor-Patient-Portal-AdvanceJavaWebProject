/**
 * Specialist entity.
 *
 * Mirrors `com.hms.entity.Specialist` ↔ `specialist` table.
 * Used to classify doctors; populates the "Add Doctor" dropdown.
 *
 * @see back/src/main/java/com/hms/entity/Specialist.java
 */
export interface Specialist {
  id: number;
  specialistName: string;
}
