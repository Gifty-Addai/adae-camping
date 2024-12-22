import { z } from "zod";

export const bookingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid Email"),
  phone: z
    .string()
    .regex(/^\d+$/, "Phone number must contain only digits")
    .min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(5,"Provide detail address"),
  preferences: z.string().optional(),
});


export const tripSchema = z.object({
  name: z.string().min(1, "Trip name is required"),
  description: z.string().optional(),
  type: z.enum(["hiking", "camping", "mountaineering", "other"]),
  difficulty: z.enum(["easy", "moderate", "hard", "expert"]),
  duration: z.object({
    days: z
      .number({ invalid_type_error: "Duration (days) is required" })
      .min(1, "Duration must be at least 1 day"),
    nights: z
      .number({ invalid_type_error: "Duration (nights) is required" })
      .min(0, "Nights cannot be negative"),
  }),
  cost: z.object({
    basePrice: z
      .number({ invalid_type_error: "Base price is required" })
      .min(0, "Base price cannot be negative"),
    discount: z
      .number({ invalid_type_error: "Discount is required" })
      .min(0, "Discount cannot be negative"),
  }),
  groupSize: z.object({
    min: z.number().min(1, "Minimum group size must be at least 1"),
    max: z.number().min(1, "Maximum group size must be at least 1"),
  }),
  activityLevel: z
    .number()
    .min(1, "Activity level must be at least 1")
    .max(5, "Activity level cannot exceed 5"),
  location: z.object({
    mainLocation: z.string().min(1, "Main location is required"),
    pointsOfInterest: z
      .array(z.string().min(1, "Point of interest cannot be empty"))
      .min(1, "At least one point of interest is required"),
  }),
  schedule: z.object({
    dates: z
      .array(
        z.object({
          startDate: z.string().min(1, "Start date is required"),
          endDate: z.string().min(1, "End date is required"),
          isAvailable: z.boolean().default(true),
          slotsRemaining: z.number().min(0).default(10),
          _id: z.string().optional(),
        })
      )
      .min(1, "At least one trip date is required"),
    itinerary: z
      .array(
        z.object({
          day: z.number(),
          activities: z.string().min(1, "Activities cannot be empty"),
          _id: z.string().optional(),
        })
      )
      .default([]),
  }),
  logistics: z.object({
    transportation: z.string().min(1, "Transportation is required"),
    gearProvided: z.boolean(),
    accommodation: z.string().min(1, "Accommodation is required"),
  }),
  images: z
    .string()
    .optional()
    .transform((val) =>
      val
        ? val
            .split(",")
            .map((url) => url.trim())
            .filter((url) => url.length > 0)
        : []
    ),
});

export type TripFormInput = z.input<typeof tripSchema>;  
export type TripFormOutput = z.output<typeof tripSchema>; 