import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Theme, setTheme } from '../lib/theme';

interface ThemeToggleProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export function ThemeToggle({ currentTheme, onThemeChange }: ThemeToggleProps) {
  const toggleTheme = () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    onThemeChange(newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg transition-colors duration-200 hover:bg-opacity-20 hover:bg-brand-red"
    >
      {currentTheme === 'dark' ? (
        <Sun className="w-6 h-6 text-brand-gold" />
      ) : (
        <Moon className="w-6 h-6 text-brand-red" />
      )}
    </button>
  );
}