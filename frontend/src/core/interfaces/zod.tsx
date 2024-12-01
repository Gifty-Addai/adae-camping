import { z } from "zod";

export const bookingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().optional(),
  phone: z
    .string()
    .regex(/^\d+$/, "Phone number must contain only digits")
    .min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(5,"Provide detail address"),
  preferences: z.string().optional(),
});

