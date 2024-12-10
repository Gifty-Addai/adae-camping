import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './select';
import { Input } from './input';
import { Button } from './button';
import { Product } from '@/core/interfaces';

interface FilterProps {
  categories: Product[];
  onFilterChange: (selectedCategory: string) => void;
  onSearchChange: (query: string) => void;
  categoryValue: string;
  searchQuery: string;
  onSearch: () => void;
}

const Filters: React.FC<FilterProps> = ({ onFilterChange, onSearchChange, categoryValue, searchQuery, onSearch }) => {

  const handleCategoryChange = (value: string) => {
    if (value === 'all') {
      onFilterChange('');
    } else {
      onFilterChange(value);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
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
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="accessories">Outdoor accessories</SelectItem>
            <SelectItem value="camping light">Camping Lights</SelectItem>
            <SelectItem value="cookwear">Cookwears</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* Search Input */}
      <div className="flex items-center space-x-2 w-full sm:w-[250px]">
        <Input
          type="text"
          className="p-2 rounded-md border border-gray-300 w-full"
          placeholder="Search products"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <Button onClick={onSearch} className="p-2 bg-yellow-400 text-black rounded-md">
          Search
        </Button>
      </div>
    </div>
  );
};

export default Filters;
