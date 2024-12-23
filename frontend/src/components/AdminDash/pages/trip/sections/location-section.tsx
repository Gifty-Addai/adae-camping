// src/components/TripForm/sections/LocationSection.tsx

import React from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ErrorMessage from "@/components/ui/error-message";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { LocationInput, locationSchema } from "@/core/interfaces/zod";

interface LocationSectionProps {
  data: LocationInput;
  onNext: (data: LocationInput) => void;
  onBack?: () => void; // Optional back button handler
}

const LocationSection: React.FC<LocationSectionProps> = ({ data, onNext, onBack }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LocationInput>({
    resolver: zodResolver(locationSchema),
    defaultValues: data,
    mode: "onBlur", // Validation mode
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "pointsOfInterest",
  });

  const onSubmit = (formData: LocationInput) => {
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-6">
      <h3 className="text-center text-yellow-400 text-2xl font-semibold">Location Information</h3>

      {/* Main Location */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="mainLocation">
            Main Location <span className="text-red-500">*</span>
          </Label>
          <Tooltip>
            <TooltipContent>Specify the main location for the trip.</TooltipContent>
          </Tooltip>
        </div>
        <Controller
          control={control}
          name="mainLocation"
          render={({ field }) => (
            <Input
              id="mainLocation"
              placeholder="Enter main location"
              {...field}
              className="border rounded-md px-4 py-2 focus:ring focus:ring-blue-300"
              aria-invalid={errors.mainLocation ? "true" : "false"}
            />
          )}
        />
        {errors.mainLocation && <ErrorMessage message={errors.mainLocation.message} />}
      </div>

      {/* Points of Interest */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <Label>
            Points of Interest <span className="text-red-500">*</span>
          </Label>
          <Tooltip>
            <TooltipContent>Add key points of interest for the trip.</TooltipContent>
          </Tooltip>
        </div>
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center space-x-2">
            <Controller
              control={control}
              name={`pointsOfInterest.${index}.value`}
              render={({ field }) => (
                <Input
                  placeholder={`Point of Interest ${index + 1}`}
                  {...field}
                  className="flex-1 border rounded-md px-4 py-2 focus:ring focus:ring-blue-300"
                  aria-invalid={errors.pointsOfInterest?.[index]?.value ? "true" : "false"}
                />
              )}
            />
            {fields.length > 1 && (
              <Button type="button" variant="destructive" onClick={() => remove(index)}>
                Remove
              </Button>
            )}
          </div>
        ))}
        {/* Display error for pointsOfInterest array */}
        {errors.pointsOfInterest && typeof errors.pointsOfInterest.message === "string" && (
          <ErrorMessage message={errors.pointsOfInterest.message} />
        )}
        <Button type="button" onClick={() => append({ value: "" })}>
          Add Point of Interest
        </Button>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        {onBack && (
          <Button variant="ghost" type="button" onClick={onBack}>
            Back
          </Button>
        )}
        <Button type="submit">Continue</Button>
      </div>
    </form>
  );
};

export default React.memo(LocationSection);
