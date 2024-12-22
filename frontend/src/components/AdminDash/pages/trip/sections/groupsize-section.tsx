// src/components/TripForm/sections/groupsize-section.tsx

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { TripFormInput } from "@/core/interfaces/zod";
import ErrorMessage from "@/components/ui/error-message";

const GroupSizeSection: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<TripFormInput>();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Minimum Group Size */}
      <div className="flex flex-col space-y-2">
        <Label htmlFor="groupSize.min">Minimum Group Size</Label>
        <Input
          type="number"
          id="groupSize.min"
          placeholder="Enter minimum group size"
          {...register("groupSize.min", { valueAsNumber: true })}
          min={1}
        />
        {errors.groupSize?.min?.message && (
          <ErrorMessage message={errors.groupSize.min.message} />
        )}
      </div>

      {/* Maximum Group Size */}
      <div className="flex flex-col space-y-2">
        <Label htmlFor="groupSize.max">Maximum Group Size</Label>
        <Input
          type="number"
          id="groupSize.max"
          placeholder="Enter maximum group size"
          {...register("groupSize.max", { valueAsNumber: true })}
          min={1}
        />
        {errors.groupSize?.max?.message && (
          <ErrorMessage message={errors.groupSize.max.message} />
        )}
      </div>
    </div>
  );
};

export default GroupSizeSection;
