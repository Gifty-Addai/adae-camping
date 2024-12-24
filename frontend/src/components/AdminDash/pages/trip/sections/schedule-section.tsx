// src/components/AdminDash/pages/trip/sections/ScheduleSection.tsx

import React from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  tripSchema,
  TripFormInput,  // the full trip shape
} from "@/core/interfaces/zod";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import ErrorMessage from "@/components/ui/error-message";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";

interface ScheduleSectionProps {
  // We'll assume "data" is the full TripFormInput,
  // but maybe only the schedule portion is filled in.
  data: TripFormInput;
  onNext: (data: TripFormInput) => void;
  onBack?: () => void; // Optional back button handler
}

const ScheduleSection: React.FC<ScheduleSectionProps> = ({
  data,
  onNext,
  onBack,
}) => {
  // useForm with the FULL tripSchema
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TripFormInput>({
    resolver: zodResolver(tripSchema),
    defaultValues: data,

    // Validate onSubmit so we see all errors when user clicks "Continue"
    mode: "onSubmit",
  });

  // Setup field arrays for "schedule.dates" and "schedule.itinerary"
  const {
    fields: dateFields,
    append: appendDate,
    remove: removeDate,
  } = useFieldArray({
    control,
    name: "schedule.dates",
  });

  const {
    fields: itineraryFields,
    append: appendItinerary,
    remove: removeItinerary,
  } = useFieldArray({
    control,
    name: "schedule.itinerary",
  });

  // Handle submit
  const onSubmit = (formData: TripFormInput) => {
    // If no validation errors, call onNext
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h3 className="text-center text-yellow-400 text-2xl font-semibold">
        Schedule Information
      </h3>

      {/* DATES SECTION */}
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-lg">Trip Dates</Label>
          <Tooltip>
            <TooltipContent>
              Add the dates for the trip, including availability and slots.
            </TooltipContent>
          </Tooltip>
        </div>

        {dateFields.map((field, index) => (
          <div key={field.id} className="border p-4 rounded-md space-y-4">
            {/* Start / End Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Start Date */}
              <div className="flex flex-col">
                <Label htmlFor={`schedule.dates.${index}.startDate`}>
                  Start Date
                </Label>
                <Controller
                  control={control}
                  name={`schedule.dates.${index}.startDate`}
                  render={({ field }) => (
                    <input
                      type="date"
                      id={`schedule.dates.${index}.startDate`}
                      {...field}
                      className="border rounded-md px-4 py-2 focus:ring focus:ring-blue-300"
                    />
                  )}
                />
                {errors.schedule?.dates?.[index]?.startDate && (
                  <ErrorMessage
                    message={errors.schedule.dates[index].startDate?.message}
                  />
                )}
              </div>

              {/* End Date */}
              <div className="flex flex-col">
                <Label htmlFor={`schedule.dates.${index}.endDate`}>
                  End Date
                </Label>
                <Controller
                  control={control}
                  name={`schedule.dates.${index}.endDate`}
                  render={({ field }) => (
                    <input
                      type="date"
                      id={`schedule.dates.${index}.endDate`}
                      {...field}
                      className="border rounded-md px-4 py-2 focus:ring focus:ring-blue-300"
                    />
                  )}
                />
                {errors.schedule?.dates?.[index]?.endDate && (
                  <ErrorMessage
                    message={errors.schedule.dates[index].endDate?.message}
                  />
                )}
              </div>
            </div>

            {/* Availability + Slots */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* isAvailable */}
              <div className="flex items-center space-x-2">
                <Label
                  htmlFor={`schedule.dates.${index}.isAvailable`}
                >
                  Available
                </Label>
                <Controller
                  control={control}
                  name={`schedule.dates.${index}.isAvailable`}
                  render={({ field }) => (
                    <Checkbox
                      id={`schedule.dates.${index}.isAvailable`}
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(!!checked)}
                    />
                  )}
                />
              </div>

              {/* slotsRemaining */}
              <div className="flex flex-col">
                <Label htmlFor={`schedule.dates.${index}.slotsRemaining`}>
                  Slots Remaining
                </Label>
                <Controller
                  control={control}
                  name={`schedule.dates.${index}.slotsRemaining`}
                  render={({ field }) => (
                    <input
                      type="number"
                      min={0}
                      id={`schedule.dates.${index}.slotsRemaining`}
                      {...field}
                      className="border rounded-md px-4 py-2 focus:ring focus:ring-blue-300"
                    />
                  )}
                />
                {errors.schedule?.dates?.[index]?.slotsRemaining && (
                  <ErrorMessage
                    message={
                      errors.schedule.dates[index].slotsRemaining?.message
                    }
                  />
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

        {/* Add Date Button */}
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

      {/* ITINERARY SECTION */}
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-lg">Itinerary</Label>
          <Tooltip>
            <TooltipContent>
              Add detailed activities for each day of the trip.
            </TooltipContent>
          </Tooltip>
        </div>

        {itineraryFields.map((field, index) => (
          <div key={field.id} className="border p-4 rounded-md space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Day */}
              <div className="flex flex-col">
                <Label htmlFor={`schedule.itinerary.${index}.day`}>
                  Day
                </Label>
                <Controller
                  control={control}
                  name={`schedule.itinerary.${index}.day`}
                  render={({ field }) => (
                    <input
                      type="number"
                      id={`schedule.itinerary.${index}.day`}
                      {...field}
                      min={1}
                      className="border rounded-md px-4 py-2 focus:ring focus:ring-blue-300"
                    />
                  )}
                />
                {errors.schedule?.itinerary?.[index]?.day && (
                  <ErrorMessage
                    message={errors.schedule.itinerary[index].day?.message}
                  />
                )}
              </div>

              {/* Activities */}
              <div className="flex flex-col">
                <Label htmlFor={`schedule.itinerary.${index}.activities`}>
                  Activities
                </Label>
                <Controller
                  control={control}
                  name={`schedule.itinerary.${index}.activities`}
                  render={({ field }) => (
                    <input
                      type="text"
                      id={`schedule.itinerary.${index}.activities`}
                      {...field}
                      placeholder="Describe activities"
                      className="border rounded-md px-4 py-2 focus:ring focus:ring-blue-300"
                    />
                  )}
                />
                {errors.schedule?.itinerary?.[index]?.activities && (
                  <ErrorMessage
                    message={
                      errors.schedule.itinerary[index].activities?.message
                    }
                  />
                )}
              </div>
            </div>

            {/* Remove Itinerary Item */}
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

        {/* Add Itinerary Item Button */}
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

      {/* NAVIGATION BUTTONS */}
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
