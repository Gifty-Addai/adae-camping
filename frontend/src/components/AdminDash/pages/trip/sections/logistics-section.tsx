// src/components/TripForm/sections/logistics-section.tsx

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { TripFormInput } from "@/core/interfaces/zod";
import ErrorMessage from "@/components/ui/error-message";

const LogisticsSection: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<TripFormInput>();

  return (
    <div className="flex flex-col space-y-4">
      {/* Transportation */}
      <div className="flex flex-col space-y-2">
        <Label htmlFor="logistics.transportation">Transportation</Label>
        <Input
          id="logistics.transportation"
          placeholder="Enter transportation details"
          {...register("logistics.transportation")}
        />
        {errors.logistics?.transportation?.message && (
          <ErrorMessage message={errors.logistics.transportation.message} />
        )}
      </div>

      {/* Gear Provided */}
      <div className="flex items-center space-x-2">
        <Label htmlFor="logistics.gearProvided">Gear Provided</Label>
        <input
          type="checkbox"
          id="logistics.gearProvided"
          {...register("logistics.gearProvided")}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
        />
      </div>

      {/* Accommodation */}
      <div className="flex flex-col space-y-2">
        <Label htmlFor="logistics.accommodation">Accommodation</Label>
        <Input
          id="logistics.accommodation"
          placeholder="Enter accommodation details"
          {...register("logistics.accommodation")}
        />
        {errors.logistics?.accommodation?.message && (
          <ErrorMessage message={errors.logistics.accommodation.message} />
        )}
      </div>
    </div>
  );
};

export default LogisticsSection;
