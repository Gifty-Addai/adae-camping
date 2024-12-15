// src/components/AdminDash/pages/trip/TripForm.tsx

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import * as z from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trip, TripFormData } from "@/core/interfaces";

interface TripFormProps {
  defaultTrip?: Trip | null;
  onSubmit: (tripData: TripFormData, isEdit: boolean) => Promise<void>;
  isEdit: boolean;
}

const TripForm: React.FC<TripFormProps> = ({ defaultTrip, onSubmit, isEdit }) => {
  /* Define Zod schema for TripFormData */
  const tripSchema = z.object({
    name: z.string().min(1, "Trip name is required"),
    description: z.string().optional(),
    type: z.string().min(1, "Type is required"),
    difficulty: z.string().min(1, "Difficulty is required"),
    duration: z.object({
      days: z.number().min(1, "Duration must be at least 1 day"),
      nights: z.number().min(0, "Nights cannot be negative"),
    }),
    cost: z.object({
      basePrice: z.number().min(0, "Base price cannot be negative"),
      discount: z.number().min(0, "Discount cannot be negative"),
    }),
    location: z.object({
      mainLocation: z.string().min(1, "Main location is required"),
      pointsOfInterest: z.array(z.string()).default([]),
    }),
    schedule: z.object({
      startDate: z.string().min(1, "Start date is required"),
      endDate: z.string().min(1, "End date is required"),
      itinerary: z
        .array(
          z.object({
            day: z.number(),
            activities: z.string(),
            _id: z.string(),
          })
        )
        .default([]), // Ensured to always be an array
    }),
    logistics: z.object({
      transportation: z.string().min(1, "Transportation is required"),
      gearProvided: z.boolean(),
      accommodation: z.string().min(1, "Accommodation is required"),
    }),
    images: z.array(z.string()).optional(),
  });

  type TripFormSchema = z.infer<typeof tripSchema>;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TripFormSchema>({
    resolver: zodResolver(tripSchema),
    defaultValues: defaultTrip
      ? {
          name: defaultTrip.name,
          description: defaultTrip.description || "",
          type: defaultTrip.type || "",
          difficulty: defaultTrip.difficulty || "",
          duration: defaultTrip.duration || { days: 1, nights: 0 },
          location: {
            mainLocation: defaultTrip.location?.mainLocation || "",
            pointsOfInterest: defaultTrip.location?.pointsOfInterest || [],
          },
          cost: defaultTrip.cost || { basePrice: 0, discount: 0 },
          schedule: defaultTrip.schedule || { startDate: "", endDate: "", itinerary: [] },
          logistics:
            defaultTrip.logistics || { transportation: "", gearProvided: false, accommodation: "" },
          images: defaultTrip.images || [],
        }
      : {
          name: "",
          description: "",
          type: "",
          difficulty: "",
          duration: { days: 1, nights: 0 },
          location: {
            mainLocation: "",
            pointsOfInterest: [],
          },
          cost: { basePrice: 0, discount: 0 },
          schedule: { startDate: "", endDate: "", itinerary: [] },
          logistics: { transportation: "", gearProvided: false, accommodation: "" },
          images: [],
        },
  });

  const onFormSubmit: SubmitHandler<TripFormSchema> = async (data) => {
    try {
      await onSubmit(data, isEdit);
      reset();
    } catch (error: any) {
      // Handle submission errors if necessary
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <div className="grid gap-4 py-4">
        {/* Trip Name */}
        <div className="flex flex-col space-y-2">
          <Label htmlFor="name">Trip Name</Label>
          <Input id="name" {...register("name")} />
          {errors.name && <span className="text-red-500">{errors.name.message}</span>}
        </div>

        {/* Description */}
        <div className="flex flex-col space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" {...register("description")} rows={4} />
          {errors.description && (
            <span className="text-red-500">{errors.description.message}</span>
          )}
        </div>

        {/* Type and Difficulty */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Type */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="type">Type</Label>
            <Input id="type" {...register("type")} />
            {errors.type && <span className="text-red-500">{errors.type.message}</span>}
          </div>
          {/* Difficulty */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="difficulty">Difficulty</Label>
            <Input id="difficulty" {...register("difficulty")} />
            {errors.difficulty && (
              <span className="text-red-500">{errors.difficulty.message}</span>
            )}
          </div>
        </div>

        {/* Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Duration Days */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="duration.days">Duration (days)</Label>
            <Input
              type="number"
              id="duration.days"
              {...register("duration.days", { valueAsNumber: true })}
              min={1}
            />
            {errors.duration?.days && (
              <span className="text-red-500">{errors.duration.days.message}</span>
            )}
          </div>
          {/* Duration Nights */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="duration.nights">Duration (nights)</Label>
            <Input
              type="number"
              id="duration.nights"
              {...register("duration.nights", { valueAsNumber: true })}
              min={0}
            />
            {errors.duration?.nights && (
              <span className="text-red-500">{errors.duration.nights.message}</span>
            )}
          </div>
        </div>

        {/* Cost */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Base Price */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="cost.basePrice">Base Price</Label>
            <Input
              type="number"
              id="cost.basePrice"
              {...register("cost.basePrice", { valueAsNumber: true })}
              min={0}
            />
            {errors.cost?.basePrice && (
              <span className="text-red-500">{errors.cost.basePrice.message}</span>
            )}
          </div>
          {/* Discount */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="cost.discount">Discount</Label>
            <Input
              type="number"
              id="cost.discount"
              {...register("cost.discount", { valueAsNumber: true })}
              min={0}
            />
            {errors.cost?.discount && (
              <span className="text-red-500">{errors.cost.discount.message}</span>
            )}
          </div>
        </div>

        {/* Schedule */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Start Date */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="schedule.startDate">Start Date</Label>
            <Input type="date" id="schedule.startDate" {...register("schedule.startDate")} />
            {errors.schedule?.startDate && (
              <span className="text-red-500">{errors.schedule.startDate.message}</span>
            )}
          </div>
          {/* End Date */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="schedule.endDate">End Date</Label>
            <Input type="date" id="schedule.endDate" {...register("schedule.endDate")} />
            {errors.schedule?.endDate && (
              <span className="text-red-500">{errors.schedule.endDate.message}</span>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="flex flex-col space-y-2">
          <Label htmlFor="location.mainLocation">Main Location</Label>
          <Input id="location.mainLocation" {...register("location.mainLocation")} />
          {errors.location?.mainLocation && (
            <span className="text-red-500">{errors.location.mainLocation.message}</span>
          )}
        </div>

        {/* Logistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Transportation */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="logistics.transportation">Transportation</Label>
            <Input id="logistics.transportation" {...register("logistics.transportation")} />
            {errors.logistics?.transportation && (
              <span className="text-red-500">{errors.logistics.transportation.message}</span>
            )}
          </div>
          {/* Gear Provided */}
          <div className="flex items-center space-x-2">
            <Label htmlFor="logistics.gearProvided">Gear Provided</Label>
            <input
              type="checkbox"
              id="logistics.gearProvided"
              {...register("logistics.gearProvided")}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
          </div>
        </div>

        {/* Accommodation */}
        <div className="flex flex-col space-y-2">
          <Label htmlFor="logistics.accommodation">Accommodation</Label>
          <Input id="logistics.accommodation" {...register("logistics.accommodation")} />
          {errors.logistics?.accommodation && (
            <span className="text-red-500">{errors.logistics.accommodation.message}</span>
          )}
        </div>

        {/* Images */}
        <div className="flex flex-col space-y-2">
          <Label htmlFor="images">Images (comma-separated URLs)</Label>
          <Input
            id="images"
            {...register("images")}
            defaultValue={defaultTrip ? defaultTrip.images?.join(", ") : ""}
            onChange={(e) => {
              const urls = e.target.value.split(",").map((url) => url.trim());
              setValue("images", urls);
            }}
            placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
          />
          {errors.images && <span className="text-red-500">{errors.images.message}</span>}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end mt-6 space-x-2">
        <Button variant="outline" type="button" onClick={() => reset()}>
          Cancel
        </Button>
        <Button type="submit">{isEdit ? "Save Changes" : "Create Trip"}</Button>
      </div>
    </form>
  );
};

export default TripForm;
