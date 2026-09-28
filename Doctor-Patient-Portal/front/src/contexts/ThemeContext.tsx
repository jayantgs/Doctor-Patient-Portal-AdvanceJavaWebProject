/**
 * Theme context — manages the active palette mode (system / light / dark).
 *
 * Wraps the app in `main.tsx` via `ThemeProvider` and exposes a `toggleTheme`
 * callback so any component can cycle through the three modes.
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { ThemeProvider as MuiThemeProvider, type PaletteMode } from '@mui/material';
import { CssBaseline } from '@mui/material';
import {
  type ThemeMode,
  getTheme,
  getStoredThemeMode,
  saveThemeMode,
  resolveThemeMode,
  watchSystemTheme,
} from '../theme/theme';

interface ThemeContextValue {
  /** Current preference ("system" | "light" | "dark"). */
  mode: ThemeMode;
  /** Resolved palette ("light" | "dark"). */
  paletteMode: PaletteMode;
  /** Cycle through system → light → dark → system … */
  toggleTheme: () => void;
  /** Set a specific mode. */
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/** Hook to access theme controls from any component. */
export const useThemeContext = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return ctx;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(getStoredThemeMode);
  const [paletteMode, setPaletteMode] = useState<PaletteMode>(() => resolveThemeMode(mode));

  // Persist preference and re-resolve the palette whenever mode changes.
  useEffect(() => {
    saveThemeMode(mode);
    setPaletteMode(resolveThemeMode(mode));
  }, [mode]);

  // When mode is "system", listen for OS-level changes.
  useEffect(() => {
    const cleanup = watchSystemTheme(mode, setPaletteMode);
    return cleanup;
  }, [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === 'system' ? 'light' : prev === 'light' ? 'dark' : 'system'));
  };

  const theme = useMemo(() => getTheme(paletteMode), [paletteMode]);

  return (
    <ThemeContext.Provider value={{ mode, paletteMode, toggleTheme, setMode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
