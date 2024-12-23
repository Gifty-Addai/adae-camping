// src/components/AdminDash/pages/trip/sections/activityLevel-section.tsx
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { activityLevelSchema, ActivityLevelInput } from "@/core/interfaces/zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import ErrorMessage from "@/components/ui/error-message";
import { Slider } from "@/components/ui/slider";

interface ActivityLevelSectionProps {
  data: ActivityLevelInput;
  onNext: (data: ActivityLevelInput) => void;
}

const ActivityLevelSection: React.FC<ActivityLevelSectionProps> = ({ data, onNext }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ActivityLevelInput>({
    resolver: zodResolver(activityLevelSchema),
    defaultValues: data,
  });

  const onSubmit = (formData: ActivityLevelInput) => {
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-6">
      <h3 className="text-center text-yellow-400 text-2xl font-semibold">Activity Level</h3>

      <div className="flex justify-between items-center">
        <Label htmlFor="activityLevel" className="text-lg font-medium">
          Activity Level
        </Label>
        <span className="text-sm text-gray-500">(1 = Low, 5 = High)</span>
      </div>

      <Controller
        name="activityLevel"
        control={control}
        render={({ field }) => (
          <Slider
            id="activityLevel"
            min={1}
            max={5}
            step={1}
            value={[field.value]}
            onValueChange={(value: number[]) => field.onChange(value[0])}
            aria-label="Activity Level Slider"
            className="w-full"
          />
        )}
      />

      <div className="flex justify-between text-sm">
        {[1, 2, 3, 4, 5].map((level) => (
          <span key={level} className="w-10 text-center text-yellow-400">
            {level}
          </span>
        ))}
      </div>

      {errors.activityLevel?.message && (
        <ErrorMessage message={errors.activityLevel.message} />
      )}

      {/* Continue Button */}
      <div className="flex justify-end">
        <Button type="submit">Continue</Button>
      </div>
    </form>
  );
};

export default React.memo(ActivityLevelSection);
