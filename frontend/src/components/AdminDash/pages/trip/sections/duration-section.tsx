// src/components/TripForm/sections/duration-section.tsx

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { TripFormInput } from "@/core/interfaces/zod";
import ErrorMessage from "@/components/ui/error-message";

const DurationSection: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<TripFormInput>();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Days */}
      <div className="flex flex-col space-y-2">
        <Label htmlFor="duration.days">Duration (Days)</Label>
        <Input
          type="number"
          id="duration.days"
          placeholder="Enter number of days"
          {...register("duration.days", { valueAsNumber: true })}
          min={1}
        />
        {errors.duration?.days?.message && (
          <ErrorMessage message={errors.duration.days.message} />
        )}
      </div>

      {/* Nights */}
      <div className="flex flex-col space-y-2">
        <Label htmlFor="duration.nights">Duration (Nights)</Label>
        <Input
          type="number"
          id="duration.nights"
          placeholder="Enter number of nights"
          {...register("duration.nights", { valueAsNumber: true })}
          min={0}
        />
        {errors.duration?.nights?.message && (
          <ErrorMessage message={errors.duration.nights.message} />
        )}
      </div>
    </div>
  );
};

export default DurationSection;
