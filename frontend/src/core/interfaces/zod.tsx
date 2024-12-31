// src/core/interfaces/zod.ts

import { z, ZodIssueCode } from "zod";
import { differenceInDays, isAfter, isBefore } from "date-fns";

/* -------------------------------------------------------------------------- */
/*                                Booking Schema                               */
/* -------------------------------------------------------------------------- */
export const bookingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(5, " Address must be 5 above characters long"),
  phone: z
    .string()
    .regex(/^\d+$/, "Phone number must contain only digits")
    .min(10, "Phone number must be at least 10 digits"),
  startDate: z.date().nullable().refine((date) => date !== null, "Start date is required"),
  endDate: z.date().nullable().refine((date) => date !== null, "End date is required"),
  bookingType: z.enum(["Group", "Private"]),
  groupSize: z.number().positive("Group size must be greater than zero").optional(),
  preferences: z.string().optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;


export const CartSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  address: z
    .string()
    .regex(
      /^GH-[A-Za-z\s]+-[A-Za-z\s]+$/,
      "Address must follow the pattern GH-Region-City, e.g. GH-Ashanti-Suame"
    )
    .min(5, "Address must be at least 5 characters long"),
  phone: z
    .string()
    .regex(/^\d+$/, "Phone number must contain only digits")
    .min(10, "Phone number must be at least 10 digits"),
  groupSize: z.number().positive("Group size must be greater than zero").optional(),
  preferences: z.string().optional(),
});

/* -------------------------------------------------------------------------- */
/*                          Basic Information Schema                           */
/* -------------------------------------------------------------------------- */
export const basicInfoSchema = z.object({
  name: z.string().min(1, "Trip name is required"),
  description: z.string().min(10, "Trip name is required with 10 characters above"),
});

export type BasicInfoInput = z.infer<typeof basicInfoSchema>;

/* -------------------------------------------------------------------------- */
/*                         Type and Difficulty Schema                          */
/* -------------------------------------------------------------------------- */
export const typeAndDifficultySchema = z.object({
  type: z.enum(["hiking", "camping", "mountaineering", "camping & hiking", "other"]),
  difficulty: z.enum(["easy", "moderate", "hard", "expert"]),
});

export type TypeAndDifficultyInput = z.infer<typeof typeAndDifficultySchema>;

/* -------------------------------------------------------------------------- */
/*                              Duration Schema                                */
/* -------------------------------------------------------------------------- */
export const durationSchema = z.object({
  days: z
    .number({ invalid_type_error: "Duration (days) is required" })
    .min(1, "Duration must be at least 1 day"),
  nights: z
    .number({ invalid_type_error: "Duration (nights) is required" })
    .min(0, "Nights cannot be negative"),
});

export type DurationInput = z.infer<typeof durationSchema>;

/* -------------------------------------------------------------------------- */
/*                                Cost Schema                                  */
/* -------------------------------------------------------------------------- */
export const costSchema = z.object({
  basePrice: z
    .number({ invalid_type_error: "Base price is required" })
    .min(0, "Base price cannot be negative"),
  discount: z
    .number({ invalid_type_error: "Discount is required" })
    .min(0, "Discount cannot be negative"),
});

export type CostInput = z.infer<typeof costSchema>;

/* -------------------------------------------------------------------------- */
/*                           Group Size Schema                                */
/* -------------------------------------------------------------------------- */
export const groupSizeSchema = z.object({
  min: z.number().min(1, "Minimum group size must be at least 1"),
  max: z.number().min(1, "Maximum group size must be at least 1"),
});

export type GroupSizeInput = z.infer<typeof groupSizeSchema>;

/* -------------------------------------------------------------------------- */
/*                          Activity Level Schema                              */
/* -------------------------------------------------------------------------- */
export const activityLevelSchema = z.object({
  activityLevel: z.number().min(1, "Activity level must be at least 1").max(5, "Activity level cannot exceed 5"),
});

export type ActivityLevelInput = z.infer<typeof activityLevelSchema>;

/* -------------------------------------------------------------------------- */
/*                              Location Schema                                */
/* -------------------------------------------------------------------------- */
export const locationSchema = z.object({
  mainLocation: z
    .string()
    .min(1, "Main location is required")
    .max(100, "Main location cannot exceed 100 characters"),
  pointsOfInterest: z
    .array(
      z.object({
        value: z.string().min(1, "Point of interest cannot be empty"),
      })
    )
    .min(1, "At least one point of interest is required"),
});

export type LocationInput = z.infer<typeof locationSchema>;

