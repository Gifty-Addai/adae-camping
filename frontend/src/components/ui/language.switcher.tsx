// src/components/LanguageSwitcher.tsx

import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <select
      onChange={(e) => changeLanguage(e.target.value)}
      value={i18n.language}
      className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 p-2 rounded"
      aria-label="Language Switcher"
    >
      <option value="en">English</option>
      <option value="es">Español</option>
      {/* Add more languages if needed */}
    </select>
  );
};

export default LanguageSwitcher;
