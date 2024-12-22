// src/components/TripForm/sections/basicInfo-section.tsx
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import Textarea from "@/components/ui/textarea";
import { TripFormInput } from "@/core/interfaces/zod"; 
import ErrorMessage from "@/components/ui/error-message";

const BasicInfoSection: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<TripFormInput>();

  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Trip Name */}
      <div className="flex flex-col space-y-2">
        <Label htmlFor="name">Trip Name</Label>
        <Input id="name" placeholder="Enter trip name" {...register("name")} />
        {errors.name?.message && (
          <ErrorMessage message={errors.name.message} />
        )}
      </div>

      {/* Description */}
      <div className="flex flex-col space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter trip description"
          {...register("description")}
          rows={4}
        />
        {errors.description?.message && (
          <ErrorMessage message={errors.description.message} />
        )}
      </div>
    </div>
  );
};

export default BasicInfoSection;
