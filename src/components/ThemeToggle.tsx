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
      className="p-8 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors min-w-[120px] min-h-[120px] flex items-center justify-center"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{ width: '120px', height: '120px' }}
    >
      <FontAwesomeIcon
        icon={isDark ? faSun : faMoon}
        className="text-gray-600 dark:text-gray-300 transition-transform hover:scale-110"
        style={{ width: '40px', height: '40px' }}
      />
    </button>
  );
};
