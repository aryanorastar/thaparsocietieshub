export type Theme = 'dark' | 'light';

export const setTheme = (theme: Theme) => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  localStorage.setItem('theme', theme);
};

export const getTheme = (): Theme => {
  const theme = localStorage.getItem('theme') as Theme;
  if (theme) return theme;
  
  // Check system preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};