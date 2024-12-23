// src/components/AdminDash/pages/trip/sections/groupsize-section.tsx
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { groupSizeSchema, GroupSizeInput } from "@/core/interfaces/zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import ErrorMessage from "@/components/ui/error-message";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";

interface GroupSizeSectionProps {
  data: GroupSizeInput;
  onNext: (data: GroupSizeInput) => void;
}

const GroupSizeSection: React.FC<GroupSizeSectionProps> = ({ data, onNext }) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<GroupSizeInput>({
    resolver: zodResolver(groupSizeSchema),
    defaultValues: data,
  });

  const watchedMin = watch("min");

  const onSubmit = (formData: GroupSizeInput) => {
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h3 className="text-center text-yellow-400 text-2xl font-semibold">Group Size</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Minimum Group Size */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="groupSize.min">Minimum Group Size</Label>
            <Tooltip>
              <TooltipContent>The minimum number of people required for the trip.</TooltipContent>
            </Tooltip>
          </div>
          <Controller
            name="min"
            control={control}
            render={({ field }) => (
              <input
                type="number"
                id="groupSize.min"
                placeholder="Enter minimum group size"
                {...field}
                min={1}
                className="border rounded-md px-4 py-2 focus:ring focus:ring-blue-300"
              />
            )}
          />
          {errors.min && <ErrorMessage message={errors.min.message} />}
        </div>

        {/* Maximum Group Size */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="groupSize.max">Maximum Group Size</Label>
            <Tooltip>
              <TooltipContent>The maximum number of people allowed for the trip.</TooltipContent>
            </Tooltip>
          </div>
          <Controller
            name="max"
            control={control}
            render={({ field }) => (
              <input
                type="number"
                id="groupSize.max"
                placeholder="Enter maximum group size"
                {...field}
                min={watchedMin || 1}
                className="border rounded-md px-4 py-2 focus:ring focus:ring-blue-300"
              />
            )}
          />
          {errors.max && <ErrorMessage message={errors.max.message} />}
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-end">
        <Button type="submit">Continue</Button>
      </div>
    </form>
  );
};

export default React.memo(GroupSizeSection);
