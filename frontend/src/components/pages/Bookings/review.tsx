// src/components/booking/ReviewConfirm.tsx
import React from "react";
import { BookingFormData, Trip, TripDate } from "@/core/interfaces";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MapPin, Calendar, User, Package } from "lucide-react";
import { useBookingAPI } from "@/hooks/api.hook";

interface ReviewConfirmProps {
  formData: BookingFormData;
  trip: Trip | null | undefined;
  selectedDate: TripDate | undefined;
}

const ReviewConfirm: React.FC<ReviewConfirmProps> = ({ formData, trip, selectedDate }) => {
  if (!trip || !selectedDate) return null;

  const {loading, addBooking} = useBookingAPI()

  const startDateFormatted = format(parseISO(selectedDate.startDate), "MMM d, yyyy");
  const endDateFormatted = format(parseISO(selectedDate.endDate), "MMM d, yyyy");

  const basePrice = trip.cost.basePrice;
  const tripDiscount = trip.cost.discount;
  // const discount = trip.cost.discount ?? 0;
  const discount = 0;
  const finalPrice = basePrice + tripDiscount;

  const fullName = `${formData.personalInfo.firstName} ${formData.personalInfo.lastName}`.trim();

  return (
    <div className="max-w-5xl mx-auto my-8 px-4 space-y-8">
      {/* Header / Hero Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-card-foreground">Confirm Your Adventure</h1>
          <p className="text-muted-foreground text-sm max-w-md">
            You’re just one step away from an unforgettable experience.
            Let’s double-check your details and get you set for takeoff!
          </p>
        </div>
        {trip.images && trip.images[0] && (
          <div className="w-full md:w-auto md:flex-shrink-0">
            <img
              src={trip.images[0]}
              alt={trip.name}
              className="w-full md:w-64 h-40 object-cover rounded-md border"
            />
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Personal & Travel Details */}
        <div className="flex-1 space-y-8">
          <Card className="border">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-card-foreground flex items-center gap-2">
                <User color="yellow" className="w-5 h-5 text-muted-foreground" />
                Personal Information
              </h2>
              <div className="space-y-2 text-sm">
                <p className="text-card-foreground"><span className="font-medium text-muted-foreground">Name:</span > {fullName}</p>
                <p className="text-card-foreground"><span className="font-medium text-muted-foreground">Email:</span > {formData.personalInfo.email}</p>
                <p className="text-card-foreground"><span className="font-medium text-muted-foreground">Phone:</span > {formData.personalInfo.phone}</p>
                {formData.personalInfo.notParticipating && (
                  <p className="text-xs text-orange-600 mt-2">
                    (You’re not joining us in the fun? Don’t worry—we’ll send postcards!)
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-card-foreground flex items-center gap-2">
                <Calendar color="yellow" className="w-5 h-5 text-muted-foreground" />
                Travel Details
              </h2>
              <div className="space-y-2 text-sm">
                <p className="text-card-foreground">
                  <span className="font-medium text-muted-foreground">Date of Birth: </span>{" "}
                  {formData.travelDetails.dob
                    ? format(formData.travelDetails.dob, "dd/MM/yyyy")
                    : "N/A"}
                </p>
                <p className="text-card-foreground"><span className="font-medium text-muted-foreground">Gender: </span> {formData.travelDetails.gender}</p>
                <p className="text-card-foreground">
                  <span className="font-medium  text-muted-foreground">Address: </span>{" "}
                  {formData.travelDetails.streetAddress}
                  {formData.travelDetails.address2 && `, ${formData.travelDetails.address2}`},{" "}
                  {formData.travelDetails.city}, {formData.travelDetails.zipCode}
                </p>
                <p className="text-card-foreground">
                  <span className="font-medium text-muted-foreground">Trip Dates: </span> {startDateFormatted} – {endDateFormatted}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Trip & Payment Summary */}
        <div className="w-full lg:w-96 space-y-6">
          <Card className="border ">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-card-foreground flex items-center gap-2">
                <MapPin color="yellow" className="w-5 h-5 text-muted-foreground" />
                Your {trip.type} Adventure
              </h2>
              <div className="space-y-2 text-sm">
                <p className="text-card-foreground"><span className="font-medium text-muted-foreground">Trip Name:</span> {trip.name}</p>
                <p className="text-card-foreground"><span className="font-medium text-muted-foreground">Duration:</span> {trip.duration.days} days</p>
                <p className="text-card-foreground"><span className="font-medium text-muted-foreground">Group Size:</span> {trip.groupSize.min} - {trip.groupSize.max}</p>
                <p className="text-card-foreground"><span className="font-medium text-muted-foreground">Activity Level:</span> {trip.activityLevel}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-card-foreground flex items-center gap-2">
                <Package color="yellow" className="w-5 h-5 text-muted-foreground" />
                Payment Summary
              </h2>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base Price</span>
                  <span className="text-card-foreground">GHS {basePrice}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="text-card-foreground">- GHS {discount}</span>
                </div>

                <Separator className="my-" />
                <div className="flex justify-between font-semibold text-card-foreground">
                  <span className="text-muted-foreground mb-3">Total</span>
                  <span className="text-primary font-bold text-base">GHS {finalPrice}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  (No hidden fees, no surprises—just pure adventure!)
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="bg-card p-4 rounded-md text-center">
            <p className="text-sm text-muted-foreground mb-3">
              If everything looks good, let’s finalize your booking and start counting down the days!
            </p>
            <Button disabled={loading} variant="default" size="lg" className="w-full" onClick={() => { 
              addBooking({ ...formData, tripId: trip._id, selectedDate: selectedDate._id , numberOfPeople:1})
              console.log("formData", ) }}>
              Confirm & Proceed to Payment
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              By confirming, you’re embracing memories, stories, and maybe a mosquito bite or two.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewConfirm;
