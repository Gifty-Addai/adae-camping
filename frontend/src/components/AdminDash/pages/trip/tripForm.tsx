// src/components/TripForm/TripForm.tsx

"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FormProvider, useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trip } from "@/core/interfaces";
import { TripFormInput, tripSchema, TripFormOutput } from "@/core/interfaces/zod";
import BasicInfoSection from "./sections/basicInfo-section";
import ActivityLevelSection from "./sections/activityLevel-section";
import CostSection from "./sections/cost-section";
import DurationSection from "./sections/duration-section";
import GroupSizeSection from "./sections/groupsize-section";
import ImagesSection from "./sections/images-section";
import LocationSection from "./sections/location-section";
import LogisticsSection from "./sections/logistics-section";
import ScheduleSection from "./sections/schedule-section";
import { Label } from "@/components/ui/label";

// Import shadcn Select components
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from "@/components/ui/select";
import { difficultyOptions, typeOptions } from "@/data/data";
import ErrorMessage from "@/components/ui/error-message";

interface TripFormProps {
  defaultTrip?: Trip | null;
  onSubmit: (tripData: TripFormOutput, isEdit: boolean) => Promise<void>;
  isEdit: boolean;
}

const TripForm: React.FC<TripFormProps> = ({
  defaultTrip = null,
  onSubmit,
  isEdit,
}) => {
  // Define the input type for useForm
  const methods = useForm<TripFormInput>({
    resolver: zodResolver(tripSchema),
    defaultValues: defaultTrip
      ? {
        name: defaultTrip.name,
        description: defaultTrip.description || "",
        type: defaultTrip.type,
        difficulty: defaultTrip.difficulty,
        duration: defaultTrip.duration,
        cost: defaultTrip.cost,
        groupSize: defaultTrip.groupSize,
        activityLevel: defaultTrip.activityLevel,
        location: {
          mainLocation: defaultTrip.location.mainLocation,
          pointsOfInterest: defaultTrip.location.pointsOfInterest.length > 0 ? defaultTrip.location.pointsOfInterest : [""],
        },
        schedule: {
          dates:
            defaultTrip.schedule.dates.length > 0
              ? defaultTrip.schedule.dates.map((date) => ({
                ...date,
                startDate: new Date(date.startDate).toISOString().split("T")[0],
                endDate: new Date(date.endDate).toISOString().split("T")[0],
              }))
              : [
                {
                  startDate: "",
                  endDate: "",
                  isAvailable: true,
                  slotsRemaining: 10,
                },
              ],
          itinerary: defaultTrip.schedule.itinerary || [],
        },
        logistics: defaultTrip.logistics,
        images: defaultTrip.images?.join(", ") || "",
      }
      : {
        name: "",
        description: "",
        type: "hiking",
        difficulty: "easy",
        duration: { days: 1, nights: 0 },
        cost: { basePrice: 0, discount: 0 },
        groupSize: { min: 1, max: 10 },
        activityLevel: 1,
        location: {
          mainLocation: "",
          pointsOfInterest: [""],
        },
        schedule: {
          dates: [
            {
              startDate: "",
              endDate: "",
              isAvailable: true,
              slotsRemaining: 10,
            },
          ],
          itinerary: [],
        },
        logistics: {
          transportation: "",
          gearProvided: false,
          accommodation: "",
        },
        images: "",
      },
  });

  const {
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting, errors },
  } = methods;

  const onFormSubmit: SubmitHandler<TripFormInput> = async (data) => {
    try {
      // Transform the input data to output data using Zod
      const validatedData: TripFormOutput = tripSchema.parse(data);
      await onSubmit(validatedData, isEdit);
      reset();
    } catch (error: any) {
      // Handle submission errors if necessary
      console.error("Form submission error:", error);
    }
  };

  useEffect(() => {
    if (defaultTrip) {
      reset({
        name: defaultTrip.name,
        description: defaultTrip.description || "",
        type: defaultTrip.type,
        difficulty: defaultTrip.difficulty,
        duration: defaultTrip.duration,
        cost: defaultTrip.cost,
        groupSize: defaultTrip.groupSize,
        activityLevel: defaultTrip.activityLevel,
        location: {
          mainLocation: defaultTrip.location.mainLocation,
          pointsOfInterest: defaultTrip.location.pointsOfInterest.length > 0 ? defaultTrip.location.pointsOfInterest : [""],
        },
        schedule: {
          dates:
            defaultTrip.schedule.dates.length > 0
              ? defaultTrip.schedule.dates.map((date) => ({
                ...date,
                startDate: new Date(date.startDate).toISOString().split("T")[0],
                endDate: new Date(date.endDate).toISOString().split("T")[0],
              }))
              : [
                {
                  startDate: "",
                  endDate: "",
                  isAvailable: true,
                  slotsRemaining: 10,
                },
              ],
          itinerary: defaultTrip.schedule.itinerary || [],
        },
        logistics: defaultTrip.logistics,
        images: defaultTrip.images?.join(", ") || "",
      });
    }
  }, [defaultTrip, reset]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Basic Information */}
        <BasicInfoSection />

        {/* Type and Difficulty */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Type */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="type">Type</Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => field.onChange(value)}
                  value={field.value}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select trip type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Trip Types</SelectLabel>
                      {typeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && (
              <ErrorMessage message={errors.type.message} />
            )}
          </div>

          {/* Difficulty */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="difficulty">Difficulty</Label>
            <Controller
              name="difficulty"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => field.onChange(value)}
                  value={field.value}
                >
                  <SelectTrigger id="difficulty">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Difficulty Levels</SelectLabel>
                      {difficultyOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.difficulty && (
              <ErrorMessage message={errors.difficulty.message} />
            )}
          </div>
        </div>

        {/* Duration */}
        <DurationSection />

        {/* Cost */}
        <CostSection />

        {/* Group Size */}
        <GroupSizeSection />

        {/* Activity Level */}
        <ActivityLevelSection />

        {/* Location */}
        <LocationSection />

        {/* Schedule */}
        <ScheduleSection />

        {/* Logistics */}
        <LogisticsSection />

        {/* Images */}
        <ImagesSection />

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            type="button"
            onClick={() => methods.reset()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isEdit ? "Save Changes" : "Create Trip"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default TripForm;
