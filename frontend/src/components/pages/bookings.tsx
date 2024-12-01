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
      {/* Hero Section */}
      <div
        className="relative h-64 bg-cover bg-center rounded-lg"
        style={{
          backgroundImage: "url('/path/to/hero-image.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-white text-4xl font-bold">Camp Your Adventure</h1>
        </div>
      </div>

      {/* Booking Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        {/* Package Details */}
        <div className="col-span-2 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Camping in the Rockies</h2>
          <p className="text-gray-600 mb-4">
            Experience a night under the stars in the stunning Rockies. Enjoy guided hikes,
            campfires, and unforgettable moments in nature.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="font-semibold">Destination</h3>
              <p>Rocky Mountains, Canada</p>
            </div>
            <div>
              <h3 className="font-semibold">Price per Night</h3>
              <p>$299</p>
            </div>
            <div>
              <h3 className="font-semibold">Included</h3>
              <ul className="list-disc ml-4">
                <li>Guided Hikes</li>
                <li>Meals</li>
                <li>Camping Gear</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Not Included</h3>
              <ul className="list-disc ml-4">
                <li>Travel Insurance</li>
                <li>Transportation to Base</li>
              </ul>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-2">Gallery</h3>
          <div className="grid grid-cols-3 gap-2">
            <img src="/path/to/image1.jpg" alt="Gallery Image 1" className="rounded-lg" />
            <img src="/path/to/image2.jpg" alt="Gallery Image 2" className="rounded-lg" />
            <img src="/path/to/image3.jpg" alt="Gallery Image 3" className="rounded-lg" />
          </div>
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