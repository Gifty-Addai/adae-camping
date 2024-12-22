// src/components/TripForm/sections/schedule-section.tsx

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useFormContext, useFieldArray } from "react-hook-form";
import { TripFormInput } from "@/core/interfaces/zod";
import { Button } from "@/components/ui/button";
import ErrorMessage from "@/components/ui/error-message";

const ScheduleSection: React.FC = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<TripFormInput>();

  const { fields: dateFields, append: appendDate, remove: removeDate } = useFieldArray({
    control,
    name: "schedule.dates",
  });

  const { fields: itineraryFields, append: appendItinerary, remove: removeItinerary } = useFieldArray({
    control,
    name: "schedule.itinerary",
  });

  return (
    <div className="flex flex-col space-y-4">
      {/* Dates */}
      <div className="flex flex-col space-y-2">
        <Label className="mb-3 text-yellow-400 text-2xl">Trip Dates</Label>
        {dateFields.map((field, index) => (
          <div key={field.id} className="flex flex-col space-y-2 mb-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Start Date */}
              <div className="flex flex-col space-y-1">
                <Label htmlFor={`schedule.dates.${index}.startDate`}>Start Date</Label>
                <Input
                  type="date"
                  id={`schedule.dates.${index}.startDate`}
                  {...register(`schedule.dates.${index}.startDate` as const)}
                />
                {errors.schedule?.dates?.[index]?.startDate?.message && (
                  <ErrorMessage message={errors.schedule.dates[index].startDate?.message} />
                )}
              </div>

              {/* End Date */}
              <div className="flex flex-col space-y-1">
                <Label htmlFor={`schedule.dates.${index}.endDate`}>End Date</Label>
                <Input
                  type="date"
                  id={`schedule.dates.${index}.endDate`}
                  {...register(`schedule.dates.${index}.endDate` as const)}
                />
                {errors.schedule?.dates?.[index]?.endDate?.message && (
                  <ErrorMessage message={errors.schedule.dates[index].endDate?.message} />
                )}
              </div>
            </div>

            {/* Available Checkbox and Slots Remaining */}
            <div className="flex items-center space-x-4">
              {/* Is Available */}
              <div className="flex items-center space-x-2">
                <Label htmlFor={`schedule.dates.${index}.isAvailable`}>Available</Label>
                <input
                  type="checkbox"
                  id={`schedule.dates.${index}.isAvailable`}
                  {...register(`schedule.dates.${index}.isAvailable` as const)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
              </div>

              {/* Slots Remaining */}
              <div className="flex flex-col space-y-1">
                <Label htmlFor={`schedule.dates.${index}.slotsRemaining`}>Slots Remaining</Label>
                <Input
                  type="number"
                  id={`schedule.dates.${index}.slotsRemaining`}
                  placeholder="Enter slots remaining"
                  {...register(`schedule.dates.${index}.slotsRemaining` as const, { valueAsNumber: true })}
                  min={0}
                />
                {errors.schedule?.dates?.[index]?.slotsRemaining?.message && (
                  <ErrorMessage message={errors.schedule.dates[index].slotsRemaining?.message} />
                )}
              </div>
            </div>

            {/* Remove Date Button */}
            <Button
              variant="outline"
              type="button"
              onClick={() => removeDate(index)}
              disabled={dateFields.length === 1}
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
        >
          Add Date
        </Button>
      </div>

      {/* Itinerary */}
      <div className="flex flex-col space-y-2">
        <Label>Itinerary</Label>
        {itineraryFields.map((field, index) => (
          <div key={field.id} className="flex flex-col space-y-1 mb-2">
            <div className="flex items-center space-x-2">
              <Label htmlFor={`schedule.itinerary.${index}.day`}>Day</Label>
              <Input
                type="number"
                id={`schedule.itinerary.${index}.day`}
                placeholder="Day number"
                {...register(`schedule.itinerary.${index}.day` as const, { valueAsNumber: true })}
                min={1}
              />
              <Label htmlFor={`schedule.itinerary.${index}.activities`}>Activities</Label>
              <Input
                id={`schedule.itinerary.${index}.activities`}
                placeholder="Enter activities"
                {...register(`schedule.itinerary.${index}.activities` as const)}
              />
              <Button
                variant="outline"
                type="button"
                onClick={() => removeItinerary(index)}
              >
                Remove
              </Button>
            </div>
            {errors.schedule?.itinerary?.[index]?.activities?.message && (
              <ErrorMessage message={errors.schedule.itinerary[index].activities?.message} />
            )}
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
        >
          Add Itinerary Item
        </Button>
      </div>
    </div>
  );
};

export default ScheduleSection;
