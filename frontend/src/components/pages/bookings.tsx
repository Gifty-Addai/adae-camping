import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DatePicker from "@/components/ui/date-picker";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const bookingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(/^\d+$/, "Phone number must contain only digits")
    .min(10, "Phone number must be at least 10 digits"),
  startDate: z.date().nullable().refine((date) => date !== null, "Start date is required"),
  endDate: z.date().nullable().refine((date) => date !== null, "End date is required"),
  preferences: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

const BookingPage: React.FC = () => {
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      startDate: undefined,
      endDate: undefined,
      preferences: "",
    },
  });

  const calculateTotalPrice = () => {
    const { startDate, endDate } = form.getValues();
    if (startDate && endDate) {
      const nights = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      return nights > 0 ? nights * 299 : 0;
    }
    return 0;
  };

  const onSubmit = (data: BookingFormValues) => {
    alert(JSON.stringify(data, null, 2)); // Replace with actual API call
  };

  return (
    <div className="container mx-auto p-6 mt-16">

      {/* Booking Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        {/* Package Details */}
        <div className="col-span-2 bg-white rounded-lg shadow-lg p-6"></div>

        {/* Booking Form */}
        <div className="col-span-1 bg-gray-100 rounded-lg shadow-lg p-6"></div>
      </div>
    </div>
  );
};

export default BookingPage;
