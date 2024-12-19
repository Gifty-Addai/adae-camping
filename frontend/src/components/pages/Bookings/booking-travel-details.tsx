import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Trip, TripDate, BookingFormData } from "@/core/interfaces";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface TravelDetailsProps {
  nextStep: () => void;
  trip: Trip | null;
  selectedDate: TripDate | undefined;
  updateData: (data: Partial<BookingFormData["travelDetails"]>) => void;
  data: BookingFormData["travelDetails"];
}

const formSchema = z.object({
  dob: z.date({
    required_error: "Date of birth is required",
    invalid_type_error: "Please select a valid date of birth"
  }).refine((date) => {
    const today = new Date();
    return date <= today;
  }, {
    message: "Date of birth cannot be in the future",
  }),
  gender: z.string().min(1, "Gender is required"),
  streetAddress: z.string().min(1, "Street address is required"),
  address2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  zipCode: z.string().min(1, "Zip Code is required"),
});

const TravelDetails: React.FC<TravelDetailsProps> = ({
  trip,
  selectedDate,
  nextStep,
  updateData,
  data
}) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: data,
  });

  const onSubmit = (values: BookingFormData["travelDetails"]) => {
    updateData(values);
    console.log("Form Submitted:", values);
    nextStep(); 
  };

  return (
    <div className="flex flex-col lg:mx-24 lg:flex-row justify-between items-start gap-8">
      {/* Left: Travel Details Form */}
      <div className="lg:w-2/3">
        <h2 className="text-2xl text-card-foreground font-semibold mb-4">
          Traveller information
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* DOB with React DatePicker */}
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-1">
                  <FormLabel className="mb-3 text-card-foreground">Date of Birth *</FormLabel>
                  <FormControl>
                    <DatePicker
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      maxDate={new Date()}
                      placeholderText="Date of birth"
                      className="lg:w-64 bg-card w-full text-white border rounded px-2 py-1 block"
                      dateFormat="dd/MM/yyyy"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="scroll"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({}) => (
                <FormItem>
                  <FormLabel className="text-card-foreground">Gender *</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => form.setValue("gender", value)}
                      value={form.watch("gender")}
                    >
                      <SelectTrigger className="lg:w-64 ">
                        <SelectValue placeholder="Select a gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Gender</SelectLabel>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="streetAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-card-foreground">Street Address *</FormLabel>
                  <FormControl>
                    <Input placeholder="Street Address" {...field} className="lg:w-64" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-card-foreground">Address 2</FormLabel>
                  <FormControl>
                    <Input placeholder="Address 2" {...field} className="lg:w-64" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-card-foreground">City *</FormLabel>
                  <FormControl>
                    <Input placeholder="City" {...field} className="lg:w-64" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-card-foreground">Zip Code *</FormLabel>
                  <FormControl>
                    <Input placeholder="Zip Code" {...field} className="lg:w-64" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full lg:w-64">
              Continue
            </Button>
          </form>
        </Form>
      </div>

      {/* Right: Trip Card */}
      <div className="w-full lg:w-1/3">
        <Card className="lg:w-70 w-full border shadow-sm rounded-lg">
          <CardContent className="p-4 space-y-2">
            <Label className="text-sm font-semibold text-card-foreground leading-snug">
              {trip?.name || "Trip Title"}
            </Label>
            <p className="text-xs text-gray-500">
              {selectedDate ? format(new Date(selectedDate.startDate), "MMM d, yyyy") : "N/A"} –{" "}
              {selectedDate ? format(new Date(selectedDate.endDate), "MMM d, yyyy") : "N/A"}
            </p>
            <hr className="border-t border-gray-600 my-2" />
            <Label className="font-medium text-muted-foreground">
              Total:{" "}
              <span className="font-extrabold text-lg text-card-foreground">
                GHS {trip?.cost.basePrice! + trip?.cost.discount!}
              </span>
            </Label>
            <hr className="border-t border-gray-600 my-2" />
            <Label className="text-muted-foreground">
              Non Member price:{" "}
              <span className="text-card-foreground">
                GHS {trip?.cost.basePrice! + trip?.cost.discount!}
              </span>
            </Label>
            <hr className="border-t border-gray-600 my-2" />
            <Label className="text-muted-foreground">
              Payment due today:{" "}
              <span className="text-card-foreground">
                GHS {trip?.cost.basePrice! + trip?.cost.discount!}
              </span>
            </Label>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TravelDetails;
