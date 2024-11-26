
import React from 'react';
import { useLocalStorage } from 'react-use';
import { MoonIcon, SunIcon } from 'lucide-react';

const DarkModeToggle: React.FC = () => {
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
      aria-label="Toggle Dark Mode"
    >
      {theme === 'dark' ? (
        <SunIcon className="h-4 w-4 text-yellow-500" />
      ) : (
        <MoonIcon className="h-4 w-4 text-gray-800" />
      )}
    </button>
  );
};

export default DarkModeToggle;
