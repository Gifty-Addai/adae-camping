// src/components/SearchBar.tsx

import React from 'react';
import { useTranslation } from 'react-i18next';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = React.useState('');
  const { t } = useTranslation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="relative mb-6">
      <input
        type="text"
        className="w-full px-4 py-2 border rounded-md"
        placeholder={t('Search products...')}
        value={query}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default SearchBar;
