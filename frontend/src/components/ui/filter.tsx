import React, { useState } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './select';
import { Input } from './input';

interface FilterProps {
  categories: string[];
  onFilterChange: (selectedCategory: string) => void;
  onSearchChange: (query: string) => void;
}

const Filters: React.FC<FilterProps> = ({ categories, onFilterChange, onSearchChange }) => {
  const [categoryValue, setCategoryValue] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleCategoryChange = (value: string) => {
    setCategoryValue(value);
    onFilterChange(value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearchChange(query);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 p-4 space-y-4 sm:space-y-0">
      {/* Category Filter */}
      <Select onValueChange={handleCategoryChange} value={categoryValue} >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Categories</SelectLabel>
            <SelectItem value="all">All</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* Search Input */}
      <Input
        type="text"
        className="p-2 rounded-md border border-gray-300 w-full sm:w-[250px]"
        placeholder="Search products"
        value={searchQuery}
        onChange={handleSearchChange}
      />
    </div>
  );
};

export default Filters;
