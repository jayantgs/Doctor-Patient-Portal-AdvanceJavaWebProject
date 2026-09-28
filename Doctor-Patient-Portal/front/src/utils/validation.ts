/**
 * Form validation utilities.
 *
 * The original application relied on HTML5 validation only (see architecture.md §4.2).
 * These helpers provide the client-side validation layer that the frontend SPA
 * will use before sending data to the REST endpoints.
 */

export interface ValidationRule {
  /** Field name (for error messages). */
  field: string;
  /** Human-readable label used in error messages. */
  label?: string;
  /** The value to validate. */
  value: unknown;
  /** Whether the field is required. */
  required?: boolean;
  /** Minimum length (for strings). */
  minLength?: number;
  /** Maximum length (for strings). */
  maxLength?: number;
  /** Regex pattern the value must match. */
  pattern?: RegExp;
  /** Custom validator returning an error message, or undefined when valid. */
  custom?: (value: unknown) => string | undefined;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validate a set of fields against rules and return collected errors.
 */
export const validateForm = (rules: ValidationRule[]): ValidationResult => {
  const errors: Record<string, string> = {};

  for (const rule of rules) {
    const { field, label = field, value } = rule;
    const strValue = typeof value === 'string' ? value.trim() : value;

    if (rule.required && (strValue === '' || strValue === undefined || strValue === null)) {
      errors[field] = `${label} is required`;
      continue;
    }

    // Skip further checks if the field is optional and empty.
    if (strValue === '' || strValue === undefined || strValue === null) {
      continue;
    }

    if (typeof strValue === 'string') {
      if (rule.minLength !== undefined && strValue.length < rule.minLength) {
        errors[field] = `${label} must be at least ${rule.minLength} characters`;
        continue;
      }
      if (rule.maxLength !== undefined && strValue.length > rule.maxLength) {
        errors[field] = `${label} must be at most ${rule.maxLength} characters`;
        continue;
      }
    }

    if (rule.pattern && typeof strValue === 'string' && !rule.pattern.test(strValue)) {
      errors[field] = `${label} has an invalid format`;
      continue;
    }

    if (rule.custom) {
      const customError = rule.custom(value);
      if (customError) {
        errors[field] = customError;
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/* ---------- Common patterns ---------- */
export const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\d{10,11}$/,
  AGE: /^(0|[1-9]\d{0,2})$/,
  DATE: /^\d{4}-\d{2}-\d{2}$/,
} as const;

/* ---------- Pre-defined validators for domain fields ---------- */
export const validateEmail = (email: string): string | undefined => {
  if (!email) return 'Email is required';
  if (!PATTERNS.EMAIL.test(email.trim())) return 'Please enter a valid email address';
  return undefined;
};

export const validatePassword = (password: string): string | undefined => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return undefined;
};

export const validatePhone = (phone: string): string | undefined => {
  if (!phone) return 'Phone is required';
  if (!PATTERNS.PHONE.test(phone.trim())) return 'Phone must be 10-11 digits';
  return undefined;
};

export const validateAge = (age: string): string | undefined => {
  if (!age) return 'Age is required';
  if (!PATTERNS.AGE.test(age.trim())) return 'Please enter a valid age';
  return undefined;
};
