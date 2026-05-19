import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { useParams } from "react-router-dom";
import { useBookingAPI } from "@/hooks/booking.hook";
import { Booking } from "@/core/interfaces";
import { Timeline } from "@/components/ui/timeline";
import { useMailAPI } from "@/hooks/api.hook";

const BookingDetailPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const { loading, getBookingById, editBooking } = useBookingAPI();
  const { bookingConfirm, bookingCancel } = useMailAPI()


  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (bookingId) {
        const data = await getBookingById(bookingId);
        setBooking(data);
      }
    };
    fetchBookingDetails();
  }, [bookingId]);

  const statusStyles: Record<
    string,
    "secondary" | "default" | "destructive" | "outline"
  > = {
    pending: "secondary",
    confirmed: "default",
    cancelled: "destructive",
    reschedule: "outline",
  };

  const timelineEvents = booking
    ? [
      {
        date: "2024-01-01",
        title: "Booking Created",
        description: `Created by ${booking.user?.name || "Unknown"}`,
      },
      {
        date: "2024-01-15",
        title: "Payment Received",
        description: "Full payment received.",
      },
      {
        date: "2024-02-01",
        title: "Booking Confirmed",
        description: "The booking is now confirmed.",
      },
    ]
    : [];

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-card-foreground">Booking Details</h1>
        <div className="flex space-x-4">
          <Badge variant={statusStyles[booking?.status || "pending"]}>
            {booking?.status?.charAt(0).toUpperCase()! + booking?.status?.slice(1)}
          </Badge>
          <Button variant={"outline"}>Reschedule</Button>
        </div>
      </div>

      {loading ? (
        <div className="p-4 text-center bg-yellow-400 text-black rounded-lg">
          Loading booking details...
        </div>
      ) : booking ? (
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Trip Details */}
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-bold text-yellow-400">Trip Details</h2>
                </CardHeader>
                <CardContent className="px-4">
                  <p className="text-lg font-semibold text-card-foreground">{booking.trip?.name || "N/A"}</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    {booking.trip?.description || "No description available."}
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Duration</Label>
                      <p className="text-base text-muted-foreground">
                        {booking.trip?.duration?.days || 0} days,{" "}
                        {booking.trip?.duration?.nights || 0} nights
                      </p>
                    </div>
                    <div>
                      <Label className="text-card-foreground">Cost</Label>
                      <p className="text-base text-muted-foreground">
                        GHS {booking.trip?.cost?.basePrice?.toFixed(2) || "0.00"}
                        {booking.trip?.cost?.discount > 0 && (
                          <span className="text-green-500">
                            {" "}
                            (Discount: {booking.trip.cost.discount}%)
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="mt-3">
                  <Button variant="secondary">View Full Itinerary</Button>
                </CardFooter>
              </Card>

              {/* Booking Details */}
              <Card className="px-4">
                <CardHeader>
                  <h2 className="text-xl font-bold text-yellow-400">Booking Details</h2>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-y-4">
                    <div>
                      <Label className="text-white">Customer Name</Label>
                      <p className="text-base text-muted-foreground font-medium">
                        {booking.user?.name || "Unknown"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-white">Email</Label>
                      <p className="text-base text-muted-foreground font-medium">
                        {booking.user?.email || "N/A"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-white">Phone</Label>
                      <p className="text-base text-muted-foreground font-medium">
                        {booking.user?.phone || "N/A"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-white">Guests</Label>
                      <p className="text-base text-muted-foreground font-medium">{booking.numberOfPeople || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <h2 className="text-xl text-yellow-400 font-bold">Payment Details</h2>
              </CardHeader>
              <CardContent className="px-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Payment Status</Label>
                    <p
                      className={`text-base font-medium ${booking.payment ? "text-green-600" : "text-red-600"
                        }`}
                    >
                      {booking.payment ? "Paid" : "Unpaid"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-white">Amount</Label>
                    <p className="text-base text-muted-foreground font-medium">
                      GHS {booking.trip?.cost?.basePrice?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Verify Payment</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="timeline">
            <Timeline events={timelineEvents} />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="p-4 text-center bg-red-50 text-red-600 rounded-lg">
          Booking not found.
        </div>
      )}

      {/* Floating Actions */}
      <div className="fixed bottom-4 right-4 flex space-x-4">
        <Button variant="destructive" onClick={async () => {
          await bookingCancel(bookingId!);

          await editBooking(bookingId!, {
            status: "cancelled",
          })
        }}>Cancel Booking</Button>
        <Button disabled={booking?.status === "confirmed"} variant="default" onClick={async () => {
          await bookingConfirm(bookingId!);

          await editBooking(bookingId!, {
            status: "confirmed",
          })
        }}>Confirm</Button>
      </div>
    </div>
  );
};

export default BookingDetailPage;
