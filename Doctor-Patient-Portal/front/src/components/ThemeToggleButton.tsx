import { IconButton, type IconButtonProps } from '@mui/material';
import { Brightness4, Brightness7, Monitor } from '@mui/icons-material';
import { useThemeContext } from '../contexts/ThemeContext';
import type { ThemeMode } from '../theme/theme';

/**
 * Cycle button for the three theme modes: system → light → dark → system …
 *
 * Shows a different icon depending on the current mode so the user gets
 * immediate visual feedback.
 */
export const ThemeToggleButton: React.FC<IconButtonProps> = (props) => {
  const { mode, toggleTheme } = useThemeContext();

  const icon =
    mode === 'system' ? <Monitor /> : mode === 'light' ? <Brightness7 /> : <Brightness4 />;

  const label: Record<ThemeMode, string> = {
    system: 'Switch to light theme',
    light: 'Switch to dark theme',
    dark: 'Switch to system theme',
  };

  return (
    <IconButton
      aria-label={label[mode]}
      title={label[mode]}
      onClick={toggleTheme}
      size="small"
      {...props}
    >
      {icon}
    </IconButton>
  );
};
