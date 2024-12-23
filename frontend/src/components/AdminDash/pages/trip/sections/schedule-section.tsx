// src/components/AdminDash/pages/trip/sections/ScheduleSection.tsx

import React from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { scheduleSchema, ScheduleInput } from "@/core/interfaces/zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import ErrorMessage from "@/components/ui/error-message";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";

interface ScheduleSectionProps {
  data: ScheduleInput;
  onNext: (data: ScheduleInput) => void;
  onBack?: () => void; // Optional back button handler
}

const ScheduleSection: React.FC<ScheduleSectionProps> = ({ data, onNext, onBack }) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ScheduleInput>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: data,
    mode: "onBlur", // Validation mode
  });

  const {
    fields: dateFields,
    append: appendDate,
    remove: removeDate,
  } = useFieldArray({
    control,
    name: "dates",
  });

  const {
    fields: itineraryFields,
    append: appendItinerary,
    remove: removeItinerary,
  } = useFieldArray({
    control,
    name: "itinerary",
  });

  const onSubmit = (formData: ScheduleInput) => {
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h3 className="text-center text-yellow-400 text-2xl font-semibold">Schedule Information</h3>

      {/* Dates Section */}
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-lg">Trip Dates</Label>
          <Tooltip>
            <TooltipContent>Add the dates for the trip, including availability and slots.</TooltipContent>
          </Tooltip>
        </div>
        {dateFields.map((field, index) => (
          <div key={field.id} className="border p-4 rounded-md space-y-4">
            {/* Start and End Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Start Date */}
              <div className="flex flex-col">
                <Label htmlFor={`dates.${index}.startDate`}>Start Date</Label>
                <Controller
                  control={control}
                  name={`dates.${index}.startDate`}
                  render={({ field }) => (
                    <input
                      type="date"
                      id={`dates.${index}.startDate`}
                      {...field}
                      className="border rounded-md px-4 py-2 focus:ring focus:ring-blue-300"
                    />
                  )}
                />
                {errors.dates?.[index]?.startDate && (
                  <ErrorMessage message={errors.dates[index].startDate.message} />
                )}
              </div>

              {/* End Date */}
              <div className="flex flex-col">
                <Label htmlFor={`dates.${index}.endDate`}>End Date</Label>
                <Controller
                  control={control}
                  name={`dates.${index}.endDate`}
                  render={({ field }) => (
                    <input
                      type="date"
                      id={`dates.${index}.endDate`}
                      {...field}
                      className="border rounded-md px-4 py-2 focus:ring focus:ring-blue-300"
                    />
                  )}
                />
                {errors.dates?.[index]?.endDate && (
                  <ErrorMessage message={errors.dates[index].endDate.message} />
                )}
              </div>
            </div>

            {/* Availability and Slots Remaining */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Availability Checkbox */}
              <div className="flex items-center space-x-2">
                <Label htmlFor={`dates.${index}.isAvailable`}>Available</Label>
                <Controller
                  control={control}
                  name={`dates.${index}.isAvailable`}
                  render={({ field }) => (
                    <Checkbox
                      id={`dates.${index}.isAvailable`}
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked)}
                    />
                  )}
                />
              </div>

              {/* Slots Remaining */}
              <div className="flex flex-col">
                <Label htmlFor={`dates.${index}.slotsRemaining`}>Slots Remaining</Label>
                <Controller
                  control={control}
                  name={`dates.${index}.slotsRemaining`}
                  render={({ field }) => (
                    <input
                      type="number"
                      id={`dates.${index}.slotsRemaining`}
                      {...field}
                      min={0}
                      className="border rounded-md px-4 py-2 focus:ring focus:ring-blue-300"
                    />
                  )}
                />
                {errors.dates?.[index]?.slotsRemaining && (
                  <ErrorMessage message={errors.dates[index].slotsRemaining.message} />
                )}
              </div>
            </div>

            {/* Remove Date Button */}
            <Button
              variant="outline"
              type="button"
              onClick={() => removeDate(index)}
              disabled={dateFields.length === 1}
              className="w-full sm:w-auto"
            >
              Remove Date
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          type="button"
          onClick={() =>
            appendDate({
              startDate: "",
              endDate: "",
              isAvailable: true,
              slotsRemaining: 10,
            })
          }
          className="self-start"
        >
          Add Date
        </Button>
      </div>

      {/* Itinerary Section */}
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-lg">Itinerary</Label>
          <Tooltip>
            <TooltipContent>Add detailed activities for each day of the trip.</TooltipContent>
          </Tooltip>
        </div>
        {itineraryFields.map((field, index) => (
          <div key={field.id} className="border p-4 rounded-md space-y-2">
            {/* Day and Activities */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Day Number */}
              <div className="flex flex-col">
                <Label htmlFor={`itinerary.${index}.day`}>Day</Label>
                <Controller
                  control={control}
                  name={`itinerary.${index}.day`}
                  render={({ field }) => (
                    <input
                      type="number"
                      id={`itinerary.${index}.day`}
                      {...field}
                      min={1}
                      className="border rounded-md px-4 py-2 focus:ring focus:ring-blue-300"
                    />
                  )}
                />
                {errors.itinerary?.[index]?.day && (
                  <ErrorMessage message={errors.itinerary[index].day.message} />
                )}
              </div>

              {/* Activities */}
              <div className="flex flex-col">
                <Label htmlFor={`itinerary.${index}.activities`}>Activities</Label>
                <Controller
                  control={control}
                  name={`itinerary.${index}.activities`}
                  render={({ field }) => (
                    <input
                      type="text"
                      id={`itinerary.${index}.activities`}
                      {...field}
                      placeholder="Describe activities"
                      className="border rounded-md px-4 py-2 focus:ring focus:ring-blue-300"
                    />
                  )}
                />
                {errors.itinerary?.[index]?.activities && (
                  <ErrorMessage message={errors.itinerary[index].activities.message} />
                )}
              </div>
            </div>

            {/* Remove Itinerary Item Button */}
            <Button
              variant="outline"
              type="button"
              onClick={() => removeItinerary(index)}
              className="w-full sm:w-auto"
            >
              Remove Itinerary Item
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          type="button"
          onClick={() =>
            appendItinerary({
              day: itineraryFields.length + 1,
              activities: "",
            })
          }
          className="self-start"
        >
          Add Itinerary Item
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

export default React.memo(ScheduleSection);
