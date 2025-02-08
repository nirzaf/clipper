import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="p-4 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors min-w-[60px] min-h-[60px] flex items-center justify-center"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{ width: '60px', height: '60px' }}
    >
      <FontAwesomeIcon
        icon={isDark ? faSun : faMoon}
        className="text-gray-600 dark:text-gray-300 transition-transform hover:scale-110"
        style={{ width: '40px', height: '40px' }}
      />
    </button>
  );
};
