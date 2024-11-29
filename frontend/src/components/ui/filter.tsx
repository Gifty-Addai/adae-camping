import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './select';
import { Input } from './input';
import { Product } from '@/core/interfaces';

interface FilterProps {
  categories: Product[];
  onFilterChange: (selectedCategory: string) => void;
  onSearchChange: (query: string) => void;
  categoryValue: string;   // Category value passed as prop
  searchQuery: string;     // Search query passed as prop
}

const Filters: React.FC<FilterProps> = ({ onFilterChange, onSearchChange, categoryValue, searchQuery }) => {

  // Handle category change
  const handleCategoryChange = (value: string) => {
    if (value === 'all') {
      onFilterChange('');  // Pass empty string to fetch all products when 'all' is selected
    } else {
      onFilterChange(value);  // Apply the selected category filter
    }
  };

  // Handle search change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    onSearchChange(query);  // Pass the search query to the parent component
  };

  // Reset filters function
  const resetFilters = () => {
    onFilterChange(''); // Reset category filter to all
    onSearchChange(''); // Clear the search input
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 p-4 space-y-4 sm:space-y-0">
      {/* Category Filter */}
      <Select onValueChange={handleCategoryChange} value={categoryValue}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Categories</SelectLabel>
            <SelectItem value="all">All</SelectItem>  {/* 'all' as a value */}
            <SelectItem value="camping">Camping Gears</SelectItem>
            <SelectItem value="others">Other</SelectItem>
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

      {/* Reset Button */}
      <button 
        className="mt-4 sm:mt-0 p-2 bg-gray-200 text-sm font-semibold text-gray-700 rounded-md hover:bg-gray-300"
        onClick={resetFilters}>
        Reset Filters
      </button>
    </div>
  );
};

export default Filters;
