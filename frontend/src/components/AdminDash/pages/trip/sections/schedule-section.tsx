import React from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import ErrorMessage from "@/components/ui/error-message";
import { ScheduleInput, scheduleSchema } from "@/core/interfaces/zod";
import { toast } from "react-toastify";
import { getInclusiveDayDifference } from "@/lib/utils";

interface ScheduleSectionProps {
  data: ScheduleInput;
  onNext: (data: ScheduleInput) => void;
  duration: number;
  onBack?: () => void;
}

const ScheduleSection: React.FC<ScheduleSectionProps> = ({
  data,
  onNext,
  duration,
  onBack,
}) => {
  // 1) Use your zod schema as the resolver
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ScheduleInput>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: data,
    mode: "onSubmit",
  });

  // 2) Field array for "dates"
  const {
    fields: dateFields,
    append: appendDate,
    remove: removeDate,
  } = useFieldArray({
    control,
    name: "dates",
  });

  // 3) Field array for "itinerary"
  const {
    fields: itineraryFields,
    append: appendItinerary,
    remove: removeItinerary,
  } = useFieldArray({
    control,
    name: "itinerary",
  });

  // 4) Submit handler
  const onSubmit = (formData: ScheduleInput) => {
    const isValid = formData.dates.every((date) => {
      const actualDuration =  getInclusiveDayDifference(date.startDate.toDateString(), date.endDate.toDateString());
      // const actualDuration = Math.ceil(
      //   (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      // );

      return actualDuration === duration;
    });

    if (!isValid) {
      toast.info(`Each date range must exactly match the duration of ${duration} days.`);
      return;
    }

    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h3 className="text-center text-yellow-400 text-2xl font-semibold">
        Schedule Information
      </h3>

      {/** =============== DATES SECTION =============== **/}
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-xl">Trip Dates</Label>
          <Label className="text-lg text-blue-500">Duration Set- {duration}</Label>
          <Tooltip>
            <TooltipContent>
              Add the dates for the trip, including availability and slots.
            </TooltipContent>
          </Tooltip>
        </div>

        {dateFields.map((field, index) => (
          <div key={field.id} className="border p-4 rounded-md space-y-4">
            {/* <Label className="text-lg text-blue-500">Duration Set- {duration}</Label> */}
            {/* Start / End Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Start Date */}
              <div className="flex flex-col">

                <Label htmlFor={`dates.${index}.startDate`}>Start Date</Label>
                <Controller
                  control={control}
                  name={`dates.${index}.startDate`}
                  render={({ field }) => (
                    <Input
                      type="date"
                      // Convert Date -> YYYY-MM-DD for display
                      value={
                        field.value ? new Date(field.value).toISOString().split("T")[0] : ""
                      }
                      onChange={(e) => {
                        // Convert the string back into a Date
                        const dateString = e.target.value;
                        alert(dateString)
                        field.onChange(dateString ? new Date(dateString) : null);
                      }}
                      aria-invalid={errors.dates?.[index]?.startDate ? "true" : "false"}
                    />
                  )}
                />
                {errors.dates?.[index]?.startDate && (
                  <ErrorMessage
                    message={errors.dates[index].startDate?.message}
                  />
                )}
              </div>

              {/* End Date */}
              <div className="flex flex-col">
                <Label htmlFor={`dates.${index}.endDate`}>End Date</Label>
                <Controller
                  control={control}
                  name={`dates.${index}.endDate`}
                  render={({ field }) => (
                    <Input
                      type="date"
                      // Convert Date -> YYYY-MM-DD for display
                      value={
                        field.value ? new Date(field.value).toISOString().split("T")[0] : ""
                      }
                      onChange={(e) => {
                        // Convert the string back into a Date
                        const dateString = e.target.value;
                        field.onChange(dateString ? new Date(dateString) : null);
                      }}
                      aria-invalid={errors.dates?.[index]?.endDate ? "true" : "false"}
                    />
                  )}
                />
                {errors.dates?.[index]?.endDate && (
                  <ErrorMessage
                    message={errors.dates[index].endDate?.message}
                  />
                )}
              </div>
            </div>

            {/* Availability & Slots */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* isAvailable */}
              <div className="flex items-center space-x-2">
                <Label htmlFor={`dates.${index}.isAvailable`}>Available</Label>
                <Controller
                  control={control}
                  name={`dates.${index}.isAvailable`}
                  render={({ field }) => (
                    <Checkbox
                      id={`dates.${index}.isAvailable`}
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(!!checked)}
                    />
                  )}
                />
                {errors.dates?.[index]?.isAvailable && (
                  <ErrorMessage
                    message={errors.dates[index].isAvailable?.message}
                  />
                )}
              </div>

              {/* slotsRemaining */}
              {/* <div className="flex flex-col">
                <Label htmlFor={`dates.${index}.slotsRemaining`}>
                  Slots Remaining
                </Label>
                <Controller
                  control={control}
                  name={`dates.${index}.slotsRemaining`}
                  render={({ field }) => (
                    <Input
                      type="number"
                      min={0}
                      id={`dates.${index}.slotsRemaining`}
                      {...field}
                    />
                  )}
                />
                {errors.dates?.[index]?.slotsRemaining && (
                  <ErrorMessage
                    message={errors.dates[index].slotsRemaining?.message}
                  />
                )}
              </div> */}
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

        {/* Add Date Button */}
        <Button
          variant="outline"
          type="button"
          onClick={() =>
            appendDate({
              startDate: new Date(),
              endDate: new Date(),
              isAvailable: true,
              slotsRemaining: 10,
            })
          }
        >
          Add Date
        </Button>
      </div>

      {/** ============== ITINERARY SECTION ============== **/}
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
                <Label htmlFor={`itinerary.${index}.day`}>Day</Label>
                <Controller
                  control={control}
                  name={`itinerary.${index}.day`}
                  render={({ field }) => (
                    <Input
                      type="number"
                      min={1}
                      id={`itinerary.${index}.day`}
                      {...field}
                    />
                  )}
                />
                {errors.itinerary?.[index]?.day && (
                  <ErrorMessage
                    message={errors.itinerary[index].day?.message}
                  />
                )}
              </div>

              {/* Activities */}
              <div className="flex flex-col">
                <Label htmlFor={`itinerary.${index}.activities`}>
                  Activities
                </Label>
                <Controller
                  control={control}
                  name={`itinerary.${index}.activities`}
                  render={({ field }) => (
                    <Input
                      type="text"
                      id={`itinerary.${index}.activities`}
                      placeholder="Describe activities"
                      {...field}
                    />
                  )}
                />
                {errors.itinerary?.[index]?.activities && (
                  <ErrorMessage
                    message={errors.itinerary[index].activities?.message}
                  />
                )}
              </div>
            </div>

            {/* Remove Itinerary Item Button */}
            <Button
              variant="outline"
              type="button"
              onClick={() => removeItinerary(index)}
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
        >
          Add Itinerary Item
        </Button>
      </div>

      {/** ============== NAVIGATION BUTTONS ============== **/}
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
