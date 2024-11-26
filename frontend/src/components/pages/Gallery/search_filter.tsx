// src/components/Gallery/SearchFilter.tsx

import React, { useState } from 'react';

const SearchFilter: React.FC = () => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    console.log(`Search query: ${query}`); // Replace with actual filtering logic
  };

  return (
    <div className="flex justify-center my-6">
      <input
        type="text"
        placeholder="Search for images or videos..."
        className="px-4 py-2 w-full max-w-md border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={query}
        onChange={handleSearch}
      />
    </div>
  );
};

export default SearchFilter;
