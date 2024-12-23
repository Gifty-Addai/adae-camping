// src/components/TripForm/sections/DurationSection.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ErrorMessage from "@/components/ui/error-message";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { DurationInput, durationSchema } from "@/core/interfaces/zod";

interface DurationSectionProps {
  data: {
    days: number;
    nights: number;
  };
  onNext: (data: DurationInput) => void;
}

const DurationSection: React.FC<DurationSectionProps> = ({ data, onNext }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DurationInput>({
    resolver: zodResolver(durationSchema),
    defaultValues: {
      days: data.days,
      nights: data.nights,
    },
  });

  const days = watch("days");
  const nights = watch("nights");

  // Ensure nights do not exceed days - 1
  React.useEffect(() => {
    if (nights > days - 1) {
      setValue("nights", days - 1);
    }
  }, [days, nights, setValue]);

  const onSubmit = (formData: DurationInput) => {
    onNext(formData);
  };

  const handleDaysChange = (value: number[]) => {
    const newDays = value[0];
    setValue("days", newDays, { shouldValidate: true });
    if (nights > newDays - 1) {
      setValue("nights", newDays - 1, { shouldValidate: true });
    }
  };

  const handleNightsChange = (value: number[]) => {
    const newNights = value[0];
    if (newNights > days - 1) {
      setValue("nights", days - 1, { shouldValidate: true });
    } else {
      setValue("nights", newNights, { shouldValidate: true });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Days */}
      <div className="flex flex-col space-y-1">
        <div className="flex items-center justify-between">
          <Label htmlFor="days">
            Duration (Days) <span className="text-red-500">*</span>
          </Label>
          <Tooltip>
            <TooltipContent>The number of full days for the trip.</TooltipContent>
          </Tooltip>
        </div>
        <Slider
          id="days"
          min={1}
          max={30}
          step={1}
          value={[days]}
          onValueChange={handleDaysChange}
          aria-label="Duration Days Slider"
          className="w-full"
        />
        <Input
          type="number"
          id="days-input"
          placeholder="Enter number of days"
          {...register("days", {
            valueAsNumber: true,
            min: {
              value: 1,
              message: "Days must be at least 1",
            },
          })}
          min={1}
          className="border rounded-md px-4 py-2 focus:ring focus:ring-blue-300"
          aria-invalid={errors.days ? "true" : "false"}
        />
        {errors.days && <ErrorMessage message={errors.days.message} />}
      </div>

      {/* Nights */}
      <div className="flex flex-col space-y-1">
        <div className="flex items-center justify-between">
          <Label htmlFor="nights">Duration (Nights)</Label>
          <Tooltip>
            <TooltipContent>The number of nights for the trip.</TooltipContent>
          </Tooltip>
        </div>
        <Slider
          id="nights"
          min={0}
          max={days - 1}
          step={1}
          value={[nights]}
          onValueChange={handleNightsChange}
          aria-label="Duration Nights Slider"
          className="w-full"
        />
        <Input
          type="number"
          id="nights-input"
          placeholder="Enter number of nights"
          {...register("nights", {
            valueAsNumber: true,
            validate: (value) =>
              value <= days - 1 ||
              `Nights cannot exceed Days minus 1. Currently, Days: ${days}`,
          })}
          min={0}
          max={days - 1}
          className="border rounded-md px-4 py-2 focus:ring focus:ring-blue-300"
          aria-invalid={errors.nights ? "true" : "false"}
        />
        {errors.nights && <ErrorMessage message={errors.nights.message} />}
      </div>

      {/* Continue Button */}
      <div className="flex justify-end">
        <Button type="submit">Continue</Button>
      </div>
    </form>
  );
};

export default React.memo(DurationSection);
