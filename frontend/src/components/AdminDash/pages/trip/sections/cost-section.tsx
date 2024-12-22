// src/components/TripForm/sections/cost-section.tsx

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { TripFormInput } from "@/core/interfaces/zod";
import ErrorMessage from "@/components/ui/error-message";

const CostSection: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<TripFormInput>();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Base Price */}
      <div className="flex flex-col space-y-2">
        <Label htmlFor="cost.basePrice">Base Price</Label>
        <Input
          type="number"
          id="cost.basePrice"
          placeholder="Enter base price"
          {...register("cost.basePrice", { valueAsNumber: true })}
          min={0}
        />
        {errors.cost?.basePrice?.message && (
          <ErrorMessage message={errors.cost.basePrice.message} />
        )}
      </div>

      {/* Discount */}
      <div className="flex flex-col space-y-2">
        <Label htmlFor="cost.discount">Discount</Label>
        <Input
          type="number"
          id="cost.discount"
          placeholder="Enter discount"
          {...register("cost.discount", { valueAsNumber: true })}
          min={0}
        />
        {errors.cost?.discount?.message && (
          <ErrorMessage message={errors.cost.discount.message} />
        )}
      </div>
    </div>
  );
};

export default CostSection;
