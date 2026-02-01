
import React from 'react';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder }) => {
  const [query, setQuery] = React.useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="relative mb-6">
      <input
        type="text"
        className="w-full px-4 py-2 border border-[#4d4d4d] rounded-md bg-[#353535] text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8b7355]"
        placeholder={placeholder || "Search ..."}
        value={query}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default SearchBar;
