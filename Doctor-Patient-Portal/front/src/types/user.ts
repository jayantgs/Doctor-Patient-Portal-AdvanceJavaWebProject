/**
 * User (patient) entity.
 *
 * Mirrors `com.hms.entity.User` ↔ `user_details` table.
 * @see back/src/main/java/com/hms/entity/User.java
 */
export interface User {
  id: number;
  fullName: string;
  email: string;
  password?: string;
}

/**
 * Registration payload (POST /api/users/register).
 * Password is optional on the response (stripped by backend).
 */
export interface UserRegisterPayload {
  fullName: string;
  email: string;
  password: string;
}
