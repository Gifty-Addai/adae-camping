// src/components/trip.filter.tsx

import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TripSearchParams, TripType, DifficultyLevel } from '@/core/interfaces/index';

interface FilterProps {
  onApply: (params: TripSearchParams) => void;
  isMobile: boolean;
  onClose?: () => void;
}

const TripFilter: React.FC<FilterProps> = ({ onApply, isMobile, onClose }) => {
  const [filters, setFilters] = useState<TripSearchParams>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]:
        value === 'any'
          ? undefined
          : name === 'activityLevel' || name === 'page' || name === 'limit'
          ? Number(value)
          : value,
    }));
  };

  const handleApply = () => {
    console.info("filters",filters)
    onApply(filters);
    if (isMobile && onClose) {
      onClose();
    }
  };

  const handleReset = () => {
    setFilters({});
  };

  return (
    <div className="space-y-4">
      {/* Trip Type */}
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
          Type
        </label>
        <Select
          value={filters.type || 'any'}
          onValueChange={(value) =>
            setFilters((prev) => ({
              ...prev,
              type: value === 'any' ? undefined : (value as TripType),
            }))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Type</SelectLabel>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="hiking">Hiking</SelectItem>
              <SelectItem value="camping">Camping</SelectItem>
              <SelectItem value="mountaineering">Mountaineering</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Difficulty */}
      <div>
        <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
          Difficulty
        </label>
        <Select
          value={filters.difficulty || 'any'}
          onValueChange={(value) =>
            setFilters((prev) => ({
              ...prev,
              difficulty: value === 'any' ? undefined : (value as DifficultyLevel),
            }))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Difficulty</SelectLabel>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Activity Level */}
      <div>
        <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700">
          Activity Level
        </label>
        <Select
          value={filters.activityLevel?.toString() || 'any'}
          onValueChange={(value) =>
            setFilters((prev) => ({
              ...prev,
              activityLevel: value === 'any' ? undefined : Number(value),
            }))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Activity Level</SelectLabel>
              <SelectItem value="any">Any</SelectItem>
              {[1, 2, 3, 4, 5].map((level) => (
                <SelectItem key={level} value={level.toString()}>
                  {level}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Duration - Days */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Duration (Days)</label>
        <div className="flex space-x-2 mt-1">
          <Input
            type="number"
            name="minDays"
            value={filters.minDays || ''}
            onChange={handleChange}
            placeholder="Min"
            min={1}
          />
          <Input
            type="number"
            name="maxDays"
            value={filters.maxDays || ''}
            onChange={handleChange}
            placeholder="Max"
            min={1}
          />
        </div>
      </div>

      {/* Cost */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Cost ($)</label>
        <div className="flex space-x-2 mt-1">
          <Input
            type="number"
            name="minPrice"
            value={filters.minPrice || ''}
            onChange={handleChange}
            placeholder="Min"
            min={0}
          />
          <Input
            type="number"
            name="maxPrice"
            value={filters.maxPrice || ''}
            onChange={handleChange}
            placeholder="Max"
            min={0}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2 mt-6">
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
        <Button onClick={handleApply}>
          Apply
        </Button>
      </div>
    </div>
  );
};

export default TripFilter;
