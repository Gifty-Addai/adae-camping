
import React from 'react';

interface SearchBarProps {
  placeholder?:string;
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch,placeholder }) => {
  const [query, setQuery] = React.useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="relative mb-6">
      <input
        type="text"
        className="w-full px-4 py-2 border rounded-md"
        placeholder={placeholder || "Search ..."}
        value={query}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default SearchBar;
