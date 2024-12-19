import React, { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Trip, TripDate, BookingFormData, ConfirmMembershipResponse } from "@/core/interfaces";
import { format, parseISO } from "date-fns";
import { useUserAPI } from "@/hooks/api.hook";
import BookConfirmModal from "./BookingComponents/confirm.personal.modal";

interface PersonalInfoProps {
  trip: Trip | null;
  selectedDate: TripDate | undefined;
  updateData: (data: Partial<BookingFormData["personalInfo"]>) => void;
  nextStep: () => void;
  data: BookingFormData["personalInfo"];
}

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  idCard: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\d{10,15}$/, "Phone number must be between 10 and 15 digits"),
  notParticipating: z.boolean(),
});

const PersonalInfo: React.FC<PersonalInfoProps> = ({
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
  
  const { loading, confirmMembership } = useUserAPI();
  const [confirmData, setConfirmData] = useState<ConfirmMembershipResponse | null>(null);
  const [showModal, setShowModal] = useState(false);

  const onSubmit = async (values: BookingFormData["personalInfo"]) => {
    const membershipResult = await confirmMembership(
      `${values.firstName} ${values.lastName}`,
      values.email,
      values.phone
    );
    setConfirmData(membershipResult || null);
    updateData(values);
    setShowModal(true);
  };

  const handleApplyMembershipDiscount = () => {
    // If needed, update formData or state to apply discount
    // For now, just proceed to next step
    setShowModal(false);
    nextStep();
  };

  const handleContinueWithoutDiscount = () => {
    setShowModal(false);
    nextStep();
  };

  return (
    <div className="flex flex-col lg:mx-24 lg:flex-row justify-between items-start gap-8">
      {/* Left: Personal Info Form */}
      <div className="w-full lg:w-2/3">
        <h2 className="text-2xl text-card-foreground font-semibold mb-4">
          Unlock the member discount
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* First Name */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-card-foreground">First name *</FormLabel>
                  <FormControl>
                    <Input placeholder="First Name" {...field} className="lg:w-64" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Last Name */}
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-card-foreground">Last name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Last Name" {...field} className="lg:w-64" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-card-foreground">Email *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Email Address"
                      {...field}
                      className="lg:w-64"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ID Card */}
            <FormField
              control={form.control}
              name="idCard"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-card-foreground">ID Card</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ID Card"
                      {...field}
                      className="lg:w-64"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            
            {/* Phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-card-foreground">Phone number *</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="Phone Number" {...field} className="lg:w-64" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Checkbox */}
            <FormField
              control={form.control}
              name="notParticipating"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(!!checked)}
                      id="notParticipating"
                    />
                  </FormControl>
                  <FormLabel htmlFor="notParticipating" className="text-sm text-muted-foreground">
                    I would like to buy this trip but will not be participating
                  </FormLabel>
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button type="submit">
              Continue
            </Button>
          </form>
        </Form>
      </div>

      {/* Right: Trip Card */}
      <div className="w-full lg:w-1/3">
        <Card className="w-70 border shadow-sm rounded-lg p-4">
          <div className="flex items-start gap-4">
            <div className="w-24 h-24 overflow-hidden rounded-md">
              <img
                src={trip?.images[0] || "/default-placeholder.jpg"}
                alt={trip?.name || "Trip Image"}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 space-y-1">
              <h3 className="text-sm font-semibold text-card-foreground leading-tight">
                {trip?.name || "Trip Title"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {selectedDate?.startDate ? (
                  <>
                    {format(parseISO(selectedDate.startDate), "MMM d, yyyy")} –
                    {format(parseISO(selectedDate.endDate), "MMM d, yyyy")}
                  </>
                ) : (
                  <span>No date selected</span>
                )}
              </p>
            </div>
          </div>
          <hr className="border-t border-gray-200 my-3" />
          <CardContent className="space-y-1 p-0">
            <p className="font-medium text-muted-foreground">
              Member price:{" "}
              <span className="font-bold text-sm text-card-foreground">
                GHS {trip ? trip.cost.basePrice - trip.cost.discount : "N/A"}
              </span>
            </p>
            <p className="text-muted-foreground">
              Non-member price:{" "}
              <span className="text-card-foreground">
                GHS {(trip?.cost.basePrice! + trip?.cost.discount!)}
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {showModal && (
        <BookConfirmModal
          loading={loading}
          confirmData={confirmData}
          onClose={() => setShowModal(false)}
          onApplyMembershipDiscount={handleApplyMembershipDiscount}
          onContinueWithoutDiscount={handleContinueWithoutDiscount}
        />
      )}
    </div>
  );
};

export default PersonalInfo;
