/**
 * Thin wrappers around `localStorage` and `sessionStorage` with JSON
 * (de)serialisation and safe fallbacks for environments where storage is
 * unavailable (e.g. SSR, private mode).
 */

export const safeParse = <T>(value: string | null): T | null => {
  if (value === null) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

export const safeStringify = (value: unknown): string => {
  try {
    return JSON.stringify(value);
  } catch {
    return '';
  }
};

/* ---------- localStorage ---------- */
export const localStorage = {
  get<T>(key: string): T | null {
    try {
      return safeParse<T>(globalThis.localStorage.getItem(key));
    } catch {
      return null;
    }
  },
  set<T>(key: string, value: T): void {
    try {
      globalThis.localStorage.setItem(key, safeStringify(value));
    } catch {
      /* storage quota exceeded or disabled — ignore silently */
    }
  },
  remove(key: string): void {
    try {
      globalThis.localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  },
  clear(): void {
    try {
      globalThis.localStorage.clear();
    } catch {
      /* ignore */
    }
  },
};

/* ---------- sessionStorage ---------- */
export const sessionStorage = {
  get<T>(key: string): T | null {
    try {
      return safeParse<T>(globalThis.sessionStorage.getItem(key));
    } catch {
      return null;
    }
  },
  set<T>(key: string, value: T): void {
    try {
      globalThis.sessionStorage.setItem(key, safeStringify(value));
    } catch {
      /* ignore */
    }
  },
  remove(key: string): void {
    try {
      globalThis.sessionStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  },
  clear(): void {
    try {
      globalThis.sessionStorage.clear();
    } catch {
      /* ignore */
    }
  },
};