/* -------------------------------------------------------------------------- */
/*                            Schedule Date Schema                             */
/* -------------------------------------------------------------------------- */
export const scheduleDateSchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  isAvailable: z.boolean(),
  slotsRemaining: z.number().min(0, "Slots remaining cannot be negative"),
}).superRefine((date, ctx) => {

  console.log("Date validation")
  if (isAfter(date.startDate, date.endDate)) {
    ctx.addIssue({
      code: ZodIssueCode.custom,
      path: ["startDate"],
      message: "Start date cannot be after end date",
    });
  }
});

/* -------------------------------------------------------------------------- */
/*                            Itinerary Schema                                 */
/* -------------------------------------------------------------------------- */
export const itinerarySchema = z.object({
  day: z.number().min(1, "Day must be at least 1"),
  activities: z.string().min(1, "Activities are required"),
});

/* -------------------------------------------------------------------------- */
/*                            Schedule Schema                                  */
/* -------------------------------------------------------------------------- */
export const scheduleSchema = z.object({
  dates: z.array(scheduleDateSchema).min(1, "At least one date entry is required"),
  itinerary: z.array(itinerarySchema).optional(),
});

export type ScheduleInput = z.infer<typeof scheduleSchema>;

/* -------------------------------------------------------------------------- */
/*                            Logistics Schema                                 */
/* -------------------------------------------------------------------------- */
export const logisticsSchema = z.object({
  transportation: z.string().min(1, "Transportation is required"),
  gearProvided: z.boolean(),
  accommodation: z.string().min(1, "Accommodation is required"),
});

export type LogisticsInput = z.infer<typeof logisticsSchema>;

/* -------------------------------------------------------------------------- */
/*                               Images Schema                                 */
/* -------------------------------------------------------------------------- */
export const imagesSchema = z
  .array(
    z.object({
      url: z.string().url("Invalid URL format for image"),
    })
  )
  .min(1, "At least one image is required")
  .max(10, "Maximum of 10 images allowed");

export type ImagesInput = z.infer<typeof imagesSchema>;

/* -------------------------------------------------------------------------- */
/*                   Trip Schema with Nested Structures                       */
/*                       (and .superRefine checks)                             */
/* -------------------------------------------------------------------------- */
export const tripSchema = z
  .object({
    basicInfo: basicInfoSchema,
    typeAndDifficulty: typeAndDifficultySchema,
    duration: durationSchema,
    cost: costSchema,
    groupSize: groupSizeSchema,
    activityLevel: activityLevelSchema,
    location: locationSchema,
    schedule: scheduleSchema,
    logistics: logisticsSchema,
    images: imagesSchema,
  })
  .superRefine((data, ctx) => {
    // The trip duration in days

    // Validate each date range
    data.schedule.dates.forEach((date, index) => {
      const start = new Date(date.startDate);
      const end = new Date(date.endDate);
      const actualDuration = differenceInDays(end, start);

      console.log("actualDuration", actualDuration)

      // ----------------------------
      // 1. Start date cannot be after end date
      // ----------------------------
      if (isAfter(start, end)) {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          path: ["schedule", "dates", index, "startDate"],
          message: "Start date cannot be after end date",
        });
      }


      // ----------------------------
      // 3. Check for overlapping dates with other entries
      // ----------------------------
      for (let i = 0; i < data.schedule.dates.length; i++) {
        if (i === index) continue;
        const otherStart = new Date(data.schedule.dates[i].startDate);
        const otherEnd = new Date(data.schedule.dates[i].endDate);

        // Overlap occurs if (start < otherEnd && end > otherStart)
        // or if exact same start/end times
        const isOverlap =
          (isBefore(start, otherEnd) && isAfter(end, otherStart)) ||
          start.getTime() === otherStart.getTime() ||
          end.getTime() === otherEnd.getTime();

        if (isOverlap) {
          ctx.addIssue({
            code: ZodIssueCode.custom,
            path: ["schedule", "dates", index, "startDate"],
            message: "Dates cannot overlap with existing entries",
          });
          break;
        }
      }

      // ----------------------------
      // 4. Ensure slotsRemaining == groupSize.max
      // ----------------------------
      if (date.slotsRemaining !== data.groupSize.max) {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          path: ["schedule", "dates", index, "slotsRemaining"],
          message: `Slots remaining must equal the max group size of ${data.groupSize.max}`,
        });
      }
    });
  });


// This type is the entire shape of a "Trip".
export type TripFormInput = z.infer<typeof tripSchema>;


export const becomeMemberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters."),
  phone: z.string().regex(/^[0-9]{10,15}$/, "Invalid phone number."),
  streetAddress: z.string().optional(),
  address2: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
  dob: z.string().optional(),
  gender: z.enum(["Male", "Female", "Other"]).optional(),
  image: z.string().optional(),
  idCardImages: imagesSchema.min(1, "At least one image is required").max(2, "At most two images is accepted"),

});