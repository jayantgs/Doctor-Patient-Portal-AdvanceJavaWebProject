/**
 * MUI theme configuration with three palette modes:
 *   - "system"  (default) — follows the OS-level `prefers-color-scheme`.
 *   - "light"   — always light.
 *   - "dark"    — always dark.
 *
 * The active mode is persisted to `localStorage` so the user's preference
 * survives page reloads.
 */

import { createTheme } from '@mui/material/styles';
import { blue, indigo, amber, grey, red } from '@mui/material/colors';
import type { ThemeOptions, PaletteMode } from '@mui/material';
import { STORAGE_KEYS } from './utils/constants';
import { localStorage as storage } from './utils/storage';

/* ---------- Palette definitions ---------- */
const lightPalette = {
  primary: { main: blue[700] },
  secondary: { main: indigo[600] },
  info: { main: blue[500] },
  warning: { main: amber[700] },
  error: { main: red[600] },
  background: {
    default: grey[50],
    paper: '#ffffff',
  },
  text: {
    primary: grey[900],
    secondary: grey[700],
  },
} as const;

const darkPalette = {
  primary: { main: blue[400] },
  secondary: { main: indigo[300] },
  info: { main: blue[300] },
  warning: { main: amber[400] },
  error: { main: red[400] },
  background: {
    default: '#0f1117',
    paper: '#1e2127',
  },
  text: {
    primary: grey[100],
    secondary: grey[400],
  },
} as const;

/**
 * Build an MUI theme for the given palette mode.
 */
export const getTheme = (mode: PaletteMode): ReturnType<typeof createTheme> => {
  const palette = mode === 'dark' ? darkPalette : lightPalette;

  const themeOptions: ThemeOptions = {
    palette: {
      mode,
      ...palette,
    },
    typography: {
      fontFamily: '"Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    shape: {
      roundness: 8,
    },
    components: {
      // Rounded buttons for a modern look.
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
      // Card elevation in dark mode can look heavy; use subtle shadows.
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            border: `1px solid ${mode === 'dark' ? '#333' : '#e0e0e0'}`,
          },
        },
      },
    },
  };

  return createTheme(themeOptions);
};

/* ---------- Theme preference persistence ---------- */

export type ThemeMode = 'system' | 'light' | 'dark';

const SYSTEM_MEDIA_QUERY = '(prefers-color-scheme: dark)';

/**
 * Resolve the effective MUI palette mode ("light" or "dark") from the stored
 * preference or the OS-level media query.
 */
export const resolveThemeMode = (stored: ThemeMode | null): PaletteMode => {
  if (stored === 'dark') return 'dark';
  if (stored === 'light') return 'light';
  // "system" or null → follow OS preference.
  return window.matchMedia(SYSTEM_MEDIA_QUERY).matches ? 'dark' : 'light';
};

/**
 * Persist a theme preference to localStorage.
 */
export const saveThemeMode = (mode: ThemeMode): void => {
  storage.set(STORAGE_KEYS.THEME_MODE, mode);
};

/** Read the stored theme preference (returns "system" when unset). */
export const getStoredThemeMode = (): ThemeMode => {
  return storage.get<ThemeMode>(STORAGE_KEYS.THEME_MODE) ?? 'system';
};

/**
 * Set up a listener that re-evaluates the palette whenever the OS-level
 * colour-scheme preference changes (only relevant when mode === "system").
 * Returns a cleanup function.
 */
export const watchSystemTheme = (
  mode: ThemeMode,
  onChange: (paletteMode: PaletteMode) => void,
): (() => void) => {
  if (mode !== 'system') return () => {};
  const mq = window.matchMedia(SYSTEM_MEDIA_QUERY);
  const handler = (e: MediaQueryListEvent) => onChange(e.matches ? 'dark' : 'light');
  mq.addEventListener('change', handler);
  onChange(mq.matches ? 'dark' : 'light');
  return () => mq.removeEventListener('change', handler);
};
