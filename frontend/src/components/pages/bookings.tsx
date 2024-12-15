import React, { useState } from "react";
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
  bookingType: z.enum(["Group", "Private"]),
  groupSize: z
    .number()
    .positive("Group size must be greater than zero")
    .optional()
    .refine((value) => value !== undefined || true, "Group size is required for private bookings"),
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
      bookingType: "Group",
      groupSize: undefined,
      preferences: "",
    },
  });

  const [bookingType, setBookingType] = useState<"Group" | "Private">("Group");

  const calculateTotalPrice = () => {
    const { startDate, endDate, groupSize, bookingType } = form.getValues();
    if (startDate && endDate) {
      const nights = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (nights > 0) {
        const basePrice = nights * 299;
        if (bookingType === "Private") {
          const additionalFee = (groupSize || 1) * 50; // Additional fee per person
          return basePrice + additionalFee;
        }
        return basePrice;
      }
    }
    return 0;
  };

  const onSubmit = (data: BookingFormValues) => {
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <div className="container mx-auto p-6 mt-16">
      {/* Hero Section */}
      <div
        className="relative h-64 bg-cover bg-center rounded-lg"
        style={{ backgroundImage: "url('/path/to/hero-image.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-white text-4xl font-bold">Camp Your Adventure</h1>
        </div>
      </div>

      {/* Booking Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        {/* Package Details */}
        {/* Package Details */}
        <div className="col-span-2 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Private Camping Adventure 🏕️</h2>
          <p className="text-gray-600 mb-4">
            Escape to the Rockies for a custom camping experience! 🌲 Perfect for solo travelers, couples, or small groups who want nature, peace, and a sprinkle of adventure. 🌟
          </p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="font-semibold">🌍 Location</h3>
              <p>Rocky Mountains, Canada</p>
            </div>
            <div>
              <h3 className="font-semibold">💸 Cost</h3>
              <p>$299/night</p>
            </div>
          </div>

          <h3 className="font-semibold">What’s Included? 🎒</h3>
          <ul className="list-disc ml-4 mb-4">
            <li>🏞️ Guided hikes</li>
            <li>🍲 Yummy camp meals</li>
            <li>⛺ Premium gear</li>
          </ul>

          <p className="text-gray-600">
            ✨ Ready for starry skies, campfire laughs, and unforgettable moments? Let’s make it happen! 🎉
          </p>
        </div>


        {/* Booking Form */}
        <div className="col-span-1 bg-gray-100 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">Book This Adventure</h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your name"
                        className="bg-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        className="bg-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your phone number"
                        className="bg-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <DatePicker
                          selected={field.value}
                          onChange={field.onChange}
                          placeholderText="Select start date"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <DatePicker
                          selected={field.value}
                          onChange={field.onChange}
                          placeholderText="Select end date"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="bookingType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Booking Type</FormLabel>
                    <select
                      className="w-full bg-white border border-gray-300 rounded-lg p-2"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setBookingType(e.target.value as "Group" | "Private");
                      }}
                    >
                      <option value="Group">Group Booking</option>
                      <option value="Private">Private Booking</option>
                    </select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {bookingType === "Private" && (
                <FormField
                  control={form.control}
                  name="groupSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Group Size</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter group size"
                          className="bg-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="preferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferences</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter preferences (optional)"
                        className="bg-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="text-right">
                <p className="text-lg">
                  Total Price:{" "}
                  <span className="font-bold text-green-500">
                    ${calculateTotalPrice()}
                  </span>
                </p>
              </div>

              <Button type="submit" className="w-full py-2 bg-green-600 text-white">
                Confirm Booking
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
