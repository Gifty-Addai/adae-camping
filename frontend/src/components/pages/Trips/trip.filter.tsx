// src/components/trip.filter.tsx

import React, { useState, useEffect } from 'react';
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
import { TripSearchParams, TripType, DifficultyLevel, TripStatus } from '@/core/interfaces/index';

interface FilterProps {
  onApply: (params: TripSearchParams) => void;
  isMobile: boolean;
  onClose?: () => void;
}

const TripFilter: React.FC<FilterProps> = ({ onApply, isMobile, onClose }) => {
  const [filters, setFilters] = useState<TripSearchParams>({});

  // Effect to apply filters whenever they change
  useEffect(() => {
    onApply(filters);
    // Optionally close the modal on mobile after applying filters
    if (isMobile && onClose) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

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

  const handlePointsOfInterestChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    const poiArray = value.split(',').map((poi) => poi.trim()).filter(poi => poi !== '');
    setFilters((prev) => ({
      ...prev,
      pointsOfInterest: poiArray.length > 0 ? poiArray : undefined,
    }));
  };

  const handleReset = () => {
    setFilters({});
    // onApply is already called via useEffect when filters are cleared
    if (isMobile && onClose) {
      onClose();
    }
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

      {/* Duration - Nights */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Duration (Nights)</label>
        <div className="flex space-x-2 mt-1">
          <Input
            type="number"
            name="minNights"
            value={filters.minNights || ''}
            onChange={handleChange}
            placeholder="Min"
            min={0}
          />
          <Input
            type="number"
            name="maxNights"
            value={filters.maxNights || ''}
            onChange={handleChange}
            placeholder="Max"
            min={0}
          />
        </div>
      </div>

      {/* Group Size */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Group Size</label>
        <div className="flex space-x-2 mt-1">
          <Input
            type="number"
            name="minGroupSize"
            value={filters.minGroupSize || ''}
            onChange={handleChange}
            placeholder="Min"
            min={1}
          />
          <Input
            type="number"
            name="maxGroupSize"
            value={filters.maxGroupSize || ''}
            onChange={handleChange}
            placeholder="Max"
            min={1}
          />
        </div>
      </div>

      {/* Main Location */}
      <div>
        <label htmlFor="mainLocation" className="block text-sm font-medium text-gray-700">
          Main Location
        </label>
        <Input
          type="text"
          name="mainLocation"
          value={filters.mainLocation || ''}
          onChange={handleChange}
          placeholder="e.g., Yosemite"
          className="mt-1"
        />
      </div>

      {/* Points of Interest */}
      <div>
        <label htmlFor="pointsOfInterest" className="block text-sm font-medium text-gray-700">
          Points of Interest
        </label>
        <Input
          type="text"
          name="pointsOfInterest"
          value={filters.pointsOfInterest ? filters.pointsOfInterest.join(', ') : ''}
          onChange={handlePointsOfInterestChange}
          placeholder="e.g., Half Dome, El Capitan"
          className="mt-1"
        />
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

      {/* Status */}
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <Select
          value={filters.status || 'any'}
          onValueChange={(value) =>
            setFilters((prev) => ({
              ...prev,
              status: value === 'any' ? undefined : (value as TripStatus),
            }))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Status</SelectLabel>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Start Date */}
      <div>
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
          Start Date
        </label>
        <Input
          type="date"
          name="startDate"
          value={filters.startDate || ''}
          onChange={handleChange}
          className="mt-1"
        />
      </div>

      {/* End Date */}
      <div>
        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
          End Date
        </label>
        <Input
          type="date"
          name="endDate"
          value={filters.endDate || ''}
          onChange={handleChange}
          className="mt-1"
        />
      </div>

      {/* Search Text */}
      <div>
        <label htmlFor="search" className="block text-sm font-medium text-gray-700">
          Search
        </label>
        <Input
          type="text"
          name="search"
          value={filters.search || ''}
          onChange={handleChange}
          placeholder="Search by name or description"
          className="mt-1"
        />
      </div>

      {/* Sort By */}
      <div>
        <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700">
          Sort By
        </label>
        <Select
          value={filters.sortBy || 'schedule.dates.startDate'}
          onValueChange={(value) =>
            setFilters((prev) => ({
              ...prev,
              sortBy:
                value === 'any' ? undefined : (value as TripSearchParams['sortBy']),
            }))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Start Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sort By</SelectLabel>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="type">Type</SelectItem>
              <SelectItem value="difficulty">Difficulty</SelectItem>
              <SelectItem value="activityLevel">Activity Level</SelectItem>
              <SelectItem value="duration.days">Duration (Days)</SelectItem>
              <SelectItem value="cost.basePrice">Cost</SelectItem>
              <SelectItem value="schedule.dates.startDate">Start Date</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Order */}
      <div>
        <label htmlFor="order" className="block text-sm font-medium text-gray-700">
          Order
        </label>
        <Select
          value={filters.order || 'asc'}
          onValueChange={(value) =>
            setFilters((prev) => ({
              ...prev,
              order: value === 'any' ? undefined : (value as 'asc' | 'desc'),
            }))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Ascending" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Order</SelectLabel>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Reset Button */}
      <div className="flex justify-end mt-6">
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </div>
  );
};

export default TripFilter;
