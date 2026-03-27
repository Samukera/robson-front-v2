export type ThemeName =
  | 'default'
  | 'modern-minimal'
  | 'poker-felt'
  | 'lagoon'
  | 'dark'
  | 'white';

export const THEME_STORAGE_KEY = 'robson:theme';

export function toTheme(theme: string): ThemeName {
  if (
    theme === 'default' ||
    theme === 'modern-minimal' ||
    theme === 'poker-felt' ||
    theme === 'lagoon' ||
    theme === 'dark' ||
    theme === 'white'
  ) {
    return theme;
  }

  return 'dark';
}

export function getThemeClass(theme: ThemeName): string {
  if (theme === 'modern-minimal') return 'theme-modern-minimal';
  if (theme === 'poker-felt') return 'theme-poker-felt';
  if (theme === 'lagoon') return 'theme-lagoon';
  if (theme === 'dark') return 'theme-dark';
  if (theme === 'white') return 'theme-white';
  return '';
}

export function toggleDarkWhiteTheme(theme: ThemeName): ThemeName {
  return theme === 'white' ? 'dark' : 'white';
}
