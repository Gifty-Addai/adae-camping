// src/components/Filters.tsx

import React from 'react';
import Select from 'react-select';
import { useTranslation } from 'react-i18next';

interface FilterProps {
  categories: string[];
  onFilterChange: (selected: string[]) => void;
  onSortChange: (selected: string) => void;
}

const Filters: React.FC<FilterProps> = ({ categories, onFilterChange, onSortChange }) => {
  const { t } = useTranslation();

  const categoryOptions = categories.map((category) => ({
    value: category,
    label: category,
  }));

  const sortOptions = [
    { value: 'price_low_high', label: t('Price: Low to High') },
    { value: 'price_high_low', label: t('Price: High to Low') },
    { value: 'name_asc', label: t('Name: A to Z') },
    { value: 'name_desc', label: t('Name: Z to A') },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
      <Select
        isMulti
        name="categories"
        options={categoryOptions}
        className="w-full sm:w-1/2 mb-4 sm:mb-0"
        classNamePrefix="select"
        placeholder={t('Filter by categories')}
        onChange={(selectedOptions) =>
          onFilterChange(selectedOptions ? selectedOptions.map((opt) => opt.value) : [])
        }
      />
      <Select
        name="sort"
        options={sortOptions}
        className="w-full sm:w-1/3"
        classNamePrefix="select"
        placeholder={t('Sort products')}
        onChange={(selectedOption) => onSortChange(selectedOption ? selectedOption.value : '')}
      />
    </div>
  );
};

export default Filters;
